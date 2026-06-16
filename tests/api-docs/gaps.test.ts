/**
 * Tracked gaps (snapshots, EN). These are legitimate, reviewable gaps rather than
 * hard failures, so the suite stays green but any CHANGE is surfaced in review:
 *   - SDK language coverage: endpoints the TS/Python SDK doesn't cover are
 *     curl-only (workflows, rag, observability, ...).
 *   - Parameters the spec declares but docs-md doesn't render on the page.
 *
 * Update intentionally with `vitest -u` when the spec/SDK coverage changes.
 */

import { describe, expect, it } from 'vitest';
import { loadSpecIndex } from './lib/spec-index';
import { loadRendition, operationSlice, operationsForSlug, readPage } from './lib/rendition';

const spec = loadSpecIndex();
const rendition = loadRendition('en');

function sliceFor(operationId: string): string | null {
  const found = rendition.byOperationId.get(operationId);
  if (!found) return null;
  const page = readPage('en', found.slug) ?? '';
  return operationSlice(page, found.op, operationsForSlug(rendition, found.slug));
}

describe('tracked gaps (EN snapshots)', () => {
  it('SDK language coverage gaps (endpoints lacking a TS / Python sample)', () => {
    const noTypescript: string[] = [];
    const noPython: string[] = [];
    for (const op of spec.operations) {
      const found = rendition.byOperationId.get(op.operationId);
      if (!found) continue;
      const slice = sliceFor(op.operationId) ?? '';
      if (!slice.includes(`${found.op.elementId}_code-samples_typescript`)) {
        noTypescript.push(op.operationId);
      }
      if (!slice.includes(`${found.op.elementId}_code-samples_python`)) {
        noPython.push(op.operationId);
      }
    }
    expect({
      typescript: noTypescript.sort(),
      python: noPython.sort(),
    }).toMatchSnapshot();
  });

  it('parameters declared in the spec but not rendered on the page', () => {
    const gaps: Record<string, string[]> = {};
    for (const op of spec.operations) {
      if (op.params.length === 0) continue;
      const found = rendition.byOperationId.get(op.operationId);
      if (!found) continue;
      const page = readPage('en', found.slug) ?? '';
      const missing = op.params.filter(name => !page.includes(name));
      if (missing.length) gaps[op.operationId] = missing.sort();
    }
    const sorted: Record<string, string[]> = {};
    for (const k of Object.keys(gaps).sort()) sorted[k] = gaps[k];
    expect(sorted).toMatchSnapshot();
  });
});
