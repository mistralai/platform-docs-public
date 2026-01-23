import fs from 'fs';
import path from 'path';
import {
  DocsMetadata,
  DocsCategoryMetadata,
} from '@/schema/content/documentation';
import { SidebarItem, TocItem } from '@/schema';
import { parseFrontmatter } from './parse-metadata';
import { extractHeadingsFromContent } from './extract-headings';
import { getModelsBreadcrumb } from '@/app/(docs)/models/[slug]/_get-breacrumb';

/**
 * NOTE: Assumptions (tweak to taste):
 * - If a folder has children and either a page.* or _meta.md, the category becomes clickable (has an index route).
 * - Metadata precedence for categories (label/position/toc): _meta.md > _category_.json > fallback (folder name).
 * - For a clickable category with page.*, the visible label uses page title if present; otherwise _meta.md label/title.
 * - Sorting: explicit position/sidebar_position first; ties resolved alphabetically by label/slug.
 * - Pagination includes clickable categories (index pages) before their children.
 * - Empty folders (no children and no page/meta) are skipped.
 */

export const IGNORED_DIRS = ['components'];

const PAGE_BASENAMES = ['page.md', 'page.mdx', 'page.tsx', 'page.jsx'];
const META_BASENAMES = ['_meta.mdx', '_meta.md'];
const CATEGORY_JSON = '_category_.json';

// -----------------------------
// Public API
// -----------------------------

export async function getSidebar(
  rootDir: string,
  basePath = ''
): Promise<SidebarItem[]> {
  const childDirs = readEligibleDirs(rootDir);

  const items: SidebarItem[] = [];

  for (const dirent of childDirs) {
    const subPath = path.join(rootDir, dirent.name);
    const slug = basePath
      ? basePath.split('/').concat(dirent.name)
      : [dirent.name];

    const pageFile = resolvePageFile(subPath);
    const hasPage = Boolean(pageFile);
    const pageIsMdx =
      (pageFile?.endsWith('.mdx') || pageFile?.endsWith('.md')) ?? false;

    const metaFile = resolveMetaFile(subPath);
    const hasMetaMd = Boolean(metaFile);
    const metaMdPath = hasMetaMd ? path.join(subPath, metaFile as string) : '';

    const categoryJson = loadCategoryMetadata(subPath); // may be null

    const children = await getSidebar(
      subPath,
      path.join(basePath, dirent.name)
    );

    const hasChildren = children.length > 0;

    // PAGE / META data
    const pageData =
      hasPage && pageIsMdx
        ? loadFileMetadataAndToc(path.join(subPath, pageFile!))
        : { metadata: null, toc: [] };
    const metaMdData = hasMetaMd
      ? loadFileMetadataAndToc(metaMdPath)
      : { metadata: null as DocsMetadata | null, toc: [] as TocItem[] };

    // Case resolution
    // 1) If there are children -> this is a category. It is clickable when there is a page.* or a _meta.md.
    if (hasChildren) {
      const categoryMeta = deriveCategoryMetadata({
        dirName: dirent.name,
        pageMeta: pageData.metadata,
        metaMd: metaMdData.metadata,
        categoryJson,
      });

      // Prefer page title as label if we have a real index page.
      if (!categoryMeta.label && hasPage && pageData.metadata?.title) {
        categoryMeta.label = pageData.metadata.title;
      }
      let overridedSlug: SidebarItem['overridedSlug'];
      if (typeof categoryMeta.link === 'string') {
        if (categoryMeta.link.startsWith('/')) {
          categoryMeta.link = categoryMeta.link.slice(1);
        }
        if (categoryMeta.link === '/') overridedSlug = [];
        // if link is /something, we need to add the slug to the link
        else overridedSlug = categoryMeta.link.split('/');
      }

      const shouldHide = shouldHideCategory(overridedSlug?.join('/') || '');
      const categoryItem: SidebarItem = {
        slug,
        overridedSlug,
        type: 'category',
        metadata: categoryMeta,
        children,
        pagination: { prev: undefined, next: undefined },
        hidden: shouldHide,
        clickable: hasPage || categoryMeta.link !== undefined,
        hasPage,
        isMarkdownFile: hasPage && pageIsMdx,
      };

      items.push(categoryItem);
      continue;
    }

    // 2) Leaf: if we have a page -> file item with toc (metadata merged with _meta.md if present)
    if (hasPage) {
      const mergedMeta = mergeFileMetadata(
        pageData.metadata,
        metaMdData.metadata
      );

      let toc: TocItem[] = [];
      if (mergedMeta?.template_custom_toc) {
        const defaultToc = pageData.toc;
        toc = processTemplateTOC(mergedMeta.template_custom_toc, defaultToc);
      } else if (mergedMeta?.custom_toc) {
        toc = mergedMeta.custom_toc;
      } else if (mergedMeta?.table_of_contents === false) {
        toc = [];
      } else {
        toc = pageData.toc;
      }

      // 2.1) if is a dynamic route, for example /[slug]/page.tsx, we need to push many items
      if (isDynamicRoute(dirent.name)) {
        const breadcrumb = await getDynamicBreadcrumbForDir(subPath, slug);

        if (breadcrumb && breadcrumb.length > 0) {
          items.push(...breadcrumb);
        }
        continue;
      }
      const fileItem: SidebarItem = {
        slug,
        overridedSlug: slug,
        type: 'file',
        metadata: mergedMeta,
        toc,
        pagination: { prev: undefined, next: undefined },
        clickable: true,
        isMarkdownFile: pageIsMdx,
      };
      items.push(fileItem);
      continue;
    }

    // 3) Leaf: if we only have _meta.md -> treat as a file-like leaf (no ToC)
    if (hasMetaMd && metaMdData.metadata) {
      const fileItem: SidebarItem = {
        slug,
        overridedSlug: slug,
        type: 'file',
        metadata: metaMdData.metadata,
        toc: [],
        pagination: { prev: undefined, next: undefined },
        clickable: true,
        isMarkdownFile: pageIsMdx,
      };
      items.push(fileItem);
      continue;
    }

    // 4) Leaf with no content: skip (do not create empty category nodes)
    // (Intentionally no push)
  }

  // Sorting within the current directory scope
  items.sort(compareSidebarItems);

  // Add pagination (global within this subtree). We do it once at the top-most call for best perf.
  // This function is called recursively, so to avoid O(n^2) repeated work, only add pagination at the root.
  if (!basePath) {
    addPaginationToSidebar(items);
  }

  return items;
}

