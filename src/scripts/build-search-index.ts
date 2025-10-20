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
import sidebarMetadata from '@/app/(api)/components/sidebar-metadata.json';

// --- config ---
const DOCS_ROOT = path.join(process.cwd(), 'src', 'app', '(docs)');
const API_ROOT = path.join(
  process.cwd(),
  'src',
  'app',
  '(api)',
  'api',
  'endpoint'
);
const OUT_DIR = path.join(process.cwd(), 'public');
const IDX_PATH = path.join(OUT_DIR, 'search-index.json');
const DOCS_PATH = path.join(OUT_DIR, 'search-docs.json');

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

// Precompute a map: absoluteDirPath -> title for that directory
async function buildDirTitleMap(): Promise<Map<string, string>> {
  const map = new Map<string, string>();

  // Walk all directories
  async function* walkDirs(dir: string): AsyncGenerator<string> {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    yield dir;
    for (const e of entries) {
      if (e.isDirectory()) {
        if (e.name.startsWith('_')) continue;
        yield* walkDirs(path.join(dir, e.name));
      }
    }
  }

  for await (const dir of walkDirs(DOCS_ROOT)) {
    const pageMdx = path.join(dir, 'page.mdx');
    const categoryJson = path.join(dir, '_category.json');
    const categoryJsonAlt = path.join(dir, '_category_.json');

    // 1) page.mdx frontmatter title
    if (fsSync.existsSync(pageMdx)) {
      const raw = await fs.readFile(pageMdx, 'utf8');
      const fm = matter(raw); // you’re already using gray-matter
      const t = (fm.data?.title as string | undefined)?.trim();
      if (t) {
        map.set(dir, t);
        continue;
      }
    }

    // 2) _category.json / _category_.json { "label": "…" }
    const cat =
      (await readJsonIfExists(categoryJson)) ||
      (await readJsonIfExists(categoryJsonAlt));
    if (cat?.label) {
      map.set(dir, String(cat.label));
      continue;
    }

    // 3) fallback to folder name
    if (dir !== DOCS_ROOT) {
      const label = titleCase(path.basename(dir));
      map.set(dir, label);
    }
  }

  return map;
}

// Given an absolute file path to a doc, build breadcrumbs
function buildBreadcrumbsForFile(
  absFile: string,
  dirTitleMap: Map<string, string>
) {
  const docDir = path.dirname(absFile);
  const rel = path.relative(DOCS_ROOT, docDir);
  const segs = rel ? rel.split(path.sep) : [];
  const crumbs: Array<{ url: string; title: string }> = [];

  // progressive URLs for each directory segment
  let currentAbs = DOCS_ROOT;
  let currentUrl = '';
  for (const seg of segs) {
    currentAbs = path.join(currentAbs, seg);
    currentUrl += '/' + seg;
    const title = dirTitleMap.get(currentAbs) || titleCase(seg);
    crumbs.push({ url: currentUrl, title });
  }

  return crumbs;
}

// --- utils ---
async function* walk(dir: string): AsyncGenerator<string> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  for (const e of entries) {
    const p = path.join(dir, e.name);
    if (e.name.startsWith('_')) continue;
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const toUrlFromPageFile = (absFile: string) => {
  // .../app/docs/a/b/page.mdx -> /docs/a/b
  const dir = path.dirname(absFile);
  const rel = path.relative(DOCS_ROOT, dir);
  return '/' + rel.split(path.sep).filter(Boolean).join('/');
};

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

  // Function to recursively extract text from any node
  const extractTextFromNode = (node: any): void => {
    if (node.type === 'text') {
      parts.push(node.value);
    } else if (node.children) {
      node.children.forEach((child: any) => extractTextFromNode(child));
    }
  };

  visit(tree as any, (node: any) => {
    // Skip MDX-specific nodes that don't contain content
    if (
      node.type === 'mdxjsEsm' || // Import/export statements
      node.type === 'mdxJsxFlowElement' || // JSX components
      node.type === 'mdxJsxTextElement' || // Inline JSX
      node.type === 'mdxFlowExpression' || // JSX expressions
      node.type === 'mdxTextExpression' // Inline expressions
    ) {
      return 'skip'; // Skip these nodes and their children
    }

    // Only extract text nodes directly to avoid duplication
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
  dirTitleMap: Map<string, string>
): Promise<DocsDoc[]> {
  const out: DocsDoc[] = [];
  for await (const file of walk(DOCS_ROOT)) {
    if (!/\/page\.mdx$/.test(file)) continue;

    const raw = await fs.readFile(file, 'utf8');
    const { text, data } = await mdxToPlainText(raw);

    const url = toUrlFromPageFile(file);
    const crumbs = buildBreadcrumbsForFile(file, dirTitleMap);

    // Use frontmatter title if present, else fallback to last breadcrumb or text
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
      type: 'docs',
    });
  }
  return out;
}

