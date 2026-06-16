/**
 * T4 — Spec freshness / no stale committed output.
 * Regenerate the EN rendition from the current `.openapi-docs.yaml` into a temp
 * dir and diff its operation/slug set against the committed one. Catches stale
 * generated output (e.g. orphan pages docs-md never prunes).
 *
 * Heavier (runs docs-md), so opt-in: RUN_FRESHNESS=1 (see `pnpm test:api:freshness`).
 * EN-only → no MISTRAL_API_KEY needed.
 */

import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { loadRendition, type SidebarEntry } from './lib/rendition';

const runFreshness = process.env.RUN_FRESHNESS === '1';

function operationIdsOf(sidebar: SidebarEntry[]): string[] {
  return sidebar
    .flatMap(e => e.tags.flatMap(t => t.operations.map(o => o.operationId)))
    .sort();
}
function slugsOf(sidebar: SidebarEntry[]): string[] {
  return sidebar.map(e => e.slug).sort();
}

describe('committed EN rendition is fresh vs current spec', () => {
  it.runIf(runFreshness)(
    'regenerated EN sidebar-metadata matches committed (slugs + operations)',
    () => {
      const outDir = mkdtempSync(join(tmpdir(), 'api-freshness-'));
      const meta = join(outDir, 'sidebar-metadata.json');
      const res = spawnSync('pnpm', ['exec', 'docs-md'], {
        stdio: 'pipe',
        env: {
          ...process.env,
          SPEAKEASY_OPENAPI_YAML: './.openapi-docs.yaml',
          API_PAGE_OUT_DIR: outDir,
          API_SIDEBAR_META_PATH: meta,
        },
      });
      expect(res.status, `docs-md failed:\n${res.stderr?.toString()}`).toBe(0);

      const fresh = JSON.parse(readFileSync(meta, 'utf8')) as SidebarEntry[];
      const committed = loadRendition('en').sidebar;

      expect(slugsOf(fresh), 'slug set drifted from current spec').toEqual(slugsOf(committed));
      expect(operationIdsOf(fresh), 'operation set drifted from current spec').toEqual(
        operationIdsOf(committed)
      );
    },
    300_000
  );

  it.skipIf(runFreshness)('skipped (set RUN_FRESHNESS=1 to enable)', () => {
    expect(true).toBe(true);
  });
});
