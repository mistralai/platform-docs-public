import type { Metadata } from 'next';
import { redirect } from '@/i18n/navigation.server';
import { getLingo } from '@/i18n/server';
import type { Locale } from '@/i18n/config';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const l = await getLingo(locale);
  return {
    title: l.text('Analyze data', { context: 'Quickstart title about analyzing data in Vibe Work' }),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  await redirect('/getting-started/quickstarts/vibe-work/analyze-data', locale);
}