// Collect API endpoint documents from sidebar metadata
async function collectEndpoints(): Promise<EndpointDoc[]> {
  const out: EndpointDoc[] = [];

  try {
    // Read the sidebar metadata JSON
    const sidebarMetadataPath = path.join(
      process.cwd(),
      'src',
      'app',
      '(api)',
      'components',
      'sidebar-metadata.json'
    );

    if (!fsSync.existsSync(sidebarMetadataPath)) {
      console.log('Sidebar metadata not found, skipping endpoint collection');
      return out;
    }

    // Process each category in the sidebar metadata
    for (const category of sidebarMetadata) {
      const categoryName = category.sidebarLabel;
      const categorySlug = category.slug;
      const categoryUrl = `/api/${categorySlug}`;

      // Process each tag (usually one per category)
      for (const tag of category.tags || []) {
        // Process each operation in the tag
        for (const operation of tag.operations || []) {
          const endpointId = operation.elementId || operation.operationId;
          const method = operation.method?.toUpperCase();
          const path = operation.path;
          const summary = operation.summary;

          if (method && path && endpointId) {
            // Create a synthetic body text from the operation data

            out.push({
              id: endpointId,
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
                { url: '/api', title: 'API' },
                { url: categoryUrl, title: categoryName },
              ],
            });
          }
        }
      }
    }

    console.log(`Collected ${out.length} endpoints from sidebar metadata`);
  } catch (error) {
    console.error('Failed to process sidebar metadata:', error);
  }

  return out;
}

// Pages that export getIndex(): Index[]
async function collectTSXviaGetIndex(
  dirTitleMap: Map<string, string>
): Promise<Doc[]> {
  const out: Doc[] = [];
  for await (const file of walk(DOCS_ROOT)) {
    if (!/\/page\.tsx$/.test(file)) continue;
    try {
      const getIndexFile = path.join(path.dirname(file), 'get-index.ts');
      if (!fsSync.existsSync(getIndexFile)) continue;
      const mod = await import(getIndexFile);
      if (typeof mod.getIndex === 'function') {
        const entries = await Promise.resolve(mod.getIndex());
        for (const e of entries as Doc[]) {
          if (!e.url || !e.title) continue;
          const fullUrl = e.url.startsWith('/') ? e.url : `/${e.url}`;
          const absFromUrl = path.join(
            DOCS_ROOT,
            fullUrl.replace(/^\/docs\/?/, '')
          );

          const dirForFile = fsSync.existsSync(absFromUrl)
            ? absFromUrl
            : path.dirname(file); // fallback to the file’s own dir

          const crumbs =
            e.breadcrumbs ??
            buildBreadcrumbsForFile(
              path.join(dirForFile, 'page.tsx'),
              dirTitleMap
            );

          out.push({
            ...e,
            id: e.id ?? e.url,
            body: (e.body ?? '').toString(),
            url: e.url ?? toUrlFromPageFile(file),
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

async function main(config: CollectorConfig = DEFAULT_CONFIG) {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const dirTitleMap = await buildDirTitleMap();

  const collectors: Promise<Doc[]>[] = [];

  if (config.includeDocs) {
    collectors.push(
      collectMDX(dirTitleMap),
      collectTSXviaGetIndex(dirTitleMap)
    );
  }

  if (config.includeEndpoints) {
    collectors.push(collectEndpoints());
  }

  const results = await Promise.all(collectors);
  const docs = results.flat();

  // Separate docs by type for different search configurations
  const docsByType = docs.reduce(
    (acc, doc) => {
      if (!acc[doc.type]) acc[doc.type] = [];
      acc[doc.type].push(doc);
      return acc;
    },
    {} as Record<string, Doc[]>
  );

  // Create MiniSearch index with enhanced configuration for different document types
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

  // Write enhanced search files
  await fs.writeFile(IDX_PATH, JSON.stringify(mini));
  await fs.writeFile(
    DOCS_PATH,
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
        // Include endpoint-specific fields for frontend
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
    `Indexed ${docs.length} documents (${docsByType.docs?.length || 0} docs, ${docsByType.endpoint?.length || 0} endpoints) → ${path.relative(process.cwd(), IDX_PATH)}`
  );
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});
