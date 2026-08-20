import type { Locale } from '@/i18n/config';
import type { ReleaseNote } from '@/components/release-notes/types';
import apiKeyExpirationPoliciesEn from './en/2026-08-20-api-key-expiration-policies-and-notifications.json';
import apiKeyExpirationPoliciesFr from './fr/2026-08-20-api-key-expiration-policies-and-notifications.json';
import enhancedSearchFilteringEn from './en/2026-07-31-enhanced-search-and-filtering-for-workflows.json';
import enhancedSearchFilteringFr from './fr/2026-07-31-enhanced-search-and-filtering-for-workflows.json';

const releaseNotesByLocale: Record<Locale, ReleaseNote[]> = {
  en: [apiKeyExpirationPoliciesEn, enhancedSearchFilteringEn] as ReleaseNote[],
  fr: [apiKeyExpirationPoliciesFr, enhancedSearchFilteringFr] as ReleaseNote[],
};

export function getReleaseNotes(locale: Locale): ReleaseNote[] {
  return releaseNotesByLocale[locale];
}

export const releaseNotes = releaseNotesByLocale.en;