// -----------------------------
// Helpers: FS & detection
// -----------------------------

function readEligibleDirs(dir: string): fs.Dirent[] {
  let entries: fs.Dirent[] = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch (e) {
    console.warn(`getSidebar: failed to read directory ${dir}:`, e);
    return [];
  }

  return entries.filter(
    entry =>
      entry.isDirectory() &&
      !entry.name.startsWith('.') &&
      !entry.name.startsWith('_') &&
      !IGNORED_DIRS.includes(entry.name)
  );
}

function resolvePageFile(dirPath: string): string | null {
  for (const base of PAGE_BASENAMES) {
    const full = path.join(dirPath, base);
    if (fs.existsSync(full)) return base;
  }
  return null;
}

function resolveMetaFile(dirPath: string): string | null {
  for (const base of META_BASENAMES) {
    const full = path.join(dirPath, base);
    if (fs.existsSync(full)) return base;
  }
  return null;
}

// -----------------------------
// Metadata loaders
// -----------------------------

function loadCategoryMetadata(dirPath: string): DocsCategoryMetadata | null {
  const categoryPath = path.join(dirPath, CATEGORY_JSON);
  if (fs.existsSync(categoryPath)) {
    try {
      const content = fs.readFileSync(categoryPath, 'utf-8');
      const metadata = JSON.parse(content) as DocsCategoryMetadata;
      return metadata;
    } catch (error) {
      console.warn(
        `Failed to parse category metadata at ${categoryPath}:`,
        error
      );
    }
  }
  return null;
}

