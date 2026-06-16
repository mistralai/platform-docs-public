/**
 * Non-interactive auto-acceptor for the draft DB.
 *
 * Reads api-examples.draft.yaml and accepts patches matching a filter:
 *   - `--severity=critical` (default)         only accept critical findings
 *   - `--severity=critical,warning`           accept critical + warning
 *   - `--include-doubt`                       include doubt findings too
 *   - `--include-placeholder-values`          accept even patches with value
 *                                              still set to '<to fill>'
 *
 * Skipped patches stay in the draft (unchanged source: heuristic) for later
 * manual review with `pnpm api:review`.
 */

import { existsSync } from 'node:fs';
import { loadPatchDb, savePatchDb, type Patch, type PatchDb } from './lib/patch-db';
import type { Severity } from './lib/lorem-detector';

const DRAFT_DB = process.env.API_DRAFT_DB || './src/scripts/api-examples.draft.yaml';

type CliFlags = {
  severities: Set<Severity>;
  includePlaceholder: boolean;
};

function parseArgs(argv: string[]): CliFlags {
  const flags: CliFlags = {
    severities: new Set<Severity>(['critical']),
    includePlaceholder: false,
  };
  for (const arg of argv) {
    if (arg.startsWith('--severity=')) {
      flags.severities = new Set(arg.slice('--severity='.length).split(',') as Severity[]);
    } else if (arg === '--include-doubt') {
      flags.severities.add('doubt');
    } else if (arg === '--include-placeholder-values') {
      flags.includePlaceholder = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log('Usage: tsx src/scripts/api/auto-accept.ts [--severity=critical[,warning,doubt]] [--include-doubt] [--include-placeholder-values]');
      process.exit(0);
    } else {
      throw new Error(`Unknown flag: ${arg}`);
    }
  }
  return flags;
}

function isPlaceholderValue(v: unknown): boolean {
  return typeof v === 'string' && v.trim() === '<to fill>';
}

function main() {
  const flags = parseArgs(process.argv.slice(2));

  if (!existsSync(DRAFT_DB)) {
    console.error(`No draft at ${DRAFT_DB}. Run pnpm api:audit first.`);
    process.exit(1);
  }

  const db = loadPatchDb(DRAFT_DB);
  const today = new Date().toISOString().slice(0, 10);

  let accepted = 0;
  let skippedSeverity = 0;
  let skippedPlaceholder = 0;
  let alreadyUser = 0;

  const out: Patch[] = db.patches.map(patch => {
    if (patch.source !== 'heuristic') {
      alreadyUser += 1;
      return patch;
    }
    if (patch.severity && !flags.severities.has(patch.severity)) {
      skippedSeverity += 1;
      return patch;
    }
    if (!flags.includePlaceholder && isPlaceholderValue(patch.value)) {
      skippedPlaceholder += 1;
      return patch;
    }
    accepted += 1;
    return {
      ...patch,
      source: 'user' as const,
      note: `auto-accepted ${today}`,
    };
  });

  savePatchDb(DRAFT_DB, { version: 1, patches: out });

  const remainingHeuristic = out.filter(p => p.source === 'heuristic').length;

  console.log('');
  console.log('Auto-accept');
  console.log('─'.repeat(60));
  console.log(`Severities accepted:   ${[...flags.severities].join(', ')}`);
  console.log(`Include placeholders:  ${flags.includePlaceholder}`);
  console.log('');
  console.log(`Accepted:                          ${accepted}`);
  console.log(`Skipped (severity not in filter):  ${skippedSeverity}`);
  console.log(`Skipped (value is <to fill>):      ${skippedPlaceholder}`);
  console.log(`Already user/migrated/ignored:     ${alreadyUser}`);
  console.log('');
  console.log(`Remaining heuristic in draft:      ${remainingHeuristic}`);
  console.log(`Wrote ${DRAFT_DB}`);
  console.log('');
  console.log('Run pnpm api:promote to merge into api-examples.yaml.');
}

main();
