export const locales = ['en', 'fr'] as const;
export const defaultLocale = 'en';
export type Locale = (typeof locales)[number];
