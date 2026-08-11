import type { Locale } from '@/i18n/config';
import type { ReleaseNote } from '@/components/release-notes/types';
import enhancedSearchFilteringEn from './en/2026-07-31-enhanced-search-and-filtering-for-workflows.json';
import enhancedSearchFilteringFr from './fr/2026-07-31-enhanced-search-and-filtering-for-workflows.json';

const releaseNotesByLocale: Record<Locale, ReleaseNote[]> = {
  en: [enhancedSearchFilteringEn] as ReleaseNote[],
  fr: [enhancedSearchFilteringFr] as ReleaseNote[],
};

export function getReleaseNotes(locale: Locale): ReleaseNote[] {
  return releaseNotesByLocale[locale];
}

export const releaseNotes = releaseNotesByLocale.en;
