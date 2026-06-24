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
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  await permanentRedirect('/studio-api/connectors/debugger', locale);
}
