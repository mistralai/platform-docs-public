/**
 * Interactive review of api-examples.draft.yaml.
 *
 * For each patch tagged `source: heuristic`, prompts the user with:
 *   accept     keep the proposal as-is (becomes source: user)
 *   skip       drop the proposal; path will reappear at the next audit
 *   edit       opens $EDITOR (or VS Code) on a temp YAML to edit the value
 *   ignore     mark the path as permanently ignored (audit will leave it alone)
 *
 * Final result is written back to the draft. The user then runs
 * `pnpm api:promote` to copy the draft into api-examples.yaml.
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import yaml from 'js-yaml';
import { loadPatchDb, savePatchDb, type Patch, type PatchDb } from './lib/patch-db';

const DRAFT_DB = process.env.API_DRAFT_DB || './src/scripts/api-examples.draft.yaml';

function pretty(value: unknown): string {
  return yaml.dump({ value }, { lineWidth: -1, noRefs: true }).replace(/^value: ?\n?/, '');
}

function indent(text: string, prefix = '    '): string {
  return text
    .split('\n')
    .map(line => (line.length ? prefix + line : line))
    .join('\n');
}

function editValue(initialValue: unknown): unknown {
  const dir = mkdtempSync(join(tmpdir(), 'api-edit-'));
  const file = join(dir, 'value.yaml');
  writeFileSync(file, yaml.dump(initialValue, { lineWidth: -1, noRefs: true }));

  const editor = process.env.EDITOR || (existsSync('/usr/local/bin/code') ? 'code' : 'vi');
  const args = editor === 'code' ? ['--wait', file] : [file];
  const result = spawnSync(editor, args, { stdio: 'inherit' });

  if (result.status !== 0) {
    rmSync(dir, { recursive: true, force: true });
    throw new Error(`Editor exited with code ${result.status}`);
  }

  const updated = yaml.load(readFileSync(file, 'utf8'));
  rmSync(dir, { recursive: true, force: true });
  return updated;
}

async function main() {
  if (!existsSync(DRAFT_DB)) {
    console.error(`No draft at ${DRAFT_DB}. Run pnpm api:audit first.`);
    process.exit(1);
  }

  const db = loadPatchDb(DRAFT_DB);
  const heuristic = db.patches.filter(p => p.source === 'heuristic');
  const others = db.patches.filter(p => p.source !== 'heuristic');

  if (heuristic.length === 0) {
    console.log('No new heuristic proposals to review.');
    return;
  }

  // Order: critical → warning → doubt → unknown — attack the worst first
  const SEVERITY_ORDER = { critical: 0, warning: 1, doubt: 2 } as const;
  heuristic.sort((a, b) => {
    const sa = a.severity ? SEVERITY_ORDER[a.severity as keyof typeof SEVERITY_ORDER] : 99;
    const sb = b.severity ? SEVERITY_ORDER[b.severity as keyof typeof SEVERITY_ORDER] : 99;
    if (sa !== sb) return sa - sb;
    return a.path.localeCompare(b.path);
  });

  console.log('');
  console.log(`Reviewing ${heuristic.length} new proposal(s) from ${DRAFT_DB}`);
  console.log('Commands: [a]ccept (default), [s]kip, [e]dit, [i]gnore, [q]uit');
  console.log('Order: critical → warning → doubt');
  console.log('─'.repeat(60));

  const rl = createInterface({ input: process.stdin, output: process.stdout });
  const reviewed: Patch[] = [];
  const today = new Date().toISOString().slice(0, 10);

  try {
    for (let i = 0; i < heuristic.length; i += 1) {
      const patch = heuristic[i];
      const sev = patch.severity ? `[${patch.severity}]` : '[?]';
      console.log('');
      console.log(`[${i + 1}/${heuristic.length}] ${sev} ${patch.path}`);
      if (patch.matched) console.log(`  matched: ${patch.matched}`);
      if (patch.note) console.log(`  ${patch.note}`);
      console.log('  current value:');
      console.log(indent(pretty(patch.value)));

      const answer = (await rl.question('  ? [a/s/e/i/q] (default a): ')).trim().toLowerCase();

      if (answer === 'q') {
        console.log('Aborted; remaining proposals kept as heuristic.');
        reviewed.push(...heuristic.slice(i));
        break;
      }
      if (answer === 's') continue;
      if (answer === 'i') {
        const reason = (await rl.question('  reason (optional): ')).trim();
        reviewed.push({
          path: patch.path,
          ignored: true,
          reason: reason || undefined,
          source: 'user',
          note: `ignored interactively ${today}`,
        });
        continue;
      }
      if (answer === 'e') {
        const newValue = editValue(patch.value);
        reviewed.push({
          ...patch,
          value: newValue,
          source: 'user',
          note: `edited interactively ${today}`,
        });
        continue;
      }
      // accept
      reviewed.push({
        ...patch,
        source: 'user',
        note: `accepted heuristic ${today}`,
      });
    }
  } finally {
    rl.close();
  }

  const out: PatchDb = { version: 1, patches: [...others, ...reviewed] };
  savePatchDb(DRAFT_DB, out);

  const accepted = reviewed.filter(p => p.source === 'user' && !p.ignored).length;
  const ignoredCount = reviewed.filter(p => p.ignored).length;
  const skipped = heuristic.length - reviewed.length;
  console.log('');
  console.log(`Accepted/edited: ${accepted}`);
  console.log(`Ignored:         ${ignoredCount}`);
  console.log(`Skipped:         ${skipped}`);
  console.log(`Wrote ${DRAFT_DB}`);
  console.log('Run pnpm api:promote when ready to merge into api-examples.yaml.');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
