/**
 * Translate the API prose catalog locally with the Mistral API — no Lingo commit
 * needed (Plan A, local engine).
 *
 *   en/api/_i18n/strings.json  --(Mistral)-->  <locale>/api/_i18n/strings.json
 *
 * Translation runs through the shared TM engine (lib/mistral-translate.ts), so
 * identical strings are translated once and re-runs are incremental.
 *
 * Flags:
 *   --locale <code>   target locale (default fr)
 *   --batch <n>       strings per API request (default 20)
 *   --concurrency <n> parallel requests (default 5)
 *   --force           ignore the TM and re-translate everything
 *   --dry-run         report how many strings would be translated, call nothing
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { loadTM, translateStrings } from './lib/mistral-translate';

type Args = { locale: string; batch: number; concurrency: number; force: boolean; dryRun: boolean };

function parseArgs(argv: string[]): Args {
  const a: Args = { locale: 'fr', batch: 20, concurrency: 5, force: false, dryRun: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--locale') a.locale = argv[++i];
    else if (arg === '--batch') a.batch = Number(argv[++i]);
    else if (arg === '--concurrency') a.concurrency = Number(argv[++i]);
    else if (arg === '--force') a.force = true;
    else if (arg === '--dry-run') a.dryRun = true;
    else if (arg === '--help' || arg === '-h') {
      console.log('Usage: tsx src/scripts/api/translate-catalog.ts [--locale fr] [--batch 20] [--concurrency 5] [--force] [--dry-run]');
      process.exit(0);
    } else throw new Error(`Unknown flag: ${arg}`);
  }
  return a;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const EN_CATALOG = './src/content/en/api/_i18n/strings.json';
  const OUT_CATALOG = `./src/content/${args.locale}/api/_i18n/strings.json`;

  const enCatalog = JSON.parse(readFileSync(EN_CATALOG, 'utf8')) as Record<string, string>;
  const uniqueStrings = Array.from(new Set(Object.values(enCatalog)));
  const tm = args.force ? {} : loadTM(args.locale);
  const missing = uniqueStrings.filter(s => typeof tm[s] !== 'string');

  console.log('');
  console.log(`Translate API catalog -> ${args.locale}`);
  console.log('─'.repeat(60));
  console.log(`Pointers:     ${Object.keys(enCatalog).length}`);
  console.log(`Unique:       ${uniqueStrings.length}`);
  console.log(`Cached (TM):  ${uniqueStrings.length - missing.length}`);
  console.log(`To translate: ${missing.length}`);

  if (args.dryRun) {
    console.log('\n[dry-run] no API calls made.');
    return;
  }

  const map = await translateStrings(uniqueStrings, {
    locale: args.locale,
    kind: 'prose',
    batch: args.batch,
    concurrency: args.concurrency,
    force: args.force,
    onProgress: (done, total) => process.stdout.write(`\r  translated ${done}/${total}`),
  });
  if (missing.length > 0) process.stdout.write('\n');

  const outCatalog: Record<string, string> = {};
  let fallbacks = 0;
  for (const [pointer, en] of Object.entries(enCatalog)) {
    outCatalog[pointer] = map[en] ?? en;
    if (map[en] === undefined || map[en] === en) fallbacks += 1;
  }
  mkdirSync(dirname(OUT_CATALOG), { recursive: true });
  writeFileSync(OUT_CATALOG, JSON.stringify(outCatalog, null, 2) + '\n');

  console.log(`Catalog:      ${OUT_CATALOG}${fallbacks ? ` (${fallbacks} untranslated/identical)` : ''}`);
  console.log('✓ done');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
