import fs from 'node:fs';
import path from 'node:path';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { resolveContentLocale } from '@/lib/content/locale-content';
import type { Locale } from '@/i18n/config';

type Params = { locale: string; slug: string[] };

const DOCS_CONTENT_ROOT = path.join(
  process.cwd(),
  'src',
  'content',
  'en',
  'docs'
);

function collectPageSlugs(): string[] {
  const slugs: string[] = [];

  const walk = (dir: string, parts: string[]): void => {
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    const hasPageMdx = entries.some(
      entry => entry.isFile() && entry.name === 'page.mdx'
    );
    if (hasPageMdx && parts.length > 0) {
      slugs.push(parts.join('/'));
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name.startsWith('_')) continue;
      if (entry.name.startsWith('[') && entry.name.endsWith(']')) continue;
      walk(path.join(dir, entry.name), [...parts, entry.name]);
    }
  };

  walk(DOCS_CONTENT_ROOT, []);
  return slugs;
}

let cachedSlugs: Set<string> | null = null;
function knownSlugs(): Set<string> {
  if (!cachedSlugs) cachedSlugs = new Set(collectPageSlugs());
  return cachedSlugs;
}

export function generateStaticParams(): Pick<Params, 'slug'>[] {
  return Array.from(knownSlugs()).map(slug => ({ slug: slug.split('/') }));
}

async function loadPage(locale: Locale, slug: string[]) {
  const relPath = slug.join('/');
  if (!knownSlugs().has(relPath)) return null;
  const effective = resolveContentLocale(locale, 'docs', relPath);
  switch (effective) {
    case 'en':
      return import(`@/content/en/docs/${relPath}/page.mdx`);
    case 'fr':
      return import(`@/content/fr/docs/${relPath}/page.mdx`);
    default:
      return effective satisfies never;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { locale, slug } = (await params) as { locale: Locale; slug: string[] };
  const mod = await loadPage(locale, slug);
  return (mod?.metadata ?? {}) as Metadata;
}

export default async function DocsCatchAllPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string[] };
  const mod = await loadPage(locale, slug);
  if (!mod) notFound();
  const MDXContent = mod.default;
  return <MDXContent />;
}

export const dynamicParams = false;
