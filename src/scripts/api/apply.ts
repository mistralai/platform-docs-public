/**
 * Build the final OpenAPI spec consumed by docs-md.
 *
 *   source spec (./openapi-public-doc.yaml)
 *     + patch DB (src/scripts/api-examples.yaml)              <- shared examples & overrides
 *     + code-sample DB (src/scripts/api-code-samples.v2.yaml) <- curated x-codeSamples (chat, OCR)
 *     + structural transforms (hoist $defs, prune)
 *   = ./.openapi-docs.yaml
 *     + code-sample overlay from the Speakeasy registry (best-effort)
 *   = ./.openapi-docs.yaml (final)
 *
 * Code samples, best of both worlds (layers, later wins):
 *   1. docs-md generates python/TS samples from the SDK tarballs listed in
 *      speakeasy.config.mjs (offline baseline, versioned in the repo).
 *   2. The curated code-sample DB overrides specific operations (hand-checked
 *      curl bodies, auth placeholder, curated examples).
 *   3. The Speakeasy registry overlay — auto-published by the SDK repos
 *      (client-python, client-ts) on every `speakeasy run` — keeps samples in
 *      sync with the latest SDK versions. Applied on top of the output spec
 *      via `speakeasy pull` + `overlay apply`; requires the speakeasy CLI and
 *      authentication (`speakeasy auth login` / SPEAKEASY_API_KEY). Without
 *      them it is skipped with a warning and the build falls back to 1-2.
 *
 * Patch drift detection: each patch may carry `originalSha` (SHA-256 of the
 * upstream value it overwrote, recorded with --record-shas). On apply:
 *   - target already equals the patch value -> "redundant" (upstream adopted
 *     the fix; the patch can be retired)
 *   - upstream value no longer matches originalSha -> "drifted" (the spec
 *     changed underneath the patch; review needed)
 *
 * Optional flags:
 *   --promote-draft   First copy api-examples.draft.yaml -> api-examples.yaml
 *                     (use after editing the draft).
 *   --check           Don't write anything; report what would change.
 *   --record-shas     Store each patch's upstream SHA in the patch DBs.
 */

import { copyFileSync, existsSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import yaml from 'js-yaml';
import { existsByPointer, getByPointer, setByPointer } from './lib/json-pointer';
import { loadPatchDb, savePatchDb, type Patch, type PatchDb } from './lib/patch-db';
import {
  applyHeuristicExamples,
  applyTagOrder,
  applyTagRenames,
  hoistLocalDefs,
  pruneUnreferencedSchemas,
  removeDeprecatedWorkflowRoutingAliases,
} from './lib/transforms';

type JsonObject = Record<string, any>;

const SOURCE_SPEC = process.env.API_SOURCE_SPEC || './openapi-public-doc.yaml';
const PATCH_DB = process.env.API_PATCH_DB || './src/scripts/api-examples.yaml';
const CODE_SAMPLES_PATCH_DB =
  process.env.API_CODE_SAMPLES_PATCH_DB || './src/scripts/api-code-samples.v2.yaml';
const CODE_SAMPLE_OVERLAYS = (
  process.env.API_CODE_SAMPLE_OVERLAYS ||
  'registry.speakeasyapi.dev/mistral-dev/mistral-dev/mistral-openapi-code-samples'
).split(',');
const DRAFT_DB = process.env.API_DRAFT_DB || './src/scripts/api-examples.draft.yaml';
const OUTPUT_SPEC = process.env.API_OUTPUT_SPEC || './.openapi-docs.yaml';

type CliFlags = {
  promoteDraft: boolean;
  check: boolean;
  recordShas: boolean;
};

function parseArgs(argv: string[]): CliFlags {
  const flags: CliFlags = { promoteDraft: false, check: false, recordShas: false };
  for (const arg of argv) {
    if (arg === '--promote-draft') flags.promoteDraft = true;
    else if (arg === '--check') flags.check = true;
    else if (arg === '--record-shas') flags.recordShas = true;
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: tsx src/scripts/api/apply.ts [--promote-draft] [--check] [--record-shas]');
      process.exit(0);
    } else {
      throw new Error(`Unknown flag: ${arg}`);
    }
  }
  return flags;
}

