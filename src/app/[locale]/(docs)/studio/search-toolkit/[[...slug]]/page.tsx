import type { Metadata } from 'next';
import { permanentRedirect } from '@/i18n/navigation.server';
import type { Locale } from '@/i18n/config';

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Redirecting...',
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; slug?: string[] }>;
}) {
  const { locale, slug } = (await params) as { locale: Locale; slug?: string[] };
  const sub = slug && slug.length > 0 ? `/${slug.join('/')}` : '';
  await permanentRedirect(`/studio/search/search-toolkit${sub}`, locale);
}
