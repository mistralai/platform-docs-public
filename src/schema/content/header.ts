import {
  MISTRAL_CHAT_URL,
  MISTRAL_API_REFERENCE_URL,
  MISTRAL_STUDIO_URL,
} from '@/lib/constants';
import { stripLocale } from '@/i18n/utils';

export type HeaderLinkId =
  | 'vibe'
  | 'studio'
  | 'inference'
  | 'admin'
  | 'resources'
  | 'api';

export type HeaderLink = {
  id: HeaderLinkId;
  href: string;
  /** URL prefixes that activate this tab */
  pathPrefixes: string[];
  /** Top-level sidebar item hrefs this tab owns (locale-invariant) */
  sidebarItemHrefs: string[];
};

export const headerLinks: HeaderLink[] = [
  {
    id: 'vibe',
    href: '/vibe',
    pathPrefixes: ['/vibe'],
    sidebarItemHrefs: ['/vibe'],
  },
  {
    id: 'studio',
    href: '/studio',
    pathPrefixes: ['/studio'],
    sidebarItemHrefs: ['/studio'],
  },
  {
    id: 'inference',
    href: '/inference',
    pathPrefixes: ['/inference', '/models'],
    sidebarItemHrefs: ['/inference'],
  },
  {
    id: 'admin',
    href: '/admin',
    pathPrefixes: ['/admin'],
    sidebarItemHrefs: ['/admin'],
  },
  {
    id: 'resources',
    href: '/resources',
    pathPrefixes: ['/resources'],
    sidebarItemHrefs: ['/resources'],
  },
  {
    id: 'api',
    href: '/api',
    pathPrefixes: ['/api'],
    sidebarItemHrefs: ['/api'],
  },
];

/** Determine which header tab is active for a given pathname */
export function getActiveHeaderTab(pathname: string): HeaderLink | null {
  const stripped = stripLocale(pathname);
  if (stripped === '/') return null;

  // Check non-root tabs first (more specific paths)
  for (const link of headerLinks) {
    if (link.href === '/') continue;
    if (link.pathPrefixes.some(p => stripped.startsWith(p))) {
      return link;
    }
  }

  return null;
}

/** Get top-level sidebar item hrefs for the active tab */
export function getActiveSidebarItemHrefs(pathname: string): string[] {
  const stripped = stripLocale(pathname);
  if (stripped === '/' || stripped.startsWith('/getting-started')) return ['/'];

  return getActiveHeaderTab(pathname)?.sidebarItemHrefs ?? [];
}

export type HeaderDropdownId = 'vibe' | 'ai-studio' | 'docs-api' | 'admin';

export type HeaderDropdownItem = {
  id: HeaderDropdownId;
  href: string;
  bg: string;
  isExternal?: boolean;
  section: 'default' | 'admin';
};

export const headerDropdownData: HeaderDropdownItem[] = [
  {
    id: 'vibe',
    href: `${MISTRAL_CHAT_URL}`,
    bg: 'bg-[#fa500f]',
    isExternal: true,
    section: 'default',
  },
  {
    id: 'ai-studio',
    href: `${MISTRAL_STUDIO_URL}`,
    bg: 'bg-[#0082e6]',
    isExternal: true,
    section: 'default',
  },
  {
    id: 'docs-api',
    href: `/`,
    bg: 'bg-foreground/10 text-foreground',
    section: 'default',
  },
  {
    id: 'admin',
    href: 'https://admin.mistral.ai',
    isExternal: true,
    bg: 'bg-foreground/10 text-foreground',
    section: 'admin',
  },
];
