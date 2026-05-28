import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import sidebarMetadata from '@/content/en/api/sidebar-metadata.json';
import { resolveContentLocale } from '@/lib/content/locale-content';
import type { Locale } from '@/i18n/config';

const ENDPOINT_PREFIX = 'endpoint/';

type Params = { locale: string; slug: string[] };

function endpointSlugs(): string[] {
  return sidebarMetadata
    .map(category => category.slug)
    .filter((slug): slug is string => typeof slug === 'string' && slug.startsWith(ENDPOINT_PREFIX))
    .map(slug => slug.slice(ENDPOINT_PREFIX.length));
}

export function generateStaticParams(): Pick<Params, 'slug'>[] {
  return endpointSlugs().map(slug => ({ slug: slug.split('/') }));
}

async function loadEndpoint(locale: Locale, slug: string[]) {
  const relPath = slug.join('/');
  if (!endpointSlugs().includes(relPath)) return null;
  const effective = resolveContentLocale(locale, 'api/endpoint', relPath);
  switch (effective) {
    case 'en':
      return import(`@/content/en/api/endpoint/${relPath}/page.mdx`);
    case 'fr':
      return import(`@/content/fr/api/endpoint/${relPath}/page.mdx`);
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
  const mod = await loadEndpoint(locale, slug);
  const fm = (mod?.frontmatter ?? mod?._fm ?? {}) as {
    title?: string;
    description?: string;
  };
  return {
    title: fm.title,
    description: fm.description,
  };
}

export default async function EndpointPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string[] };
  const mod = await loadEndpoint(locale, slug);
  if (!mod) notFound();
  const MDXContent = mod.default;
  return <MDXContent />;
}

export const dynamicParams = false;
