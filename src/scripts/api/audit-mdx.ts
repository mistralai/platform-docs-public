/**
 * MDX-driven audit.
 *
 * Pipeline:
 *   1. Parse all generated MDX pages (Request Example blocks).
 *   2. For each example, walk the JSON looking for Speakeasy fallbacks /
 *      format mismatches / doubt heuristics.
 *   3. Map each finding back to the source schema property via
 *      json-schema-walker.
 *   4. Propose patches at /components/schemas/<X>/properties/<Y>/example.
 *   5. Skip paths already covered by patch DB or marked ignored.
 *   6. Emit api-examples.draft.yaml sorted by severity then path.
 *
 * Findings are tagged with severity/reason so the user (or `pnpm api:review`)
 * can attack critical first, doubt last.
 */

import { existsSync, readFileSync } from 'node:fs';
import yaml from 'js-yaml';
import { iterateDetections, type Detection, type Severity } from './lib/lorem-detector';
import { parseExamplesFromGlob, type ParsedExample } from './lib/mdx-parser';
import {
  resolveSchemaPointer,
  type Resolution,
} from './lib/json-schema-walker';
import {
  loadPatchDb,
  savePatchDb,
  type Patch,
  type PatchDb,
} from './lib/patch-db';
import { proposePropertyExample } from './lib/propose';
import { getByPointer } from './lib/json-pointer';

type JsonObject = Record<string, any>;

const SOURCE_SPEC = process.env.API_SOURCE_SPEC || './openapi-public-doc.yaml';
const PATCH_DB = process.env.API_PATCH_DB || './src/scripts/api-examples.yaml';
const DRAFT_DB = process.env.API_DRAFT_DB || './src/scripts/api-examples.draft.yaml';
const MDX_GLOB = process.env.API_MDX_GLOB || './src/content/en/api/**/*.mdx';

const SEVERITY_ORDER: Record<Severity, number> = {
  critical: 0,
  warning: 1,
  doubt: 2,
};

type Finding = {
  operationId: string;
  exampleName?: string;
  jsonPath: string[];
  propertyName?: string;
  detection: Detection;
  resolution: Resolution;
  proposedValue: unknown;
};

function findOperation(spec: JsonObject, operationId: string): JsonObject | undefined {
  const paths = spec.paths;
  if (!paths || typeof paths !== 'object') return undefined;
  for (const item of Object.values(paths)) {
    if (!item || typeof item !== 'object') continue;
    for (const op of Object.values(item)) {
      if (
        op &&
        typeof op === 'object' &&
        (op as JsonObject).operationId === operationId
      ) {
        return op as JsonObject;
      }
    }
  }
  return undefined;
}

/**
 * Walk a parsed example, collecting detections paired with their schema
 * resolution.
 */
