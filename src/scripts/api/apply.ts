/**
 * Build the final OpenAPI spec consumed by docs-md.
 *
 *   source spec (./openapi-public-doc.yaml)
 *     + patch DB (src/scripts/api-examples.yaml)   <- user-edited examples & overrides
 *     + structural transforms (hoist $defs, prune)
 *   = ./.openapi-docs.yaml
 *
 * Optional flags:
 *   --promote-draft   First copy api-examples.draft.yaml -> api-examples.yaml
 *                     (use after editing the draft).
 *   --check           Don't write anything; report what would change.
 */

import { copyFileSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import yaml from 'js-yaml';
import { existsByPointer, setByPointer } from './lib/json-pointer';
import { loadPatchDb, type Patch } from './lib/patch-db';
import {
  applyHeuristicExamples,
  applyTagOrder,
  applyTagRenames,
  hoistLocalDefs,
  pruneUnreferencedSchemas,
} from './lib/transforms';

type JsonObject = Record<string, any>;

const SOURCE_SPEC = process.env.API_SOURCE_SPEC || './openapi-public-doc.yaml';
const PATCH_DB = process.env.API_PATCH_DB || './src/scripts/api-examples.yaml';
const DRAFT_DB = process.env.API_DRAFT_DB || './src/scripts/api-examples.draft.yaml';
const OUTPUT_SPEC = process.env.API_OUTPUT_SPEC || './.openapi-docs.yaml';

type CliFlags = {
  promoteDraft: boolean;
  check: boolean;
};

function parseArgs(argv: string[]): CliFlags {
  const flags: CliFlags = { promoteDraft: false, check: false };
  for (const arg of argv) {
    if (arg === '--promote-draft') flags.promoteDraft = true;
    else if (arg === '--check') flags.check = true;
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: tsx src/scripts/api/apply.ts [--promote-draft] [--check]');
      process.exit(0);
    } else {
      throw new Error(`Unknown flag: ${arg}`);
    }
  }
  return flags;
}

function applyPatches(spec: JsonObject, patches: Patch[]): {
  applied: number;
  ignored: number;
  orphans: Patch[];
} {
  let applied = 0;
  let ignored = 0;
  const orphans: Patch[] = [];
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
    setByPointer(spec, patch.path, patch.value);
    applied += 1;
  }
  return { applied, ignored, orphans };
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
  const db = loadPatchDb(PATCH_DB);

  const { applied, ignored, orphans } = applyPatches(spec, db.patches);
  const { renamed } = applyTagRenames(spec);
  const { moved } = applyTagOrder(spec);
  const { hoisted } = hoistLocalDefs(spec);
  const { pruned } = pruneUnreferencedSchemas(spec);
  const { filled } = applyHeuristicExamples(spec);

  if (!flags.check) {
    writeFileSync(OUTPUT_SPEC, yaml.dump(spec, { lineWidth: -1, noRefs: true }));
  }

  console.log('');
  console.log('Build OpenAPI for docs');
  console.log('─'.repeat(60));
  console.log(`Source:    ${SOURCE_SPEC}`);
  console.log(`Patch DB:  ${PATCH_DB} (${db.patches.length} entries)`);
  console.log(`Output:    ${OUTPUT_SPEC}${flags.check ? ' [check only]' : ''}`);
  console.log('');
  console.log(`Patches applied:   ${applied}`);
  console.log(`Patches ignored:   ${ignored}`);
  console.log(`Patches orphaned:  ${orphans.length}`);
  console.log(`Tags renamed:      ${renamed}`);
  console.log(`Tags reordered:    ${moved}`);
  console.log(`$defs hoisted:     ${hoisted}`);
  console.log(`Schemas pruned:    ${pruned}`);
  console.log(`Examples filled:   ${filled}`);

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
