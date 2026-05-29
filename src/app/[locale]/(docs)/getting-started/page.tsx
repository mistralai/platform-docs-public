import { redirect } from '@/i18n/navigation.server';
import type { Locale } from '@/i18n/config';

export default async function GettingStartedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  await redirect('/', locale);
}
