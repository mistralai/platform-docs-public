import fsSync from 'node:fs';
import matter from 'gray-matter';
import fs from 'node:fs/promises';
import path from 'node:path';
import MiniSearch from 'minisearch';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkMdx from 'remark-mdx';
import { visit } from 'unist-util-visit';
import { Doc, DocsDoc, EndpointDoc } from '@/schema/doc';
import sidebarMetadata from '@/content/en/api/sidebar-metadata.json';
import { isApiEndpointHidden, isDocsRouteHidden } from '@/lib/content/hidden';
import { defaultLocale, locales, type Locale } from '@/i18n/config';

// --- config ---
const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');
const APP_DOCS_ROOT = path.join(process.cwd(), 'src', 'app', '[locale]', '(docs)');
const OUT_DIR = path.join(process.cwd(), 'public');

const docsRootForLocale = (locale: Locale) =>
  path.join(CONTENT_ROOT, locale, 'docs');

const indexPathForLocale = (locale: Locale) =>
  path.join(OUT_DIR, `search-index-${locale}.json`);

const docsPathForLocale = (locale: Locale) =>
  path.join(OUT_DIR, `search-docs-${locale}.json`);

type CollectorConfig = {
  includeEndpoints?: boolean;
  includeDocs?: boolean;
};

const DEFAULT_CONFIG: CollectorConfig = {
  includeEndpoints: true,
  includeDocs: true,
};

const titleCase = (s: string) =>
  s
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, m => m.toUpperCase());

async function readJsonIfExists(file: string) {
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const stripRouteGroups = (segments: string[]) =>
  segments.filter(s => !s.startsWith('('));

function urlFromDir(root: string, absDir: string, locale: Locale): string {
  const rel = path.relative(root, absDir);
  const segs = rel ? stripRouteGroups(rel.split(path.sep).filter(Boolean)) : [];
  return '/' + [locale, ...segs].join('/');
}

// Per-locale URL→title map for breadcrumbs. Walks (in order):
//   1. locale's content dir (wins)
//   2. default locale's content dir (fallback for missing translations)
//   3. app dir (TSX-only sidebar entries)
async function buildUrlTitleMap(locale: Locale): Promise<Map<string, string>> {
  const map = new Map<string, string>();

  async function* walkDirs(dir: string): AsyncGenerator<string> {
    let entries: import('node:fs').Dirent[];
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }
    yield dir;
    for (const e of entries) {
      if (e.isDirectory()) {
        if (e.name.startsWith('_')) continue;
        if (e.name.startsWith('[') && e.name.endsWith(']')) continue;
        yield* walkDirs(path.join(dir, e.name));
      }
    }
  }

  async function titleFor(dir: string): Promise<string | null> {
    const pageMdx = path.join(dir, 'page.mdx');
    if (fsSync.existsSync(pageMdx)) {
      const raw = await fs.readFile(pageMdx, 'utf8');
      const fm = matter(raw);
      const t = (fm.data?.title as string | undefined)?.trim();
      if (t) return t;
    }
    const cat =
      (await readJsonIfExists(path.join(dir, '_category.json'))) ||
      (await readJsonIfExists(path.join(dir, '_category_.json')));
    if (cat?.label) return String(cat.label);
    return null;
  }

  // Walk roots in reverse precedence: app first (lowest), default-locale next, locale last (wins).
  // For each entry, only set if not already present from a higher-precedence root.
  const roots: { root: string; precedence: number }[] = [
    { root: APP_DOCS_ROOT, precedence: 0 },
  ];
  if (locale !== defaultLocale) {
    roots.push({ root: docsRootForLocale(defaultLocale), precedence: 1 });
  }
  roots.push({ root: docsRootForLocale(locale), precedence: 2 });

  // Track precedence per URL so higher-precedence overrides.
  const seenAt = new Map<string, number>();

  for (const { root, precedence } of roots) {
    if (!fsSync.existsSync(root)) continue;
    for await (const dir of walkDirs(root)) {
      if (dir === root) continue;
      const url = urlFromDir(root, dir, locale);
      if (url === `/${locale}`) continue;
      const existing = seenAt.get(url);
      if (existing !== undefined && existing >= precedence) continue;
      const title = (await titleFor(dir)) ?? titleCase(path.basename(dir));
      map.set(url, title);
      seenAt.set(url, precedence);
    }
  }

  return map;
}

