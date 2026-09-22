import type { Locale } from '@/i18n/config';
import type { ReleaseNote } from '@/components/release-notes/types';
import agenticKnowledgeBaseEn from './en/2026-09-22-agentic-knowledge-base.json';
import spreadsheetsInVibeWorkEn from './en/2026-09-22-spreadsheets-in-vibe-work.json';
import miniAppCanvasEn from './en/2026-09-22-mini-app-canvas.json';
import aSimplerVibeExperienceEn from './en/2026-09-22-a-simpler-vibe-experience.json';
import userAndPermissionsManagementEn from './en/2026-09-10-user-and-permissions-management-in-the-admin-panel.json';
import userAndPermissionsManagementFr from './fr/2026-09-10-user-and-permissions-management-in-the-admin-panel.json';
import apiKeyExpirationPoliciesEn from './en/2026-08-20-api-key-expiration-policies-and-notifications.json';
import apiKeyExpirationPoliciesFr from './fr/2026-08-20-api-key-expiration-policies-and-notifications.json';
import enhancedSearchFilteringEn from './en/2026-07-31-enhanced-search-and-filtering-for-workflows.json';
import enhancedSearchFilteringFr from './fr/2026-07-31-enhanced-search-and-filtering-for-workflows.json';

const releaseNotesByLocale: Record<Locale, ReleaseNote[]> = {
  en: [aSimplerVibeExperienceEn, spreadsheetsInVibeWorkEn, miniAppCanvasEn, agenticKnowledgeBaseEn, userAndPermissionsManagementEn, apiKeyExpirationPoliciesEn, enhancedSearchFilteringEn] as ReleaseNote[],
  fr: [userAndPermissionsManagementFr, apiKeyExpirationPoliciesFr, enhancedSearchFilteringFr] as ReleaseNote[],
};

export function getReleaseNotes(locale: Locale): ReleaseNote[] {
  return releaseNotesByLocale[locale];
}

export const releaseNotes = releaseNotesByLocale.en;
