import { permanentRedirect } from '@/i18n/navigation.server';
import type { Locale } from '@/i18n/config';

export default async function OldModelSelectionGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  permanentRedirect('/inference/model-selection-guide', locale);
}