function loadFileMetadataAndToc(filePath: string): {
  metadata: DocsMetadata | null;
  toc: TocItem[];
} {
  if (!fs.existsSync(filePath)) {
    return { metadata: null, toc: [] };
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const { metadata, content: markdownContent } = parseFrontmatter(content);
    const skipToc =
      metadata &&
      'table_of_contents' in metadata &&
      (metadata as any).table_of_contents === false &&
      !(metadata as any).template_custom_toc;
    const toc = skipToc
      ? []
      : extractHeadingsFromContent(markdownContent, {
          path: filePath,
        });

    return { metadata, toc };
  } catch (error) {
    console.warn(
      `Failed to parse file metadata and TOC at ${filePath}:`,
      error
    );
    return { metadata: null, toc: [] };
  }
}

// -----------------------------
// Category metadata derivation
// -----------------------------

function deriveCategoryMetadata(args: {
  dirName: string;
  pageMeta: DocsMetadata | null;
  metaMd: DocsMetadata | null;
  categoryJson: DocsCategoryMetadata | null;
}): DocsCategoryMetadata {
  const { dirName, pageMeta, metaMd, categoryJson } = args;

  // Precedence: _meta.md > _category_.json > fallback
  const labelFromMetaMd =
    (metaMd as any)?.sidebar_label || metaMd?.title || undefined;
  const positionFromMetaMd = (metaMd as any)?.sidebar_position as
    | number
    | undefined;
  const tocFromMetaMd = (metaMd as any)?.table_of_contents as
    | boolean
    | undefined;

  const labelFromCategory = categoryJson?.label;
  const positionFromCategory = categoryJson?.position;
  const tocFromCategory = categoryJson?.table_of_contents as
    | boolean
    | undefined;

  const fallbackLabel = humanizeSlug(dirName);

  const label = labelFromMetaMd ?? labelFromCategory ?? fallbackLabel;
  const position = positionFromMetaMd ?? positionFromCategory ?? undefined;
  const table_of_contents = tocFromMetaMd ?? tocFromCategory;

  // Some Docusaurus-like category JSONs can include link info; we ignore here because routing is file-based.
  const out: DocsCategoryMetadata = {
    label,
    position: typeof position === 'number' ? position : (undefined as any),
    link: categoryJson?.link,
    table_of_contents,
  } as DocsCategoryMetadata;

  return out;
}

// -----------------------------
// File metadata merge (page frontmatter + _meta.md)
// -----------------------------

function mergeFileMetadata(
  pageMeta: DocsMetadata | null,
  metaMd: DocsMetadata | null
): DocsMetadata | null {
  if (!pageMeta && !metaMd) return null;

  // Precedence rules:
  // - sidebar-specific: _meta.md overrides page (sidebar_position, sidebar_label)
  // - content-specific: page overrides _meta.md (title, description, table_of_contents)
  const out: DocsMetadata = {
    title: pageMeta?.title ?? metaMd?.title ?? '',
    description: pageMeta?.description ?? metaMd?.description ?? '',
    sidebar_position: metaMd?.sidebar_position ?? pageMeta?.sidebar_position,
    sidebar_label: metaMd?.sidebar_label ?? pageMeta?.sidebar_label,
    table_of_contents: pageMeta?.table_of_contents ?? metaMd?.table_of_contents,
    custom_toc: pageMeta?.custom_toc ?? metaMd?.custom_toc,
    template_custom_toc:
      pageMeta?.template_custom_toc ?? metaMd?.template_custom_toc,
  } as DocsMetadata;

  return out;
}

// -----------------------------
// Sorting & pagination
// -----------------------------

function compareSidebarItems(a: SidebarItem, b: SidebarItem): number {
  const posA = getPosition(a);
  const posB = getPosition(b);

  if (posA !== posB) {
    return (
      (posA ?? Number.POSITIVE_INFINITY) - (posB ?? Number.POSITIVE_INFINITY)
    );
  }

  const labelA = getLabelForSort(a).toLowerCase();
  const labelB = getLabelForSort(b).toLowerCase();
  return labelA.localeCompare(labelB);
}

function getPosition(item: SidebarItem): number | undefined {
  if (item.type === 'file')
    return (
      (item.metadata as DocsMetadata | null)?.sidebar_position ?? undefined
    );
  return (item.metadata as DocsCategoryMetadata | null)?.position ?? undefined;
}

