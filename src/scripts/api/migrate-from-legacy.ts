/**
 * One-shot migration: convert legacy override formats into a single
 * api-examples.yaml patch DB.
 *
 * Sources merged:
 *   1. src/scripts/api-docs-overrides.yaml
 *      - operations.<operationId>.<key> -> JSON pointer at the operation
 *   2. Hardcoded patches from src/scripts/preprocess-openapi-for-docs.ts:
 *      - prompt caching descriptions / PromptTokensDetails / UsageInfo additions
 *      - embedding example
 *      - binary response schema examples
 *      - multipart/form-data file shape
 *
 * Run once:
 *   npx tsx src/scripts/api/migrate-from-legacy.ts
 *
 * After this, api-docs-overrides.yaml and the hardcoded patches in the old
 * preprocess script can be removed.
 */

import { existsSync, readFileSync } from 'node:fs';
import yaml from 'js-yaml';
import { escapeSegment } from './lib/json-pointer';
import { loadPatchDb, savePatchDb, type Patch, type PatchDb } from './lib/patch-db';

type JsonObject = Record<string, any>;

const SOURCE_SPEC = process.env.API_SOURCE_SPEC || './openapi-public-doc.yaml';
const LEGACY_OVERRIDES = './src/scripts/api-docs-overrides.yaml';
const PATCH_DB = process.env.API_PATCH_DB || './src/scripts/api-examples.yaml';

const PROMPT_CACHE_KEY_DESCRIPTION =
  'A cache key for prompt caching. Use the same key for requests with shared prompt prefixes, such as multi-turn conversations or repeated system prompts, to increase cache hits. Cached tokens are billed at 10% of the standard input token price.';

