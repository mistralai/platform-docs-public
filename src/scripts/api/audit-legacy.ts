/**
 * Scan the source OpenAPI spec, find operations whose request body example is
 * missing or contains placeholder content, and write proposals to
 * api-examples.draft.yaml for human review.
 *
 * Workflow:
 *   1. Load source spec (./openapi-public-doc.yaml by default).
 *   2. Load existing patch DB (src/scripts/api-examples.yaml).
 *   3. Apply patches in-memory so we audit the *effective* spec (not the raw one).
 *   4. For each operation with a JSON request body:
 *        - Compute its current example.
 *        - If missing or placeholder, generate a heuristic proposal.
 *        - Add it to the draft DB (under the same JSON pointer it would write to).
 *   5. Detect orphan patches (paths that no longer exist in the spec).
 *   6. Write api-examples.draft.yaml + print a summary.
 *
 * The user then edits the draft and runs `pnpm api:apply` to merge it back.
 */

import { readFileSync } from 'node:fs';
import yaml from 'js-yaml';
import { existsByPointer, getByPointer, escapeSegment, setByPointer } from './lib/json-pointer';
import { iterateDetections } from './lib/lorem-detector';

// Adapter: legacy code expected a single boolean-ish return for the WHOLE
// example. The new detector yields per-leaf findings, so wrap it.
function detectPlaceholderInExample(value: unknown): { isPlaceholder: boolean; reason?: string; matched?: string } {
  for (const f of iterateDetections(value, undefined, {})) {
    if (f.detection.severity === 'critical') {
      return { isPlaceholder: true, reason: f.detection.reason, matched: f.detection.matched };
    }
  }
  return { isPlaceholder: false };
}
import { loadPatchDb, savePatchDb, indexByPath, type Patch, type PatchDb } from './lib/patch-db';
import { generateRequestBodyExample } from './lib/propose';

type JsonObject = Record<string, any>;

const SOURCE_SPEC = process.env.API_SOURCE_SPEC || './openapi-public-doc.yaml';
const PATCH_DB = process.env.API_PATCH_DB || './src/scripts/api-examples.yaml';
const DRAFT_DB = process.env.API_DRAFT_DB || './src/scripts/api-examples.draft.yaml';

const HTTP_METHODS = new Set([
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'head',
  'options',
  'trace',
]);

type OperationRef = {
  method: string;
  path: string;
  operationId: string | undefined;
  operation: JsonObject;
};

function isObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function* iterateOperations(spec: JsonObject): Iterable<OperationRef> {
  const paths = spec.paths;
  if (!isObject(paths)) return;

  for (const [path, pathItem] of Object.entries(paths)) {
    if (!isObject(pathItem)) continue;
    for (const [method, operation] of Object.entries(pathItem)) {
      if (!HTTP_METHODS.has(method.toLowerCase())) continue;
      if (!isObject(operation)) continue;
      yield {
        method: method.toLowerCase(),
        path,
        operationId: typeof operation.operationId === 'string' ? operation.operationId : undefined,
        operation,
      };
    }
  }
}

function applyPatchesInMemory(spec: JsonObject, db: PatchDb): {
  applied: number;
  ignored: number;
  orphans: Patch[];
} {
  let applied = 0;
  let ignored = 0;
  const orphans: Patch[] = [];
  for (const patch of db.patches) {
    if (patch.ignored) {
      ignored += 1;
      continue; // ignored paths are tracked in indexedExisting; never written
    }
    // We allow patches that create new keys, but flag a patch as orphan if its
    // parent path doesn't exist (e.g. operation was renamed/removed upstream).
    const parentSegments = patch.path.split('/').slice(0, -1).join('/');
    if (parentSegments && !existsByPointer(spec, parentSegments)) {
      orphans.push(patch);
      continue;
    }
    setByPointer(spec, patch.path, patch.value);
    applied += 1;
  }
  return { applied, ignored, orphans };
}

function requestBodyExamplePointer(path: string, method: string): string {
  return `/paths/${escapeSegment(path)}/${method}/requestBody/content/${escapeSegment('application/json')}/example`;
}

function readEffectiveExample(spec: JsonObject, path: string, method: string): unknown {
  const exPointer = requestBodyExamplePointer(path, method);
  const example = getByPointer(spec, exPointer);
  if (example !== undefined) return example;

  // Fallback: examples (plural)
  const examplesPointer = `/paths/${escapeSegment(path)}/${method}/requestBody/content/${escapeSegment('application/json')}/examples`;
  const examples = getByPointer(spec, examplesPointer);
  if (isObject(examples)) {
    const first = Object.values(examples)[0] as JsonObject | undefined;
    if (isObject(first) && first.value !== undefined) return first.value;
  }
  return undefined;
}

