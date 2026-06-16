/**
 * Extract the translatable prose of the generated OpenAPI spec into a flat
 * catalog that Lingo (or any MT) translates per locale.
 *
 *   .openapi-docs.yaml  ->  src/content/en/api/_i18n/strings.json
 *
 * The catalog lives under `en/api/_i18n/` (a `_`-prefixed dir → never routed,
 * see src/lib/content/locale-content.ts) and is matched by Lingo's existing
 * `src/content/en/**\/*.json` pattern, so Lingo emits
 * `src/content/fr/api/_i18n/strings.json`. `build-fr.ts` then re-injects that
 * FR catalog into the spec and regenerates the FR docs.
 *
 * Env:
 *   SPEAKEASY_OPENAPI_YAML   source spec (default ./.openapi-docs.yaml)
 *   API_STRINGS_OUT          output catalog (default en/api/_i18n/strings.json)
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import yaml from 'js-yaml';
import { extractStrings, sortCatalog } from './lib/spec-strings';

const SPEC = process.env.SPEAKEASY_OPENAPI_YAML || './.openapi-docs.yaml';
const OUT =
  process.env.API_STRINGS_OUT || './src/content/en/api/_i18n/strings.json';

function main() {
  const spec = yaml.load(readFileSync(SPEC, 'utf8'));
  const catalog = sortCatalog(extractStrings(spec));
  const count = Object.keys(catalog).length;

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(catalog, null, 2) + '\n');

  const bytes = Buffer.byteLength(JSON.stringify(catalog));
  console.log('');
  console.log('Extract API prose for translation');
  console.log('─'.repeat(60));
  console.log(`Spec:    ${SPEC}`);
  console.log(`Catalog: ${OUT}`);
  console.log(`Strings: ${count} (${(bytes / 1024).toFixed(0)} KB)`);
}

main();