function isObject(v: unknown): v is JsonObject {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function findOperationLocation(
  spec: JsonObject,
  operationId: string
): { path: string; method: string } | undefined {
  const paths = spec.paths;
  if (!isObject(paths)) return undefined;
  for (const [path, pathItem] of Object.entries(paths)) {
    if (!isObject(pathItem)) continue;
    for (const [method, operation] of Object.entries(pathItem)) {
      if (isObject(operation) && operation.operationId === operationId) {
        return { path, method };
      }
    }
  }
  return undefined;
}

function migrateLegacyOverrides(spec: JsonObject): Patch[] {
  if (!existsSync(LEGACY_OVERRIDES)) return [];
  const raw = yaml.load(readFileSync(LEGACY_OVERRIDES, 'utf8')) as JsonObject;
  const operations = raw?.operations;
  if (!isObject(operations)) return [];

  const patches: Patch[] = [];
  for (const [operationId, override] of Object.entries(operations)) {
    if (!isObject(override)) continue;
    const loc = findOperationLocation(spec, operationId);
    if (!loc) {
      console.warn(`  skip: operation ${operationId} not found in spec`);
      continue;
    }
    for (const [key, value] of Object.entries(override)) {
      patches.push({
        path: `/paths/${escapeSegment(loc.path)}/${loc.method}/${escapeSegment(key)}`,
        value,
        note: `migrated from api-docs-overrides.yaml (${operationId})`,
        source: 'migrated',
      });
    }
  }
  return patches;
}

function buildHardcodedPatches(): Patch[] {
  const patches: Patch[] = [];

  // Prompt cache key descriptions
  for (const schemaName of [
    'ChatCompletionRequest',
    'FIMCompletionRequest',
    'AgentsCompletionRequest',
  ]) {
    patches.push({
      path: `/components/schemas/${schemaName}/properties/prompt_cache_key/description`,
      value: PROMPT_CACHE_KEY_DESCRIPTION,
      note: 'migrated from preprocess-openapi-for-docs.ts (patchPromptCachingFields)',
      source: 'migrated',
    });
  }

  // PromptTokensDetails schema injection
  patches.push({
    path: '/components/schemas/PromptTokensDetails',
    value: {
      type: 'object',
      properties: {
        cached_tokens: { type: 'integer', title: 'Cached Tokens', default: 0 },
      },
      additionalProperties: false,
      title: 'PromptTokensDetails',
      description: 'Token usage details for the prompt.',
    },
    note: 'migrated from preprocess-openapi-for-docs.ts',
    source: 'migrated',
  });

  // UsageInfo additions
  patches.push({
    path: '/components/schemas/UsageInfo/properties/num_cached_tokens',
    value: { anyOf: [{ type: 'integer' }, { type: 'null' }], title: 'Num Cached Tokens' },
    source: 'migrated',
  });
  patches.push({
    path: '/components/schemas/UsageInfo/properties/prompt_tokens_details',
    value: {
      anyOf: [{ $ref: '#/components/schemas/PromptTokensDetails' }, { type: 'null' }],
    },
    source: 'migrated',
  });
  patches.push({
    path: '/components/schemas/UsageInfo/properties/prompt_token_details',
    value: {
      anyOf: [{ $ref: '#/components/schemas/PromptTokensDetails' }, { type: 'null' }],
    },
    source: 'migrated',
  });

  // Audio speech response (binary as JSON)
  patches.push({
    path: `/paths/${escapeSegment('/v1/audio/speech')}/post/responses/200/content/${escapeSegment('application/json')}/schema/properties/audio_data/example`,
    value: 'base64-encoded-audio-data',
    source: 'migrated',
  });

  // Audio voice sample (audio/wav)
  patches.push({
    path: `/paths/${escapeSegment('/v1/audio/voices/{voice_id}/sample')}/get/responses/200/content/${escapeSegment('audio/wav')}/schema/example`,
    value: 'base64-encoded-data',
    source: 'migrated',
  });

  // File content (octet-stream)
  patches.push({
    path: `/paths/${escapeSegment('/v1/files/{file_id}/content')}/get/responses/200/content/${escapeSegment('application/octet-stream')}/schema/example`,
    value: 'base64-encoded-data',
    source: 'migrated',
  });

  // Signed-url endpoints
  for (const path of [
    '/v1/libraries/{library_id}/documents/{document_id}/signed-url',
    '/v1/libraries/{library_id}/documents/{document_id}/extracted-text-signed-url',
  ]) {
    patches.push({
      path: `/paths/${escapeSegment(path)}/get/responses/200/content/${escapeSegment('application/json')}/schema/example`,
      value: 'https://example.com/signed-url',
      source: 'migrated',
    });
  }

  return patches;
}

function main() {
  const spec = yaml.load(readFileSync(SOURCE_SPEC, 'utf8')) as JsonObject;
  const existing = loadPatchDb(PATCH_DB);

  const fromOverrides = migrateLegacyOverrides(spec);
  const fromHardcoded = buildHardcodedPatches();

  // Deduplicate by path: existing user patches always win.
  const existingPaths = new Set(existing.patches.map(p => p.path));
  const merged: Patch[] = [...existing.patches];
  let added = 0;
  let skipped = 0;
  for (const patch of [...fromOverrides, ...fromHardcoded]) {
    if (existingPaths.has(patch.path)) {
      skipped += 1;
      continue;
    }
    merged.push(patch);
    existingPaths.add(patch.path);
    added += 1;
  }

  const out: PatchDb = { version: 1, patches: merged };
  savePatchDb(PATCH_DB, out);

  console.log('');
  console.log('Migration to api-examples.yaml');
  console.log('─'.repeat(60));
  console.log(`Existing patches:  ${existing.patches.length}`);
  console.log(`From overrides:    ${fromOverrides.length}`);
  console.log(`From hardcoded:    ${fromHardcoded.length}`);
  console.log(`Added:             ${added}`);
  console.log(`Skipped (already): ${skipped}`);
  console.log(`Total:             ${merged.length}`);
  console.log('');
  console.log(`Wrote ${PATCH_DB}`);
}

main();