function operationHasJsonRequestBody(operation: JsonObject): boolean {
  return isObject(operation?.requestBody?.content?.['application/json']);
}

type Finding = {
  path: string;
  method: string;
  operationId: string | undefined;
  pointer: string;
  reason: 'missing' | 'placeholder';
  detail?: string;
  proposal: unknown;
};

async function main() {
  const sourceSpec = yaml.load(readFileSync(SOURCE_SPEC, 'utf8')) as JsonObject;
  const patchDb = loadPatchDb(PATCH_DB);

  const effectiveSpec: JsonObject = JSON.parse(JSON.stringify(sourceSpec));
  const { applied, ignored, orphans } = applyPatchesInMemory(effectiveSpec, patchDb);

  // Ignored paths are considered "covered": audit will not propose anything for them.
  const ignoredPaths = new Set(
    patchDb.patches.filter(p => p.ignored).map(p => p.path)
  );

  const findings: Finding[] = [];
  let totalOps = 0;
  let opsWithBody = 0;
  let opsClean = 0;
  let opsIgnored = 0;

  for (const { path, method, operationId, operation } of iterateOperations(effectiveSpec)) {
    totalOps += 1;
    if (!operationHasJsonRequestBody(operation)) continue;
    opsWithBody += 1;

    const pointer = requestBodyExamplePointer(path, method);
    if (ignoredPaths.has(pointer)) {
      opsIgnored += 1;
      continue;
    }

    const example = readEffectiveExample(effectiveSpec, path, method);

    if (example === undefined) {
      const proposal = generateRequestBodyExample(sourceSpec, operation);
      findings.push({
        path,
        method,
        operationId,
        pointer,
        reason: 'missing',
        proposal: proposal ?? null,
      });
      continue;
    }

    const detection = detectPlaceholderInExample(example);
    if (detection.isPlaceholder) {
      const proposal = generateRequestBodyExample(sourceSpec, operation);
      findings.push({
        path,
        method,
        operationId,
        pointer,
        reason: 'placeholder',
        detail: `${detection.reason}: ${detection.matched}`,
        proposal: proposal ?? example,
      });
      continue;
    }

    opsClean += 1;
  }

  // Build draft DB: existing user patches + new proposals.
  // We never overwrite existing patches; missing ones get a `source: heuristic`
  // marker so the user can spot what they need to review.
  const indexedExisting = indexByPath(patchDb);
  const draft: PatchDb = { version: 1, patches: [] };

  for (const patch of patchDb.patches) draft.patches.push(patch);

  let newProposals = 0;
  for (const finding of findings) {
    if (indexedExisting.has(finding.pointer)) continue;
    draft.patches.push({
      path: finding.pointer,
      value: finding.proposal,
      note: `auto-proposed (${finding.reason}${finding.detail ? `: ${finding.detail}` : ''}) — review and edit, then run pnpm api:apply`,
      source: 'heuristic',
    });
    newProposals += 1;
  }

  savePatchDb(DRAFT_DB, draft);

  console.log('');
  console.log('API examples audit');
  console.log('─'.repeat(60));
  console.log(`Source spec:          ${SOURCE_SPEC}`);
  console.log(`Patch DB:             ${PATCH_DB}`);
  console.log(`Draft (output):       ${DRAFT_DB}`);
  console.log('');
  console.log(`Operations scanned:   ${totalOps}`);
  console.log(`  with JSON body:     ${opsWithBody}`);
  console.log(`  with clean example: ${opsClean}`);
  console.log(`  ignored explicitly: ${opsIgnored}`);
  console.log(`  needing attention:  ${findings.length}`);
  console.log('');
  console.log(`Patches applied:      ${applied}`);
  console.log(`Patches ignored:      ${ignored}`);
  console.log(`Patches orphaned:     ${orphans.length}`);
  console.log(`New proposals:        ${newProposals}`);
  console.log('');

  if (orphans.length > 0) {
    console.log('Orphan patches (path no longer exists in the spec):');
    for (const orphan of orphans) {
      console.log(`  - ${orphan.path}`);
    }
    console.log('');
  }

  if (findings.length > 0) {
    console.log('Operations needing attention:');
    for (const finding of findings.slice(0, 20)) {
      const tag = finding.reason === 'missing' ? '[missing]' : '[placeholder]';
      console.log(
        `  ${tag} ${finding.method.toUpperCase()} ${finding.path}${
          finding.operationId ? ` (${finding.operationId})` : ''
        }${finding.detail ? ` — ${finding.detail}` : ''}`
      );
    }
    if (findings.length > 20) {
      console.log(`  ... and ${findings.length - 20} more (see ${DRAFT_DB})`);
    }
    console.log('');
    console.log(`Edit ${DRAFT_DB} then run: pnpm api:apply`);
  } else {
    console.log('All operations have clean examples. Nothing to review.');
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
