/**
 * Localize the API labels that docs-md derives from the tag *name* (not from a
 * translatable spec field), so they don't stay English in a translated locale:
 *   - `sidebarLabel` in <locale>/api/sidebar-metadata.json   (nav)
 *   - the single page H1 in each page                          (heading)
 *
 * Only the sidebar labels are sent to the translator (label mode, shared TM).
 * Each page's H1 is then set to its OWN (translated) sidebar label, keyed by
 * slug, so the heading and the nav always match — no per-phrase MT drift like
 * "Endpoints" being rendered differently on each page.
 *
 * Run after the locale pages + sidebar-metadata are generated (build-fr.ts wires
 * this in). Operation summaries/descriptions in sidebar-metadata come from the
 * translated spec and are already localized.
 *
 * Flags: --locale <code> (default fr)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import glob from 'fast-glob';
import { translateStrings } from './lib/mistral-translate';

const H1_RE = /^# .+$/m;

function parseLocale(argv: string[]): string {
  const i = argv.indexOf('--locale');
  return i !== -1 ? argv[i + 1] : 'fr';
}

function slugOf(file: string): string | null {
  const parts = file.split('/api/');
  if (parts.length < 2) return null;
  return parts[parts.length - 1].replace(/\/page\.mdx$/, '');
}

async function main() {
  const locale = parseLocale(process.argv.slice(2));
  const SIDEBAR = `./src/content/${locale}/api/sidebar-metadata.json`;
  const PAGES_GLOB = `./src/content/${locale}/api/**/*.mdx`;

  type Entry = { sidebarLabel?: string; slug?: string; [k: string]: unknown };
  const sidebar = JSON.parse(readFileSync(SIDEBAR, 'utf8')) as Entry[];

  const labels = sidebar
    .map(e => e.sidebarLabel)
    .filter((s): s is string => typeof s === 'string');
  const map = await translateStrings(labels, {
    locale,
    kind: 'label',
    onProgress: (done, total) => process.stdout.write(`\r  translated ${done}/${total} labels`),
  });
  process.stdout.write('\n');

  // Rewrite sidebar labels and remember slug -> translated label.
  const labelBySlug = new Map<string, string>();
  let sidebarChanged = 0;
  for (const entry of sidebar) {
    const en = entry.sidebarLabel;
    if (typeof en !== 'string') continue;
    const fr = map[en] ?? en;
    if (entry.slug) labelBySlug.set(entry.slug, fr);
    if (fr !== en) {
      entry.sidebarLabel = fr;
      sidebarChanged += 1;
    }
  }
  writeFileSync(SIDEBAR, JSON.stringify(sidebar, null, '  ') + '\n');

  // Set each page's H1 to its own translated sidebar label (heading == nav).
  const pageFiles = await glob(PAGES_GLOB);
  let pagesChanged = 0;
  let unmatched = 0;
  for (const file of pageFiles) {
    const slug = slugOf(file);
    const fr = slug ? labelBySlug.get(slug) : undefined;
    if (!fr) {
      unmatched += 1;
      continue;
    }
    const content = readFileSync(file, 'utf8');
    if (!H1_RE.test(content)) continue;
    const updated = content.replace(H1_RE, () => `# ${fr}`);
    if (updated !== content) {
      writeFileSync(file, updated);
      pagesChanged += 1;
    }
  }

  console.log('');
  console.log(`Localize ${locale} labels`);
  console.log('─'.repeat(60));
  console.log(`Sidebar labels updated: ${sidebarChanged}/${sidebar.length}`);
  console.log(`Page H1s updated:       ${pagesChanged}/${pageFiles.length}${unmatched ? ` (${unmatched} unmatched)` : ''}`);
  console.log('✓ done');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
