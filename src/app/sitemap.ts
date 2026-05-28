import type { MetadataRoute } from 'next';
import { defaultLocale, locales } from '@/i18n/config';
import { collectDefaultLocaleRoutes } from '../../route-utils';

const SITE_URL = process.env.NEXT_PUBLIC_BASE_URL
  ? new URL(process.env.NEXT_PUBLIC_BASE_URL).origin
  : 'https://docs.mistral.ai';

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return collectDefaultLocaleRoutes().flatMap(route => {
    const languages = Object.fromEntries(
      locales.map(loc => [loc, localeUrl(loc, route)])
    ) as Record<string, string>;
    languages['x-default'] = localeUrl(defaultLocale, route);

    return locales.map(loc => ({
      url: localeUrl(loc, route),
      alternates: { languages },
    }));
  });
}

function localeUrl(locale: string, route: string): string {
  if (locale === defaultLocale) {
    return new URL(route, SITE_URL).toString();
  }
  const localizedRoute = route === '/' ? `/${locale}` : `/${locale}${route}`;
  return new URL(localizedRoute, SITE_URL).toString();
}
