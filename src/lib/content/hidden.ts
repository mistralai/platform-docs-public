import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from './parse-metadata';
import { defaultLocale, locales, type Locale } from '../../i18n/config';

const PAGE_BASENAMES = ['page.mdx', 'page.md'];
const META_BASENAMES = ['_meta.mdx', '_meta.md'];
const CATEGORY_JSON = '_category_.json';

const CONTENT_ROOT = path.join(process.cwd(), 'src', 'content');
const docsRootForLocale = (locale: Locale) =>
  path.join(CONTENT_ROOT, locale, 'docs');
const apiRootForLocale = (locale: Locale) =>
  path.join(CONTENT_ROOT, locale, 'api');

const jsonCache = new Map<string, Record<string, unknown> | null>();
const frontmatterCache = new Map<string, Record<string, unknown> | null>();
const docsRouteHiddenCache = new Map<string, boolean>();
const apiEndpointHiddenCache = new Map<string, boolean>();
const routeHiddenCache = new Map<string, boolean>();

function isHiddenValue(value: unknown): boolean {
  return value === true || value === 'true';
}

function readJson(filePath: string): Record<string, unknown> | null {
  const cached = jsonCache.get(filePath);
  if (cached !== undefined || jsonCache.has(filePath)) return cached ?? null;

  let value: Record<string, unknown> | null = null;
  try {
    if (fs.existsSync(filePath)) {
      value = JSON.parse(fs.readFileSync(filePath, 'utf8')) as Record<
        string,
        unknown
      >;
    }
  } catch {
    value = null;
  }
  jsonCache.set(filePath, value);
  return value;
}

function readFrontmatter(filePath: string): Record<string, unknown> | null {
  const cached = frontmatterCache.get(filePath);
  if (cached !== undefined || frontmatterCache.has(filePath)) {
    return cached ?? null;
  }

  let value: Record<string, unknown> | null = null;
  try {
    if (fs.existsSync(filePath)) {
      const { metadata } = parseFrontmatter(fs.readFileSync(filePath, 'utf8'));
      value = metadata ?? null;
    }
  } catch {
    value = null;
  }
  frontmatterCache.set(filePath, value);
  return value;
}

function hasHiddenFrontmatter(filePath: string): boolean {
  return isHiddenValue(readFrontmatter(filePath)?.hidden);
}

function hasHiddenCategoryJson(dirPath: string): boolean {
  return isHiddenValue(readJson(path.join(dirPath, CATEGORY_JSON))?.hidden);
}

function hasHiddenMetaFile(dirPath: string): boolean {
  return META_BASENAMES.some(base =>
    hasHiddenFrontmatter(path.join(dirPath, base))
  );
}

function hasHiddenPageFile(dirPath: string): boolean {
  return PAGE_BASENAMES.some(base =>
    hasHiddenFrontmatter(path.join(dirPath, base))
  );
}

function normalizeRouteParts(route: string): string[] {
  const parts = route.split('/').filter(Boolean);
  const [first] = parts;
  if (first && locales.includes(first as Locale)) {
    return parts.slice(1);
  }
  return parts;
}

function localeForRoute(route: string): Locale {
  const [first] = route.split('/').filter(Boolean);
  return first && locales.includes(first as Locale)
    ? (first as Locale)
    : defaultLocale;
}

export function isDocsRouteHidden(
  route: string,
  locale = localeForRoute(route)
): boolean {
  const cacheKey = `${locale}:${route}`;
  const cached = docsRouteHiddenCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const routeParts = normalizeRouteParts(route);
  let value = false;
  if (routeParts.length > 0 && routeParts[0] !== 'api') {
    const roots = [docsRootForLocale(locale)];
    if (locale !== defaultLocale) roots.push(docsRootForLocale(defaultLocale));

    value = roots.some(root => {
      let current = root;
      for (const segment of routeParts) {
        current = path.join(current, segment);
        if (hasHiddenCategoryJson(current) || hasHiddenMetaFile(current)) {
          return true;
        }
      }
      return hasHiddenPageFile(current);
    });
  }

  docsRouteHiddenCache.set(cacheKey, value);
  return value;
}

export function isApiEndpointHidden(
  slug: string,
  locale: Locale = defaultLocale
): boolean {
  const normalizedSlug = slug
    .replace(/^\/api\//, '')
    .replace(/^api\//, '')
    .replace(/^endpoint\//, 'endpoint/');
  const cacheKey = `${locale}:${normalizedSlug}`;
  const cached = apiEndpointHiddenCache.get(cacheKey);
  if (cached !== undefined) return cached;

  let value = false;
  if (normalizedSlug.startsWith('endpoint/')) {
    const roots = [apiRootForLocale(locale)];
    if (locale !== defaultLocale) roots.push(apiRootForLocale(defaultLocale));

    value = roots.some(root => {
      const dirPath = path.join(root, ...normalizedSlug.split('/'));
      return hasHiddenMetaFile(dirPath) || hasHiddenPageFile(dirPath);
    });
  }

  apiEndpointHiddenCache.set(cacheKey, value);
  return value;
}

export function isRouteHidden(route: string): boolean {
  const cached = routeHiddenCache.get(route);
  if (cached !== undefined) return cached;

  const routeParts = normalizeRouteParts(route);
  let value = false;
  if (routeParts[0] === 'api') {
    value = isApiEndpointHidden(
      routeParts.slice(1).join('/'),
      localeForRoute(route)
    );
  } else if (routeParts.length > 0) {
    value = isDocsRouteHidden(route, localeForRoute(route));
  }

  routeHiddenCache.set(route, value);
  return value;
}
