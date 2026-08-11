import { permanentRedirect } from '@/i18n/navigation.server';
import type { Locale } from '@/i18n/config';

export default async function OldAmbassadorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  permanentRedirect('/resources/ambassadors', locale);
}
