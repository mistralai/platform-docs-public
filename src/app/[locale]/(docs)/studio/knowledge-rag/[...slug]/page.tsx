import type { Metadata } from 'next';
import { permanentRedirect } from '@/i18n/navigation.server';
import type { Locale } from '@/i18n/config';

const REDIRECT_TARGETS: Record<string, string> = {
  connectors: '/studio/connectors',
  'connectors/confirmation': '/studio/connectors/confirmation',
  'connectors/conversations': '/studio/connectors/conversations',
  'connectors/management': '/studio/connectors/management',
  'connectors/playground': '/studio/connectors/debugger',
  'connectors/tool_calling': '/studio/connectors/tool_calling',
  libraries: '/studio/libraries',
  'search-toolkit': '/studio/search-toolkit',
  'search-toolkit/ingestion': '/studio/search-toolkit/ingestion',
  'search-toolkit/ingestion/embedders': '/studio/search-toolkit/ingestion/embedders',
  'search-toolkit/ingestion/enrichers': '/studio/search-toolkit/ingestion/enrichers',
  'search-toolkit/ingestion/extractors': '/studio/search-toolkit/ingestion/extractors',
  'search-toolkit/ingestion/loaders': '/studio/search-toolkit/ingestion/loaders',
  'search-toolkit/ingestion/splitters': '/studio/search-toolkit/ingestion/splitters',
  'search-toolkit/quickstart': '/studio/search-toolkit/quickstart',
  'search-toolkit/retrieval': '/studio/search-toolkit/retrieval',
  'search-toolkit/retrieval/preprocessing': '/studio/search-toolkit/retrieval/preprocessing',
  'search-toolkit/retrieval/rerankers': '/studio/search-toolkit/retrieval/rerankers',
  'search-toolkit/retrieval/retrievers': '/studio/search-toolkit/retrieval/retrievers',
  'search-toolkit/retrieval/semantic-cache': '/studio/search-toolkit/retrieval/semantic-cache',
  'search-toolkit/search-index': '/studio/search-toolkit/search-index',
  'search-toolkit/vespa': '/studio/search-toolkit/vespa',
  'search-toolkit/vespa/anatomy': '/studio/search-toolkit/vespa/anatomy',
  'search-toolkit/vespa/cli': '/studio/search-toolkit/vespa/cli',
  'search-toolkit/vespa/local-development': '/studio/search-toolkit/vespa/local-development',
  'search-toolkit/vespa/migrations': '/studio/search-toolkit/vespa/migrations',
  'search-toolkit/vespa/operations': '/studio/search-toolkit/vespa/operations',
  'search-toolkit/vespa/query-profiles': '/studio/search-toolkit/vespa/query-profiles',
};

type Params = { locale: string; slug: string[] };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const target = REDIRECT_TARGETS[slug.join('/')];
  return {
    title: target ? 'Redirecting...' : 'Not found',
  };
}

export function generateStaticParams(): Pick<Params, 'slug'>[] {
  return Object.keys(REDIRECT_TARGETS).map(slug => ({ slug: slug.split('/') }));
}

export default async function Page({
  params,
}: {
  params: Promise<Params>;
}) {
  const { locale, slug } = (await params) as { locale: Locale; slug: string[] };
  const target = REDIRECT_TARGETS[slug.join('/')];
  await permanentRedirect(target ?? '/studio/knowledge-rag/rag_quickstart', locale);
}
