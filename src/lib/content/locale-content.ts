import fs from 'node:fs';
import path from 'node:path';
import { defaultLocale, type Locale } from '@/i18n/config';

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');

type Segment = 'docs' | 'api/endpoint';
type CacheKey = `${Locale}:${Segment}`;

const slugCache = new Map<CacheKey, Set<string>>();

const RELATIVE_MDX_IMPORT = /from\s+['"](\.{1,2}\/[^'"]+\.mdx)['"]/g;

/**
 * Verifies a page.mdx and all of its relative .mdx imports physically exist.
 * A translated page can reference partials (e.g. `./foo_tab/_page.mdx`) that
 * the translation pipeline missed — those pages must fall back to defaultLocale.
 */
function pageIsLoadable(pageFile: string): boolean {
  let source: string;
  try {
    source = fs.readFileSync(pageFile, 'utf8');
  } catch {
    return false;
  }
  const dir = path.dirname(pageFile);
  for (const match of source.matchAll(RELATIVE_MDX_IMPORT)) {
    if (!fs.existsSync(path.resolve(dir, match[1]))) return false;
  }
  return true;
}

function collectSlugs(locale: Locale, segment: Segment): Set<string> {
  const key: CacheKey = `${locale}:${segment}`;
  const cached = slugCache.get(key);
  if (cached) return cached;

  const root = path.join(CONTENT_ROOT, locale, segment);
  const slugs = new Set<string>();

  const walk = (dir: string, parts: string[]): void => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }
    const hasPage = entries.some(e => e.isFile() && e.name === 'page.mdx');
    if (hasPage && parts.length > 0 && pageIsLoadable(path.join(dir, 'page.mdx'))) {
      slugs.add(parts.join('/'));
    }
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith('_')) continue;
      if (entry.name.startsWith('[') && entry.name.endsWith(']')) continue;
      walk(path.join(dir, entry.name), [...parts, entry.name]);
    }
  };

  walk(root, []);
  slugCache.set(key, slugs);
  return slugs;
}

/**
 * Returns the locale to actually load content from: the requested one when a
 * translation exists for `relPath`, otherwise the default locale.
 */
export function resolveContentLocale(
  requested: Locale,
  segment: Segment,
  relPath: string
): Locale {
  if (requested === defaultLocale) return defaultLocale;
  return collectSlugs(requested, segment).has(relPath) ? requested : defaultLocale;
}
