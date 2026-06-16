/**
 * Load the generated Speakeasy rendition for a locale: the structured
 * `sidebar-metadata.json` and the `page.mdx` files. This is what the tests assert
 * against the spec oracle.
 */

import { existsSync, readFileSync } from 'node:fs';

export const LOCALES = ['en', 'fr'] as const;
export type Locale = (typeof LOCALES)[number];

export type RenditionProperty = { elementId: string; name: string };
export type RenditionOperation = {
  elementId: string;
  method: string;
  path: string;
  operationId: string;
  summary?: string;
  description?: string;
  requestBody?: { elementId: string; properties: RenditionProperty[] };
  responses?: Record<string, { elementId: string; properties: RenditionProperty[] }>;
};
export type SidebarEntry = {
  sidebarLabel: string;
  slug: string;
  tags: { name: string; operations: RenditionOperation[] }[];
};

export type Rendition = {
  locale: Locale;
  sidebar: SidebarEntry[];
  /** operationId -> { slug, op } */
  byOperationId: Map<string, { slug: string; op: RenditionOperation }>;
  slugs: Set<string>;
};

export const apiDir = (locale: string) => `./src/content/${locale}/api`;
export const sidebarPath = (locale: string) => `${apiDir(locale)}/sidebar-metadata.json`;
export const pagePath = (locale: string, slug: string) => `${apiDir(locale)}/${slug}/page.mdx`;

const renditionCache = new Map<string, Rendition>();
const pageCache = new Map<string, string | null>();

export function loadRendition(locale: Locale): Rendition {
  const hit = renditionCache.get(locale);
  if (hit) return hit;

  const sidebar = JSON.parse(readFileSync(sidebarPath(locale), 'utf8')) as SidebarEntry[];
  const byOperationId = new Map<string, { slug: string; op: RenditionOperation }>();
  const slugs = new Set<string>();
  for (const entry of sidebar) {
    slugs.add(entry.slug);
    for (const tag of entry.tags ?? []) {
      for (const op of tag.operations ?? []) {
        byOperationId.set(op.operationId, { slug: entry.slug, op });
      }
    }
  }

  const rendition: Rendition = { locale, sidebar, byOperationId, slugs };
  renditionCache.set(locale, rendition);
  return rendition;
}

export function readPage(locale: string, slug: string): string | null {
  const key = `${locale}:${slug}`;
  if (pageCache.has(key)) return pageCache.get(key)!;
  const p = pagePath(locale, slug);
  const content = existsSync(p) ? readFileSync(p, 'utf8') : null;
  pageCache.set(key, content);
  return content;
}

export function operationsForSlug(rendition: Rendition, slug: string): RenditionOperation[] {
  const entry = rendition.sidebar.find(e => e.slug === slug);
  return entry ? entry.tags.flatMap(t => t.operations) : [];
}

/** The page's title anchor for an operation, as written in the MDX (escaped braces). */
function titleMarker(elementId: string): string {
  return `\\{#${elementId}\\}`;
}

/**
 * Slice of a page.mdx belonging to one operation: from its title anchor to the
 * next operation's title anchor (or end of page).
 */
export function operationSlice(
  page: string,
  op: RenditionOperation,
  allOnPage: RenditionOperation[]
): string | null {
  const start = page.indexOf(titleMarker(op.elementId));
  if (start < 0) return null;
  let end = page.length;
  for (const other of allOnPage) {
    if (other.elementId === op.elementId) continue;
    const i = page.indexOf(titleMarker(other.elementId));
    if (i > start && i < end) end = i;
  }
  return page.slice(start, end);
}

export function requestProps(op: RenditionOperation): string[] {
  return (op.requestBody?.properties ?? []).map(p => p.name);
}

/** Property names of the success (2xx, else `default`) application/json response. */
export function successResponseProps(op: RenditionOperation): string[] {
  const responses = op.responses ?? {};
  const keys = Object.keys(responses);
  // Prefer a 2xx response; fall back to `default`. Never blindly take the first
  // key — that could be a 4xx/5xx and mismatch the spec oracle's success schema.
  const key = keys.find(k => /^2\d\d/.test(k)) ?? keys.find(k => /^default/.test(k));
  return key ? (responses[key].properties ?? []).map(p => p.name) : [];
}
