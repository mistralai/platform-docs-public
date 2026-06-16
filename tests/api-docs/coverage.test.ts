/**
 * T1 — Endpoint + payload coverage.
 * For every spec operation, in every locale, assert the generated rendition
 * (sidebar-metadata + page.mdx) covers it: present under the right slug, with the
 * request/response payload fields and parameters rendered.
 */

import { describe, expect, it } from 'vitest';
import { loadSpecIndex } from './lib/spec-index';
import {
  LOCALES,
  loadRendition,
  readPage,
  requestProps,
  successResponseProps,
} from './lib/rendition';

const spec = loadSpecIndex();
const opCases = spec.operations.map(o => [o.operationId, o] as const);

describe.each(LOCALES)('API coverage [%s]', locale => {
  const rendition = loadRendition(locale);

  it('has at least as many rendered operations as the spec', () => {
    expect(rendition.byOperationId.size).toBeGreaterThanOrEqual(spec.operations.length);
  });

  it('every rendered operation exists in the spec (no orphans)', () => {
    const specIds = new Set(spec.operations.map(o => o.operationId));
    const orphans = [...rendition.byOperationId.keys()].filter(id => !specIds.has(id));
    expect(orphans, `orphan operations not in spec: ${orphans.join(', ')}`).toEqual([]);
  });

  describe.each(opCases)('%s', (_id, op) => {
    const found = rendition.byOperationId.get(op.operationId);

    it('present under a slug derived from one of its tags', () => {
      expect(found, `${op.method.toUpperCase()} ${op.path} missing from ${locale}`).toBeTruthy();
      expect(
        op.slugCandidates,
        `${op.operationId} rendered under ${found!.slug}, expected one of ${op.slugCandidates.join(', ')}`
      ).toContain(found!.slug);
      expect(found!.op.method).toBe(op.method);
      expect(found!.op.path).toBe(op.path);
    });

    it('page.mdx exists and contains the operation anchor', () => {
      if (!found) return;
      const page = readPage(locale, found.slug);
      expect(page, `missing page ${found.slug}/page.mdx`).toBeTruthy();
      expect(page!).toContain(found.op.elementId);
    });

    it('all request-body fields are rendered', () => {
      if (!found || !op.request.present) return;
      const rendered = new Set(requestProps(found.op));
      if (op.request.polymorphic) {
        // Polymorphic root (oneOf/anyOf): exact set is ambiguous, require non-empty.
        expect(rendered.size, `empty request body for ${op.operationId}`).toBeGreaterThan(0);
      } else {
        const missing = op.request.props.filter(p => !rendered.has(p));
        expect(missing, `missing request fields for ${op.operationId}`).toEqual([]);
      }
    });

    it('all success-response fields are rendered', () => {
      if (!found || !op.response.present || op.response.polymorphic) return;
      if (op.response.props.length === 0) return;
      const rendered = new Set(successResponseProps(found.op));
      const missing = op.response.props.filter(p => !rendered.has(p));
      expect(missing, `missing response fields for ${op.operationId}`).toEqual([]);
    });

    // Note: per-parameter rendering is tracked as a reviewable snapshot in
    // gaps.test.ts (some endpoints, e.g. workflows/events, render no params
    // section at all — a known docs-md gap, not a hard failure).
  });
});
