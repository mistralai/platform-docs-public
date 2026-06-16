/**
 * Extract / re-inject the translatable prose of an OpenAPI spec.
 *
 * Plan A (see SPEAKEASY-V2-SPIKE.md): instead of letting Lingo translate the
 * ~12 MB of generated MDX (it OOMs), we translate the *source* — the small set
 * of prose fields in the spec — and regenerate the FR docs from a translated
 * spec. This module is the bridge:
 *
 *   extractStrings(spec)   -> { "<json-pointer>": "<english prose>" }   (the catalog)
 *   reinjectStrings(spec, frCatalog) -> mutates spec in place, returns count
 *
 * The catalog is a flat map of JSON pointer -> string where EVERY value is
 * doc-prose meant to be translated. That makes it a safe Lingo input: there are
 * no keys/enums/$refs/examples to accidentally translate.
 */

import { buildPointer, getByPointer, setByPointer } from './json-pointer';

/** Object keys whose string value is human-facing documentation prose. */
const TRANSLATE_KEYS = new Set(['description', 'summary', 'x-displayName']);

/**
 * Subtrees that may contain `description`/`summary` keys which are NOT doc-prose
 * (they are sample payloads or data), so we never descend into them.
 */
const SKIP_SUBTREES = new Set(['example', 'examples', 'enum', 'default', 'const']);

export type StringCatalog = Record<string, string>;

export function extractStrings(spec: unknown): StringCatalog {
  const catalog: StringCatalog = {};

  const walk = (node: unknown, segments: string[]): void => {
    if (Array.isArray(node)) {
      node.forEach((item, index) => walk(item, [...segments, String(index)]));
      return;
    }
    if (node === null || typeof node !== 'object') return;

    for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
      if (SKIP_SUBTREES.has(key)) continue;

      if (TRANSLATE_KEYS.has(key) && typeof value === 'string' && value.trim() !== '') {
        catalog[buildPointer([...segments, key])] = value;
        continue;
      }
      walk(value, [...segments, key]);
    }
  };

  walk(spec, []);
  return catalog;
}

/**
 * Overwrite each pointer in `spec` with its translated value from `catalog`.
 * Pointers absent from the spec (e.g. spec changed since extraction) are skipped
 * so translation degrades gracefully (those fields stay in the source locale).
 */
export function reinjectStrings(spec: unknown, catalog: StringCatalog): number {
  let count = 0;
  for (const [pointer, value] of Object.entries(catalog)) {
    if (typeof value !== 'string' || value.trim() === '') continue;
    if (typeof getByPointer(spec, pointer) !== 'string') continue;
    setByPointer(spec, pointer, value);
    count += 1;
  }
  return count;
}

/** Sort a catalog by key for stable, diff-friendly output. */
export function sortCatalog(catalog: StringCatalog): StringCatalog {
  const sorted: StringCatalog = {};
  for (const key of Object.keys(catalog).sort()) sorted[key] = catalog[key];
  return sorted;
}
