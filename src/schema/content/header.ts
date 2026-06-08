import {
  MISTRAL_CHAT_URL,
  MISTRAL_API_REFERENCE_URL,
  MISTRAL_STUDIO_URL,
} from '@/lib/constants';
import { stripLocale } from '@/i18n/utils';

export type HeaderLinkId =
  | 'getting-started'
  | 'models'
  | 'products'
  | 'developers'
  | 'admin'
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
    id: 'getting-started',
    href: '/',
    pathPrefixes: ['/', '/getting-started'],
    sidebarItemHrefs: ['/'],
  },
  {
    id: 'models',
    href: '/models',
    pathPrefixes: ['/models'],
    sidebarItemHrefs: ['/models'],
  },
  {
    id: 'products',
    href: '/products',
    pathPrefixes: ['/products', '/studio-api', '/vibe'],
    sidebarItemHrefs: ['/studio-api/overview', '/vibe/overview'],
  },
  {
    id: 'developers',
    href: '/developers',
    pathPrefixes: ['/developers', '/resources', '/community'],
    sidebarItemHrefs: ['/resources', '/community'],
  },
  {
    id: 'admin',
    href: '/admin',
    pathPrefixes: ['/admin'],
    sidebarItemHrefs: ['/admin'],
  },
  {
    id: 'api',
    href: '/api',
    pathPrefixes: ['/api'],
    sidebarItemHrefs: ['/api'],
  },
];

/** Determine which header tab is active for a given pathname */
export function getActiveHeaderTab(pathname: string): HeaderLink {
  const stripped = stripLocale(pathname);
  // Check non-root tabs first (more specific paths)
  for (const link of headerLinks) {
    if (link.href === '/') continue;
    if (link.pathPrefixes.some(p => stripped.startsWith(p))) {
      return link;
    }
  }
  // Default to Getting Started
  return headerLinks[0];
}

/** Get top-level sidebar item hrefs for the active tab */
export function getActiveSidebarItemHrefs(pathname: string): string[] {
  return getActiveHeaderTab(pathname).sidebarItemHrefs;
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
