import { defaultLocale, locales } from './config';

const LOCALE_SET = new Set<string>(locales);

/**
 * Strip the leading locale segment from a pathname.
 * Content/sidebar/header matching is locale-agnostic, so strip prefixes like
 * `/fr` before comparing against hrefs like `/models`.
 */
export function stripLocale(pathname: string): string {
  const first = pathname.split('/', 2)[1] ?? '';
  if (LOCALE_SET.has(first)) {
    const rest = pathname.slice(first.length + 1);
    return rest === '' ? '/' : rest;
  }
  return pathname;
}

/**
 * Prefix an internal absolute href with the given locale.
 * - Default locale (`/foo`, `en`) → `/foo`
 * - Target locale (`/foo`, `fr`) → `/fr/foo`
 * - Already locale-prefixed (`/en/foo`) → returned unchanged
 * - Root (`/`) → `/` for default locale, `/<locale>` for target locales
 * - External (`http://…`, `//…`, `mailto:…`, `tel:…`) → returned unchanged
 * - Relative (`./foo`, `../foo`, `foo`, `#hash`) → returned unchanged
 *   (browser resolves against the already-locale-prefixed current URL)
 */
export function prefixWithLocale(href: string, locale: string = defaultLocale): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href;
  const first = href.split('/', 2)[1] ?? '';
  if (LOCALE_SET.has(first)) return href;
  if (locale === defaultLocale) return href;
  if (href === '/') return `/${locale}`;
  return `/${locale}${href}`;
}
