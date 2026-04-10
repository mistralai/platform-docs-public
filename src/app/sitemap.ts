import fs from 'node:fs/promises';
import path from 'node:path';
import type { MetadataRoute } from 'next';
import cookbookData from '@/../cookbooks.config.json';
import { models } from '@/schema';
import {
  type CookbookEntry,
  generateCookbookSlug,
} from '@/schema/cookbook';

const APP_DIR = path.join(process.cwd(), 'src', 'app');
const PAGE_FILE_PATTERN = /^page\.(?:js|jsx|md|mdx|ts|tsx)$/;
const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL
  ? new URL(process.env.NEXT_PUBLIC_BASE_URL).origin
  : 'https://docs.mistral.ai';

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [staticRoutes, modelRoutes, cookbookRoutes] = await Promise.all([
    getStaticRoutes(APP_DIR),
    Promise.resolve(models.map(model => `/models/${model.slug}`)),
    Promise.resolve(getCookbookRoutes()),
  ]);

  return [...new Set([...staticRoutes, ...modelRoutes, ...cookbookRoutes])]
    .sort()
    .map(route => ({
      url: new URL(route, SITE_URL).toString(),
    }));
}

async function getStaticRoutes(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const routes: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      routes.push(...(await getStaticRoutes(fullPath)));
      continue;
    }

    if (!PAGE_FILE_PATTERN.test(entry.name)) {
      continue;
    }

    const route = toRoutePath(fullPath);
    if (route) {
      routes.push(route);
    }
  }

  return routes;
}

function toRoutePath(pagePath: string): string | null {
  const relativeDir = path.relative(APP_DIR, path.dirname(pagePath));
  const segments = relativeDir
    .split(path.sep)
    .filter(Boolean)
    .filter(segment => !(segment.startsWith('(') && segment.endsWith(')')));

  if (
    segments.some(
      segment =>
        segment.startsWith('_') ||
        (segment.startsWith('[') && segment.endsWith(']'))
    )
  ) {
    return null;
  }

  if (segments.length === 0) {
    return '/';
  }

  return `/${segments.join('/')}`;
}

function getCookbookRoutes(): string[] {
  return (cookbookData as CookbookEntry[])
    .filter(entry => entry.availableInDocs.page)
    .map(entry => `/cookbooks/${generateCookbookSlug(entry.path)}`);
}
