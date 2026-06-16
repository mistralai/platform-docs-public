/**
 * Read/write the patch database (api-examples.yaml).
 *
 * Format:
 *   version: 1
 *   patches:
 *     - path: <RFC 6901 JSON pointer into the OpenAPI spec>
 *       value: <any YAML/JSON value>          # required unless ignored
 *       ignored?: true                         # skip; tells audit "leave this path alone"
 *       reason?: <free-form string>           # why ignored / context
 *       note?: <free-form string, e.g. "edited 2025-01-15">
 *       source?: <"user" | "heuristic" | "migrated"> (informational)
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import yaml from 'js-yaml';

import type { Severity, DetectionReason } from './lorem-detector';

export type Patch = {
  path: string;
  value?: unknown;
  ignored?: boolean;
  reason?: string;
  note?: string;
  source?: 'user' | 'heuristic' | 'migrated';
  // Audit metadata (only present in drafts; informational)
  severity?: Severity;
  detectionReason?: DetectionReason;
  matched?: string;
};

export type PatchDb = {
  version: 1;
  patches: Patch[];
};

const EMPTY_DB: PatchDb = { version: 1, patches: [] };

export function loadPatchDb(filePath: string): PatchDb {
  if (!existsSync(filePath)) return { ...EMPTY_DB };
  const raw = readFileSync(filePath, 'utf8');
  if (!raw.trim()) return { ...EMPTY_DB };

  const parsed = yaml.load(raw) as PatchDb | null;
  if (!parsed || parsed.version !== 1 || !Array.isArray(parsed.patches)) {
    throw new Error(
      `Invalid patch DB at ${filePath}: expected { version: 1, patches: [...] }`
    );
  }
  return parsed;
}

export function savePatchDb(filePath: string, db: PatchDb): void {
  const yamlOut = yaml.dump(db, { lineWidth: -1, noRefs: true, sortKeys: false });
  writeFileSync(filePath, yamlOut);
}

export function indexByPath(db: PatchDb): Map<string, Patch> {
  const map = new Map<string, Patch>();
  for (const patch of db.patches) map.set(patch.path, patch);
  return map;
}