function buildBreadcrumbsForUrl(
  url: string,
  urlTitleMap: Map<string, string>,
  locale: Locale
) {
  const allSegs = url.split('/').filter(Boolean);
  // Skip leading locale segment when emitting crumbs (we don't want a "/en" crumb)
  const segs = allSegs[0] === locale ? allSegs.slice(1) : allSegs;
  const crumbs: Array<{ url: string; title: string }> = [];
  let currentUrl = `/${locale}`;
  for (const seg of segs) {
    currentUrl += '/' + seg;
    const title = urlTitleMap.get(currentUrl) || titleCase(seg);
    crumbs.push({ url: currentUrl, title });
  }
  return crumbs;
}

// --- utils ---
async function* walk(dir: string): AsyncGenerator<string> {
  let entries: import('node:fs').Dirent[];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.name.startsWith('_')) continue;
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

async function mdxToPlainText(
  src: string
): Promise<{ text: string; data: any }> {
  const fm = matter(src);
  const { data, content } = fm;

  const processor = unified()
    .use(remarkParse)
    .use(remarkFrontmatter, ['yaml'])
    .use(remarkMdx)
    .use(remarkGfm);

  const tree = await processor.parse(content);
  let parts: string[] = [];

  visit(tree as any, (node: any) => {
    if (
      node.type === 'mdxjsEsm' ||
      node.type === 'mdxJsxFlowElement' ||
      node.type === 'mdxJsxTextElement' ||
      node.type === 'mdxFlowExpression' ||
      node.type === 'mdxTextExpression'
    ) {
      return 'skip';
    }
    if (node.type === 'text') {
      parts.push(node.value);
    }
  });

  return {
    text: parts.join(' ').replace(/\s+/g, ' ').trim(),
    data,
  };
}

// ---- collectors ----
async function collectMDX(
  locale: Locale,
  urlTitleMap: Map<string, string>
): Promise<DocsDoc[]> {
  const out: DocsDoc[] = [];
  const seenUrls = new Set<string>();

  // Walk locale's own dir first (wins), then default locale (fills gaps).
  const roots = [docsRootForLocale(locale)];
  if (locale !== defaultLocale) roots.push(docsRootForLocale(defaultLocale));

  for (const root of roots) {
    if (!fsSync.existsSync(root)) continue;
    for await (const file of walk(root)) {
      if (!/\/page\.mdx$/.test(file)) continue;

      const url = urlFromDir(root, path.dirname(file), locale);
      if (seenUrls.has(url) || isDocsRouteHidden(url, locale)) continue;
      seenUrls.add(url);

      const raw = await fs.readFile(file, 'utf8');
      const { text, data } = await mdxToPlainText(raw);
      const crumbs = buildBreadcrumbsForUrl(url, urlTitleMap, locale);

      const title =
        (data.title as string | undefined) ??
        crumbs.at(-1)?.title ??
        text.split('. ').at(0) ??
        'Untitled';

      out.push({
        id: url,
        url,
        title,
        description: (data.description as string | undefined) || undefined,
        body: text,
        breadcrumbs: crumbs,
        sidebar_position: data.sidebar_position,
        suggest_rank: data.suggest_rank as number | undefined,
        type: 'docs',
      });
    }
  }
  return out;
}