function collectFindings(
  spec: JsonObject,
  example: ParsedExample
): Finding[] {
  const op = findOperation(spec, example.operationId);
  if (!op) return [];

  // Schema differs by example kind
  let rootSchema: any;
  let walkerOrigin: 'request' | { kind: 'response'; status: string; media: string };
  if (example.kind === 'request') {
    rootSchema = op.requestBody?.content?.['application/json']?.schema;
    walkerOrigin = 'request';
  } else {
    // exampleName is "<status>_<media>", e.g. "200_application-json"
    const status = example.responseStatus ?? '200';
    // Default media: application/json (the only one Speakeasy currently renders examples for)
    const media = (example.exampleName?.split('_').slice(1).join('_') ?? 'application-json');
    rootSchema = op.responses?.[status]?.content?.[media.replace(/-/g, '/')]?.schema;
    walkerOrigin = { kind: 'response', status, media };
  }
  if (!rootSchema) return [];

  const out: Finding[] = [];
  for (const detected of iterateDetections(example.parsed, rootSchema, spec)) {
    const resolution = resolveSchemaPointer(
      spec,
      example.operationId,
      example.parsed,
      detected.jsonPath,
      walkerOrigin
    );

    // Try to generate a heuristic value at the resolved schema location.
    // Falls back to <to fill> only if we can't.
    let proposedValue: unknown = '<to fill>';
    if (resolution.kind === 'resolved') {
      const schemaAtPointer = getByPointer(spec, resolution.schemaPointer);
      if (schemaAtPointer && typeof schemaAtPointer === 'object' && detected.propertyName) {
        const heuristic = proposePropertyExample(
          spec,
          detected.propertyName,
          schemaAtPointer as Record<string, any>
        );
        if (heuristic !== undefined && heuristic !== null) {
          proposedValue = heuristic;
        }
      }
    } else if (resolution.kind === 'ambiguous' && detected.propertyName) {
      // For ambiguous unions, all candidates share the same property name and
      // typically the same scalar type. Try the first candidate's schema.
      const first = resolution.candidates[0];
      const schemaAtPointer = getByPointer(spec, first.schemaPointer);
      if (schemaAtPointer && typeof schemaAtPointer === 'object') {
        const heuristic = proposePropertyExample(
          spec,
          detected.propertyName,
          schemaAtPointer as Record<string, any>
        );
        if (heuristic !== undefined && heuristic !== null) {
          proposedValue = heuristic;
        }
      }
    }

    out.push({
      operationId: example.operationId,
      exampleName: example.exampleName,
      jsonPath: detected.jsonPath,
      propertyName: detected.propertyName,
      detection: detected.detection,
      resolution,
      proposedValue,
    });
  }
  return out;
}

function findingToPatches(finding: Finding): Patch[] {
  const baseNote = (suffix: string) =>
    `auto-proposed (${finding.detection.severity}/${finding.detection.reason}): ${suffix}`;

  // Resolved → single patch at the schema property example
  if (finding.resolution.kind === 'resolved') {
    return [
      {
        path: `${finding.resolution.schemaPointer}/example`,
        value: finding.proposedValue,
        source: 'heuristic',
        severity: finding.detection.severity,
        detectionReason: finding.detection.reason,
        matched: finding.detection.matched,
        note: baseNote(
          `${finding.operationId} ${finding.jsonPath.join('.')} (${finding.detection.hint ?? ''})`
        ),
      },
    ];
  }

  // Ambiguous (oneOf without discriminator) → one patch per candidate
  if (finding.resolution.kind === 'ambiguous') {
    return finding.resolution.candidates.map(c => ({
      path: `${c.schemaPointer}/example`,
      value: finding.proposedValue,
      source: 'heuristic',
      severity: finding.detection.severity,
      detectionReason: finding.detection.reason,
      matched: finding.detection.matched,
      note: baseNote(
        `${finding.operationId} ${finding.jsonPath.join('.')} — ambiguous union, candidate ${c.schemaName ?? '<inline>'}`
      ),
    }));
  }

  // Unresolvable: don't emit a patch at all (the path would be invalid).
  // The console summary already lists these for manual review.
  return [];
}

function sortPatches(patches: Patch[]): Patch[] {
  return [...patches].sort((a, b) => {
    const sa = a.severity ? SEVERITY_ORDER[a.severity] : 99;
    const sb = b.severity ? SEVERITY_ORDER[b.severity] : 99;
    if (sa !== sb) return sa - sb;
    return a.path.localeCompare(b.path);
  });
}