function getLabelForSort(item: SidebarItem): string {
  if (item.type === 'file') {
    const m = item.metadata as DocsMetadata | null;
    return (m as any)?.sidebar_label || m?.title || lastSlug(item.slug);
  }
  const m = item.metadata as DocsCategoryMetadata | null;
  return m?.label || lastSlug(item.slug);
}

function lastSlug(slug: string[]): string {
  return slug[slug.length - 1] || '';
}

function humanizeSlug(seg: string): string {
  const s = seg.replace(/[-_]+/g, ' ');
  return s.slice(0, 1).toUpperCase() + s.slice(1);
}

function addPaginationToSidebar(sidebarItems: SidebarItem[]): void {
  const navigableItems = getNavigableItemsInOrder(sidebarItems);

  navigableItems.forEach((item, index) => {
    const prevItem = index > 0 ? navigableItems[index - 1] : null;
    const nextItem =
      index < navigableItems.length - 1 ? navigableItems[index + 1] : null;

    item.pagination = {
      prev:
        prevItem && !item.metadata?.hidePagination
          ? { title: getItemTitle(prevItem), href: getItemHref(prevItem) }
          : undefined,
      next:
        nextItem && !item.metadata?.hidePagination
          ? { title: getItemTitle(nextItem), href: getItemHref(nextItem) }
          : undefined,
    } as any;
  });
}

function getNavigableItemsInOrder(items: SidebarItem[]): SidebarItem[] {
  const result: SidebarItem[] = [];

  function traverse(list: SidebarItem[]) {
    for (const item of list) {
      if (item.type === 'file') {
        result.push(item);
        continue;
      }

      // Category: if clickable, include it first, then descend
      if (item.type === 'category') {
        if (item.hasPage) result.push(item);
        if (item.children && item.children.length > 0) traverse(item.children);
      }
    }
  }

  traverse(items);
  return result;
}

function getItemTitle(item: SidebarItem): string {
  if (item.type === 'file' && item.metadata)
    return (item.metadata as DocsMetadata).title;
  if (item.type === 'category' && item.metadata)
    return (item.metadata as DocsCategoryMetadata).label;
  return lastSlug(item.slug);
}

function getItemHref(item: SidebarItem): string {
  if (item.type === 'category' && !item.hasPage) return '/';
  return `/${item.slug.join('/')}`;
}

// a regex to check if the path is a dynamic route
function isDynamicRoute(path: string): boolean {
  return /\[.*\]/.test(path);
}

function shouldHideCategory(dirName: string): boolean {
  const HIDDEN_DIRS = new Set(['models']);
  return HIDDEN_DIRS.has(dirName);
}

function processTemplateTOC(
  template: Array<{
    id?: string;
    value?: string;
    depth?: number;
    __default?: boolean;
  }>,
  defaultToc: TocItem[]
): TocItem[] {
  const result: TocItem[] = [];

  for (const item of template) {
    if (item.__default === true) {
      result.push(...defaultToc);
    } else if (item.id && item.value && item.depth !== undefined) {
      result.push({
        id: item.id,
        value: item.value,
        depth: item.depth,
      });
    }
  }

  return result;
}

type BreadcrumbProvider = (
  prevSlug: string[]
) => Promise<SidebarItem[]> | SidebarItem[];

// IMPORTANT, ENSURE THIS MATCH WITH THE CORRECT ROUTE
const MODELS_SLUG_DIR = path.join('src', 'app', '(docs)', 'models');
const registry: Array<{ matchDirname: string; provider: BreadcrumbProvider }> =
  [
    {
      matchDirname: path.join(MODELS_SLUG_DIR, '[slug]'),
      provider: getModelsBreadcrumb,
    },
  ];

export async function getDynamicBreadcrumbForDir(
  dirAbsolutePath: string,
  prevSlug: string[]
): Promise<SidebarItem[] | null> {
  const normalized = dirAbsolutePath.split(path.sep).join(path.sep);

  for (const entry of registry) {
    const target = entry.matchDirname.split(path.sep).join(path.sep);

    if (normalized.endsWith(target)) {
      const out = await entry.provider(prevSlug.slice(0, -1));

      return out;
    }
  }
  return null;
}