// Deterministic serialization so equal values always hash equal,
// regardless of key order in the source YAML/JSON.
function canonicalJson(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value) ?? 'null';
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map(k => `${JSON.stringify(k)}:${canonicalJson((value as JsonObject)[k])}`).join(',')}}`;
}

function stableSha(value: unknown): string {
  return createHash('sha256').update(canonicalJson(value)).digest('hex');
}

type PatchStats = {
  applied: number;
  ignored: number;
  orphans: Patch[];
  redundant: Patch[];
  drifted: Patch[];
  // path -> SHA-256 of the upstream value before this run's application
  recorded: Map<string, string>;
};

function applyPatches(spec: JsonObject, patches: Patch[]): PatchStats {
  let applied = 0;
  let ignored = 0;
  const orphans: Patch[] = [];
  const redundant: Patch[] = [];
  const drifted: Patch[] = [];
  const recorded = new Map<string, string>();
  for (const patch of patches) {
    if (patch.ignored) {
      ignored += 1;
      continue;
    }
    const parent = patch.path.split('/').slice(0, -1).join('/');
    if (parent && !existsByPointer(spec, parent)) {
      orphans.push(patch);
      continue;
    }
    const current = existsByPointer(spec, patch.path)
      ? getByPointer(spec, patch.path)
      : undefined;
    recorded.set(patch.path, stableSha(current));

    if (canonicalJson(current) === canonicalJson(patch.value)) {
      redundant.push(patch);
    } else if (patch.originalSha && patch.originalSha !== recorded.get(patch.path)) {
      drifted.push(patch);
    }

    setByPointer(spec, patch.path, patch.value);
    applied += 1;
  }
  return { applied, ignored, orphans, redundant, drifted, recorded };
}

function execSyncReason(err: unknown): string {
  const any = err as { stderr?: { toString(): string }; message?: string };
  const text = any.stderr?.toString().trim() || any.message || String(err);
  return text.split('\n')[0];
}

// A registry location looks like
//   registry.speakeasyapi.dev/<org>/<workspace>/<spec-name>[:<tag>]
// `speakeasy pull` wants the bare spec name via --spec (positional locations
// fail silently, even when authenticated).
function specNameFromLocation(location: string): { name: string; revision?: string } {
  const last = location.trim().replace(/^registry\.speakeasyapi\.dev\//, '').split('/').pop() ?? '';
  const idx = last.indexOf(':');
  if (idx > 0) return { name: last.slice(0, idx), revision: last.slice(idx + 1) };
  return { name: last };
}

function overlayTarget(overlayPath: string): string {
  const title = /^  title: (.+)$/m.exec(readFileSync(overlayPath, 'utf8'));
  return title?.[1]?.trim() ?? 'unknown target';
}

// Applies registry code-sample overlays onto the OUTPUT spec file, in place.
// Best-effort: on any failure (CLI missing, unauthenticated, artifact absent)
// the overlay is skipped with a warning and the build continues on the
// offline layers (tarballs + curated DB).
function applyCodeSampleOverlays(specPath: string): void {
  for (const overlayLocation of CODE_SAMPLE_OVERLAYS) {
    if (!overlayLocation.trim()) continue;
    const { name, revision } = specNameFromLocation(overlayLocation);
    console.log(`  Fetching registry overlay: ${overlayLocation}`);
    const tmpDir = mkdtempSync(join(tmpdir(), 'speakeasy-overlays-'));
    try {
      const revArg = revision ? ` --revision "${revision}"` : '';
      execSync(`speakeasy pull --spec "${name}"${revArg} --output-dir "${tmpDir}"`, {
        stdio: 'pipe',
      });
      const overlayFile = readdirSync(tmpDir).find(f => /\.(ya?ml|json)$/i.test(f));
      if (!overlayFile) {
        console.warn(`  ⚠ pulled bundle contains no overlay artifact; skipping`);
        continue;
      }
      const overlayPath = join(tmpDir, overlayFile);
      console.log(`  Pulled overlay: ${overlayTarget(overlayPath)}`);
      execSync(
        `speakeasy overlay apply -s "${specPath}" -o "${overlayPath}" --out "${specPath}.tmp"`,
        { stdio: 'pipe' }
      );
      if (existsSync(`${specPath}.tmp`)) {
        execSync(`mv "${specPath}.tmp" "${specPath}"`);
      }
      console.log(`  ✓ registry overlay applied (${overlayFile})`);
    } catch (err) {
      console.warn(`  ⚠ registry overlay skipped: ${execSyncReason(err)}`);
      console.warn(
        `    install the speakeasy CLI and run 'speakeasy auth login' (or set SPEAKEASY_API_KEY); set API_CODE_SAMPLE_OVERLAYS='' to silence`
      );
    } finally {
      rmSync(tmpDir, { recursive: true, force: true });
    }
  }
}

function normalizeAuthPlaceholder(specPath: string): void {
  const content = readFileSync(specPath, 'utf8');
  const replaced = content.replace(/YOUR_APIKEY_HERE/g, '$MISTRAL_API_KEY');
  if (replaced !== content) {
    writeFileSync(specPath, replaced);
    console.log('  Normalized auth placeholder: YOUR_APIKEY_HERE -> $MISTRAL_API_KEY');
  }
}

function main() {
  const flags = parseArgs(process.argv.slice(2));

  if (flags.promoteDraft) {
    if (!existsSync(DRAFT_DB)) {
      console.error(`No draft to promote at ${DRAFT_DB}. Run pnpm api:audit first.`);
      process.exit(1);
    }
    if (!flags.check) {
      copyFileSync(DRAFT_DB, PATCH_DB);
      console.log(`Promoted ${DRAFT_DB} -> ${PATCH_DB}`);
    } else {
      console.log(`[check] Would promote ${DRAFT_DB} -> ${PATCH_DB}`);
    }
  }

  const spec = yaml.load(readFileSync(SOURCE_SPEC, 'utf8')) as JsonObject;

  const dbFiles: Array<{ file: string; db: PatchDb }> = [
    { file: PATCH_DB, db: loadPatchDb(PATCH_DB) },
    { file: CODE_SAMPLES_PATCH_DB, db: loadPatchDb(CODE_SAMPLES_PATCH_DB) },
  ];

  // Pass 1: examples DB + structural transforms. The curated code-samples DB
  // is deliberately NOT applied here: it runs after the registry overlay so
  // the hand-checked samples win on the operations they cover (the overlay
  // replaces x-codeSamples wholesale).
  const r1 = applyPatches(spec, dbFiles[0].db.patches);
  const { renamed } = applyTagRenames(spec);
  const { moved } = applyTagOrder(spec);
  const { removed } = removeDeprecatedWorkflowRoutingAliases(spec);
  const { hoisted } = hoistLocalDefs(spec);
  const { pruned } = pruneUnreferencedSchemas(spec);
  const { filled } = applyHeuristicExamples(spec);

  // Pass 2: curated code samples on top of the (registry-overlaid) output
  // spec, so their upstream baseline for drift detection is what the registry
  // shipped. In --check mode we approximate against the in-memory spec.
  const empty: PatchStats = {
    applied: 0,
    ignored: 0,
    orphans: [],
    redundant: [],
    drifted: [],
    recorded: new Map(),
  };
  let r2: PatchStats = empty;
  if (!flags.check) {
    writeFileSync(OUTPUT_SPEC, yaml.dump(spec, { lineWidth: -1, noRefs: true }));
    applyCodeSampleOverlays(OUTPUT_SPEC);
    const patched = yaml.load(readFileSync(OUTPUT_SPEC, 'utf8')) as JsonObject;
    r2 = applyPatches(patched, dbFiles[1].db.patches);
    writeFileSync(OUTPUT_SPEC, yaml.dump(patched, { lineWidth: -1, noRefs: true }));
    normalizeAuthPlaceholder(OUTPUT_SPEC);
  } else {
    r2 = applyPatches(spec, dbFiles[1].db.patches);
  }

  const applied = r1.applied + r2.applied;
  const ignored = r1.ignored + r2.ignored;
  const orphans = [...r1.orphans, ...r2.orphans];
  const redundant = [...r1.redundant, ...r2.redundant];
  const drifted = [...r1.drifted, ...r2.drifted];
  const recorded = new Map([...r1.recorded, ...r2.recorded]);

  if (flags.recordShas && !flags.check) {
    for (const { file, db } of dbFiles) {
      let touched = 0;
      for (const patch of db.patches) {
        const sha = recorded.get(patch.path);
        if (sha !== undefined && patch.originalSha !== sha) {
          patch.originalSha = sha;
          touched += 1;
        }
      }
      if (touched > 0) {
        savePatchDb(file, db);
        console.log(`Recorded ${touched} upstream SHA(s) in ${file}`);
      }
    }
  }

  console.log('');
  console.log('Build OpenAPI for docs');
  console.log('─'.repeat(60));
  console.log(`Source:    ${SOURCE_SPEC}`);
  console.log(`Patch DB:  ${PATCH_DB}`);
  console.log(`Samples:   ${CODE_SAMPLES_PATCH_DB}`);
  console.log(`Overlays:  ${CODE_SAMPLE_OVERLAYS.join(', ') || '(none)'}`);
  console.log(`Output:    ${OUTPUT_SPEC}${flags.check ? ' [check only]' : ''}`);
  console.log('');
  console.log(`Patches applied:   ${applied}`);
  console.log(`Patches ignored:   ${ignored}`);
  console.log(`Patches orphaned:  ${orphans.length}`);
  console.log(`Patches redundant: ${redundant.length}`);
  console.log(`Patches drifted:   ${drifted.length}`);
  console.log(`Tags renamed:      ${renamed}`);
  console.log(`Tags reordered:    ${moved}`);
  console.log(`Workflow aliases removed: ${removed}`);
  console.log(`$defs hoisted:     ${hoisted}`);
  console.log(`Schemas pruned:    ${pruned}`);
  console.log(`Examples filled:   ${filled}`);

  if (redundant.length > 0) {
    console.log('');
    console.log('Redundant patches (upstream now ships the same value; consider removing):');
    for (const patch of redundant) console.log(`  - ${patch.path}`);
  }

  if (drifted.length > 0) {
    console.log('');
    console.log('Drifted patches (upstream value changed since originalSha was recorded; review):');
    for (const patch of drifted) console.log(`  - ${patch.path}`);
  }

  if (orphans.length > 0) {
    console.log('');
    console.log('Orphan patches (path no longer exists in source):');
    for (const orphan of orphans) console.log(`  - ${orphan.path}`);
    console.log('');
    console.log('Fix: edit the patch DB to remove or update these entries.');
    if (!flags.check) process.exitCode = 1;
  }
}

main();