// Collect API endpoint documents from sidebar metadata
async function collectEndpoints(locale: Locale): Promise<EndpointDoc[]> {
  const out: EndpointDoc[] = [];

  try {
    const sidebarMetadataPath = path.join(
      process.cwd(),
      'src',
      'content',
      'en',
      'api',
      'sidebar-metadata.json'
    );

    if (!fsSync.existsSync(sidebarMetadataPath)) {
      console.log('Sidebar metadata not found, skipping endpoint collection');
      return out;
    }

    for (const category of sidebarMetadata) {
      if (isApiEndpointHidden(category.slug, locale)) continue;

      const categoryName = category.sidebarLabel;
      const categorySlug = category.slug;
      const categoryUrl = `/${locale}/api/${categorySlug}`;

      for (const tag of category.tags || []) {
        for (const operation of tag.operations || []) {
          const endpointId = operation.elementId || operation.operationId;
          const method = operation.method?.toUpperCase();
          const path = operation.path;
          const summary = operation.summary;

          if (method && path && endpointId) {
            out.push({
              id: `${locale}:${endpointId}`,
              url: `${categoryUrl}#${endpointId}`,
              title: summary,
              body: operation.description,
              type: 'endpoint',
              method,
              path,
              operation_id: endpointId,
              summary,
              category: categoryName,
              tags: [
                method.toLowerCase(),
                categoryName.toLowerCase().replace(/\s+/g, '-'),
                'api',
                'endpoint',
              ].filter(Boolean) as string[],
              breadcrumbs: [
                { url: `/${locale}/api`, title: 'API' },
                { url: categoryUrl, title: categoryName },
              ],
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Failed to process sidebar metadata:', error);
  }

  return out;
}

// Pages that export getIndex(): Index[]
async function collectTSXviaGetIndex(
  locale: Locale,
  urlTitleMap: Map<string, string>
): Promise<Doc[]> {
  const out: Doc[] = [];
  for await (const file of walk(APP_DOCS_ROOT)) {
    if (!/\/page\.tsx$/.test(file)) continue;
    try {
      const getIndexFile = path.join(path.dirname(file), 'get-index.ts');
      if (!fsSync.existsSync(getIndexFile)) continue;
      const mod = await import(getIndexFile);
      if (typeof mod.getIndex === 'function') {
        const entries = await Promise.resolve(mod.getIndex(locale));
        for (const e of entries as Doc[]) {
          if (!e.url || !e.title) continue;
          const rawUrl = e.url.startsWith('/') ? e.url : `/${e.url}`;
          const fullUrl = `/${locale}${rawUrl}`;
          const crumbs =
            e.breadcrumbs ?? buildBreadcrumbsForUrl(fullUrl, urlTitleMap, locale);

          out.push({
            ...e,
            id: e.id ? `${locale}:${e.id}` : fullUrl,
            body: (e.body ?? '').toString(),
            url: fullUrl,
            // @ts-ignore
            breadcrumbs: crumbs,
          });
        }
      }
    } catch {
      // ignore non-importable pages
    }
  }
  return out;
}

async function buildForLocale(locale: Locale, config: CollectorConfig) {
  const urlTitleMap = await buildUrlTitleMap(locale);

  const collectors: Promise<Doc[]>[] = [];

  if (config.includeDocs) {
    collectors.push(
      collectMDX(locale, urlTitleMap),
      collectTSXviaGetIndex(locale, urlTitleMap)
    );
  }

  if (config.includeEndpoints) {
    collectors.push(collectEndpoints(locale));
  }

  const results = await Promise.all(collectors);
  const seenIds = new Set<string>();
  const docs = results.flat().filter(doc => {
    if (seenIds.has(doc.id)) return false;
    seenIds.add(doc.id);
    return true;
  });

  const docsByType = docs.reduce(
    (acc, doc) => {
      if (!acc[doc.type]) acc[doc.type] = [];
      acc[doc.type].push(doc);
      return acc;
    },
    {} as Record<string, Doc[]>
  );

  const mini = new MiniSearch<Doc>({
    fields: [
      'title',
      'description',
      'body',
      'tags',
      'url',
      'method',
      'path',
      'category',
      'summary',
    ],
    storeFields: [
      'url',
      'title',
      'description',
      'type',
      'method',
      'path',
      'category',
    ],
    searchOptions: {
      prefix: true,
      fuzzy: 0.2,
      boost: {
        title: 4,
        method: 3,
        path: 3,
        summary: 2.5,
        tags: 2,
        description: 1.5,
        category: 1.5,
        body: 1,
        url: 2,
      },
    },
    tokenize: s => s.split(/[\s\-_/.:]+/g),
  });

  mini.addAll(docs);

  await fs.writeFile(indexPathForLocale(locale), JSON.stringify(mini));
  await fs.writeFile(
    docsPathForLocale(locale),
    JSON.stringify(
      docs.map(d => ({
        id: d.id,
        url: d.url,
        title: d.title,
        description: d.description,
        body: d.body,
        type: d.type,
        suggest_rank: d.suggest_rank ?? 999,
        breadcrumbs: d.breadcrumbs,
        ...(d.type === 'endpoint' && {
          method: (d as EndpointDoc).method,
          path: (d as EndpointDoc).path,
          category: (d as EndpointDoc).category,
          operation_id: (d as EndpointDoc).operation_id,
          summary: (d as EndpointDoc).summary,
        }),
      }))
    )
  );

  console.log(
    `[${locale}] Indexed ${docs.length} documents (${docsByType.docs?.length || 0} docs, ${docsByType.endpoint?.length || 0} endpoints) → ${path.relative(process.cwd(), indexPathForLocale(locale))}`
  );
}

async function main(config: CollectorConfig = DEFAULT_CONFIG) {
  await fs.mkdir(OUT_DIR, { recursive: true });
  for (const locale of locales) {
    await buildForLocale(locale, config);
  }
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
