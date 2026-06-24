import type { Metadata } from 'next';
import { permanentRedirect } from '@/i18n/navigation.server';
import type { Locale } from '@/i18n/config';

const REDIRECT_TARGETS: Record<string, string> = {
  connectors: '/studio-api/connectors',
  'connectors/confirmation': '/studio-api/connectors/confirmation',
  'connectors/conversations': '/studio-api/connectors/conversations',
  'connectors/management': '/studio-api/connectors/management',
  'connectors/playground': '/studio-api/connectors/debugger',
  'connectors/tool_calling': '/studio-api/connectors/tool_calling',
  libraries: '/studio-api/libraries',
  'search-toolkit': '/studio-api/search-toolkit',
  'search-toolkit/ingestion': '/studio-api/search-toolkit/ingestion',
  'search-toolkit/ingestion/embedders': '/studio-api/search-toolkit/ingestion/embedders',
  'search-toolkit/ingestion/enrichers': '/studio-api/search-toolkit/ingestion/enrichers',
  'search-toolkit/ingestion/extractors': '/studio-api/search-toolkit/ingestion/extractors',
  'search-toolkit/ingestion/loaders': '/studio-api/search-toolkit/ingestion/loaders',
  'search-toolkit/ingestion/splitters': '/studio-api/search-toolkit/ingestion/splitters',
  'search-toolkit/quickstart': '/studio-api/search-toolkit/quickstart',
  'search-toolkit/retrieval': '/studio-api/search-toolkit/retrieval',
  'search-toolkit/retrieval/preprocessing': '/studio-api/search-toolkit/retrieval/preprocessing',
  'search-toolkit/retrieval/rerankers': '/studio-api/search-toolkit/retrieval/rerankers',
  'search-toolkit/retrieval/retrievers': '/studio-api/search-toolkit/retrieval/retrievers',
  'search-toolkit/retrieval/semantic-cache': '/studio-api/search-toolkit/retrieval/semantic-cache',
  'search-toolkit/search-index': '/studio-api/search-toolkit/search-index',
  'search-toolkit/vespa': '/studio-api/search-toolkit/vespa',
  'search-toolkit/vespa/anatomy': '/studio-api/search-toolkit/vespa/anatomy',
  'search-toolkit/vespa/cli': '/studio-api/search-toolkit/vespa/cli',
  'search-toolkit/vespa/local-development': '/studio-api/search-toolkit/vespa/local-development',
  'search-toolkit/vespa/migrations': '/studio-api/search-toolkit/vespa/migrations',
  'search-toolkit/vespa/operations': '/studio-api/search-toolkit/vespa/operations',
  'search-toolkit/vespa/query-profiles': '/studio-api/search-toolkit/vespa/query-profiles',
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
  await permanentRedirect(target ?? '/studio-api/knowledge-rag/rag_quickstart', locale);
}
