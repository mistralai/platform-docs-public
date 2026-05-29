import 'server-only';
import {
  redirect as nextRedirect,
  permanentRedirect as nextPermanentRedirect,
  type RedirectType,
} from 'next/navigation';
import { prefixWithLocale } from './utils';
import type { Locale } from './config';

/** `redirect()` that prefixes absolute internal hrefs with the active locale. */
export async function redirect(href: string, locale: Locale | string, type?: RedirectType): Promise<never> {
  nextRedirect(prefixWithLocale(href, locale), type);
}

/** `permanentRedirect()` that prefixes absolute internal hrefs with the active locale. */
export async function permanentRedirect(href: string, locale: Locale | string, type?: RedirectType): Promise<never> {
  nextPermanentRedirect(prefixWithLocale(href, locale), type);
}
