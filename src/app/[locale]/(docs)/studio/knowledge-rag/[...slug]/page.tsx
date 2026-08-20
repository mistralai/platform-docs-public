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
  libraries: '/studio/search/libraries',
  'search-toolkit': '/studio/search/search-toolkit',
  'search-toolkit/changelog': '/studio/search/search-toolkit/changelog',
  'search-toolkit/document-model': '/studio/search/search-toolkit/document-model',
  'search-toolkit/ingestion': '/studio/search/search-toolkit/ingestion',
  'search-toolkit/ingestion/embedders': '/studio/search/search-toolkit/ingestion/embedders',
  'search-toolkit/ingestion/enrichers': '/studio/search/search-toolkit/ingestion/enrichers',
  'search-toolkit/ingestion/extractors': '/studio/search/search-toolkit/ingestion/extractors',
  'search-toolkit/ingestion/loaders': '/studio/search/search-toolkit/ingestion/loaders',
  'search-toolkit/ingestion/splitters': '/studio/search/search-toolkit/ingestion/splitters',
  'search-toolkit/quickstart': '/studio/search/search-toolkit/quickstart',
  'search-toolkit/retrieval': '/studio/search/search-toolkit/retrieval',
  'search-toolkit/retrieval/preprocessing': '/studio/search/search-toolkit/retrieval/preprocessing',
  'search-toolkit/retrieval/rerankers': '/studio/search/search-toolkit/retrieval/rerankers',
  'search-toolkit/retrieval/retrievers': '/studio/search/search-toolkit/retrieval/retrievers',
  'search-toolkit/retrieval/semantic-cache': '/studio/search/search-toolkit/retrieval/semantic-cache',
  'search-toolkit/search-index': '/studio/search/search-toolkit/search-index',
  'search-toolkit/vespa': '/studio/search/search-toolkit/vespa',
  'search-toolkit/vespa/anatomy': '/studio/search/search-toolkit/vespa/anatomy',
  'search-toolkit/vespa/cli': '/studio/search/search-toolkit/vespa/cli',
  'search-toolkit/vespa/local-development': '/studio/search/search-toolkit/vespa/local-development',
  'search-toolkit/vespa/migration-helpers': '/studio/search/search-toolkit/vespa/migration-helpers',
  'search-toolkit/vespa/migrations': '/studio/search/search-toolkit/vespa/migrations',
  'search-toolkit/vespa/operations': '/studio/search/search-toolkit/vespa/operations',
  'search-toolkit/vespa/query-profiles': '/studio/search/search-toolkit/vespa/query-profiles',
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
