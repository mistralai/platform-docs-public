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
    title: l.text('Manage workspaces', { context: 'Quickstart title about managing workspaces' }),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  await redirect('/getting-started/quickstarts/admin/manage-workspaces', locale);
}
