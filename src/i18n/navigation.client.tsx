'use client';

import * as React from 'react';
import { useEffect, type ReactNode } from 'react';
import NextLink from 'next/link';
import {
  usePathname as useRawPathname,
  useRouter as useRawRouter,
  useParams,
} from 'next/navigation';
import { defaultLocale, locales, type Locale } from './config';
import { prefixWithLocale, stripLocale } from './utils';

const LOCALE_SET = new Set<string>(locales);

/**
 * Prefer route params when available. Components rendered outside the
 * `[locale]` tree (root layout's header/footer, root not-found) fall through
 * to parsing the pathname. Default-locale redirects keep canonical app URLs
 * locale-prefixed, so the first segment is authoritative there.
 */
export function useLocale(): string {
  const params = useParams();
  const fromParams = params?.locale;
  if (typeof fromParams === 'string') return fromParams;
  const pathname = useRawPathname() ?? '';
  const first = pathname.split('/', 2)[1] ?? '';
  return LOCALE_SET.has(first) ? first : defaultLocale;
}

type LocaleFromPathnameProps = {
  variants: {
    locale: Locale;
    children: ReactNode;
  }[];
};

/**
 * Selects a locale-specific server-rendered variant based on client locale.
 */
export function ClientLocaleSelect({ variants }: LocaleFromPathnameProps) {
  const locale = useLocale() as Locale;
  const variant = variants.find(item => item.locale === locale) ?? variants.find(item => item.locale === defaultLocale)!;

  useEffect(() => {
    document.documentElement.lang = variant.locale;
  }, [locale]);

  return variant.children;
}

/** `usePathname()` with the leading locale segment stripped. */
export function usePathname(): string {
  return stripLocale(useRawPathname() ?? '/');
}

/** `useRouter()` whose `push`/`replace`/`prefetch` prefix absolute internal hrefs. */
export function useRouter(): ReturnType<typeof useRawRouter> {
  const router = useRawRouter();
  const locale = useLocale();
  return React.useMemo(() => ({
    ...router,
    push: (href, options) => router.push(prefixWithLocale(href, locale), options),
    replace: (href, options) => router.replace(prefixWithLocale(href, locale), options),
    prefetch: (href, options) => router.prefetch(prefixWithLocale(href, locale), options),
  }), [router, locale]);
}

type NextLinkProps = React.ComponentProps<typeof NextLink>;
type LinkProps = Omit<NextLinkProps, 'href'> & { href: string };

/** `next/link` that prefixes absolute internal hrefs with the active locale. */
export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { href, ...props },
  ref,
) {
  const locale = useLocale();
  return <NextLink ref={ref} href={prefixWithLocale(href, locale)} {...props} />;
});

export default Link;
