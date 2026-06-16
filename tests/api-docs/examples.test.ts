/**
 * T5 — Generated examples must not ship Speakeasy lorem placeholders.
 *
 * docs-md fills missing examples from a fixed pool of lorem strings
 * (`lib/lorem-detector` `SPEAKEASY_FALLBACK_STRINGS`) — those are broken sample
 * values. We extract every example block from the EN pages and flag any leaf
 * value that is *exactly* a Speakeasy fallback string (or the fallback date).
 * Exact-equality (not substring) mirrors the detector's "zero false positives"
 * contract — several fallback entries are short words ("dolor", "sunt").
 *
 * REQUEST examples are the curated surface (patch DB / `api:audit`); RESPONSE
 * examples are largely Speakeasy-generated and mostly uncurated. Both are tracked
 * as reviewable snapshots (cf. `gaps.test.ts`) so the suite stays green while any
 * regression (new lorem) or cleanup (fewer ops) shows up in the diff. Flip the
 * request list to a hard `expect([]).toEqual(...)` once it is curated to zero.
 *
 * EN only; reads committed MDX, so no spec / `api:apply` needed.
 */

import { describe, expect, it } from 'vitest';
import { parseExamplesFromGlob } from '@/scripts/api/lib/mdx-parser';
import {
  SPEAKEASY_FALLBACK_DATE,
  SPEAKEASY_FALLBACK_STRINGS,
} from '@/scripts/api/lib/lorem-detector';

function* leaves(value: unknown): Generator<string> {
  if (typeof value === 'string') yield value;
  else if (Array.isArray(value)) for (const v of value) yield* leaves(v);
  else if (value && typeof value === 'object') for (const v of Object.values(value)) yield* leaves(v);
}

const isLorem = (s: string): boolean =>
  SPEAKEASY_FALLBACK_STRINGS.has(s) || s === SPEAKEASY_FALLBACK_DATE;

describe('EN examples — Speakeasy lorem placeholders', () => {
  it('lorem-bearing operations (tracked snapshot, split by example kind)', async () => {
    const examples = await parseExamplesFromGlob('./src/content/en/api/**/*.mdx');
    const request = new Set<string>();
    const response = new Set<string>();
    for (const ex of examples) {
      if (![...leaves(ex.parsed)].some(isLorem)) continue;
      (ex.kind === 'request' ? request : response).add(ex.operationId);
    }
    expect({
      request: [...request].sort(),
      response: [...response].sort(),
    }).toMatchSnapshot();
  });
});