async function main() {
  const argv = process.argv.slice(2);
  const strict = argv.includes('--strict');

  if (!existsSync(SOURCE_SPEC)) {
    console.error(`Source spec not found at ${SOURCE_SPEC}. Run pnpm api:fetch first.`);
    process.exit(1);
  }

  const spec = yaml.load(readFileSync(SOURCE_SPEC, 'utf8')) as JsonObject;
  const patchDb = loadPatchDb(PATCH_DB);
  const examples = await parseExamplesFromGlob(MDX_GLOB);

  if (examples.length === 0) {
    console.error(
      `No Request Example blocks found at ${MDX_GLOB}.\n` +
        `Run pnpm api:apply && npx docs-md first to generate MDX.`
    );
    process.exit(1);
  }

  // Index existing patches by path; ignored paths are also indexed so we don't
  // re-propose for them.
  const existingPaths = new Set(patchDb.patches.map(p => p.path));
  const ignoredPaths = new Set(
    patchDb.patches.filter(p => p.ignored).map(p => p.path)
  );

  const newPatches: Patch[] = [];
  const dedupedPaths = new Set<string>();
  let totalFindings = 0;
  let skippedExisting = 0;
  let skippedIgnored = 0;
  const severityCounts: Record<Severity, number> = { critical: 0, warning: 0, doubt: 0 };
  const operationsWithFindings = new Set<string>();
  const unresolved: Finding[] = [];
  const ambiguous: Finding[] = [];

  for (const ex of examples) {
    const findings = collectFindings(spec, ex);
    if (findings.length > 0) {
      operationsWithFindings.add(ex.operationId);
    }
    for (const finding of findings) {
      totalFindings += 1;
      severityCounts[finding.detection.severity] += 1;
      if (finding.resolution.kind === 'unresolvable') unresolved.push(finding);
      if (finding.resolution.kind === 'ambiguous') ambiguous.push(finding);
      const proposals = findingToPatches(finding);
      for (const p of proposals) {
        if (existingPaths.has(p.path) || ignoredPaths.has(p.path)) {
          skippedExisting += 1;
          continue;
        }
        if (dedupedPaths.has(p.path)) continue; // multiple findings hit same prop
        dedupedPaths.add(p.path);
        newPatches.push(p);
      }
    }
    void skippedIgnored;
  }

  // Build draft DB: existing patches + new proposals (sorted)
  const draftPatches = sortPatches([...patchDb.patches, ...newPatches]);
  const draft: PatchDb = { version: 1, patches: draftPatches };
  savePatchDb(DRAFT_DB, draft);

  // Stats
  console.log('');
  console.log('API examples audit (MDX-driven)');
  console.log('─'.repeat(60));
  console.log(`Source spec:        ${SOURCE_SPEC}`);
  console.log(`MDX glob:           ${MDX_GLOB}`);
  console.log(`Patch DB:           ${PATCH_DB} (${patchDb.patches.length} patches)`);
  console.log(`Draft (output):     ${DRAFT_DB}`);
  console.log('');
  console.log(`MDX examples scanned:   ${examples.length} (${operationsWithFindings.size} ops with findings)`);
  console.log(`Total findings:         ${totalFindings}`);
  console.log(`  critical:             ${severityCounts.critical}`);
  console.log(`  warning:              ${severityCounts.warning}`);
  console.log(`  doubt:                ${severityCounts.doubt}`);
  console.log('');
  console.log(`Resolution:`);
  console.log(`  ambiguous (unions):   ${ambiguous.length}`);
  console.log(`  unresolvable:         ${unresolved.length}`);
  console.log('');
  console.log(`New patches proposed:   ${newPatches.length} (${skippedExisting} skipped, already in DB)`);
  console.log('');

  if (unresolved.length > 0) {
    console.log('Unresolvable findings (review manually in draft):');
    for (const f of unresolved.slice(0, 5)) {
      console.log(
        `  - ${f.operationId} ${f.jsonPath.join('.')}  →  ${
          f.resolution.kind === 'unresolvable' ? f.resolution.reason : ''
        }`
      );
    }
    if (unresolved.length > 5) console.log(`  ... and ${unresolved.length - 5} more`);
    console.log('');
  }

  if (newPatches.length === 0) {
    console.log('Nothing new to review. Spec is clean given current patches.');
  } else {
    console.log(`Edit ${DRAFT_DB} (or run pnpm api:review) then pnpm api:promote.`);
  }

  // Strict mode: fail the build if any non-ignored CRITICAL findings remain.
  // (warning + doubt are reportable but not blocking.)
  if (strict && severityCounts.critical > 0) {
    console.log('');
    console.error(
      `[strict] ${severityCounts.critical} critical finding(s) — aborting build. ` +
        `Patch them in api-examples.yaml or mark as ignored, then re-run.`
    );
    process.exit(1);
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
