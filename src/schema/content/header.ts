import {
  MISTRAL_CHAT_URL,
  MISTRAL_API_REFERENCE_URL,
  MISTRAL_STUDIO_URL,
} from '@/lib/constants';

export type HeaderLink = {
  label: string;
  href: string;
  /** URL prefixes that activate this tab */
  pathPrefixes: string[];
  /** Sidebar section labels this tab owns */
  sidebarSections: string[];
};

export const headerLinks: HeaderLink[] = [
  {
    label: 'Getting Started',
    href: '/',
    pathPrefixes: ['/', '/getting-started'],
    sidebarSections: ['Getting started'],
  },
  {
    label: 'Models',
    href: '/models',
    pathPrefixes: ['/models'],
    sidebarSections: ['Models'],
  },
  {
    label: 'Products',
    href: '/products',
    pathPrefixes: ['/products', '/le-chat', '/studio-api', '/mistral-vibe'],
    sidebarSections: ['Le Chat', 'Studio', 'Mistral Vibe'],
  },
  {
    label: 'Developers',
    href: '/developers',
    pathPrefixes: ['/developers', '/resources', '/community'],
    sidebarSections: ['Resources', 'Community'],
  },
  {
    label: 'Admin',
    href: '/admin',
    pathPrefixes: ['/admin'],
    sidebarSections: ['Admin', 'Admin Quickstarts', 'Security & Access', 'User Management & Fin Ops'],
  },
  {
    label: 'API',
    href: '/api',
    pathPrefixes: ['/api'],
    sidebarSections: ['API Reference', 'Endpoints', 'Getting Started', 'Beta', 'Beta Features', 'Deprecated'],
  },
];

/** Determine which header tab is active for a given pathname */
export function getActiveHeaderTab(pathname: string): HeaderLink {
  // Check non-root tabs first (more specific paths)
  for (const link of headerLinks) {
    if (link.href === '/') continue;
    if (link.pathPrefixes.some(p => pathname.startsWith(p))) {
      return link;
    }
  }
  // Default to Getting Started
  return headerLinks[0];
}

/** Get sidebar section labels for the active tab */
export function getActiveSidebarSections(pathname: string): string[] {
  return getActiveHeaderTab(pathname).sidebarSections;
}

export const headerDropdownData = [
  {
    id: 'le-chat',
    label: 'Le Chat',
    href: `${MISTRAL_CHAT_URL}`,
    bg: 'bg-primary',
    isExternal: true,
    section: 'default',
  },
  {
    id: 'ai-studio',
    label: 'Studio',
    href: `${MISTRAL_STUDIO_URL}`,
    bg: 'bg-[#6060F8]',
    isExternal: true,
    section: 'default',
  },
  {
    id: 'docs-api',
    label: 'Docs & API',
    href: `/`,
    bg: 'bg-foreground/10 text-foreground',
    section: 'default',
  },
  {
    id: 'admin',
    label: 'Admin',
    href: 'https://admin.mistral.ai',
    isExternal: true,
    bg: 'bg-foreground/10 text-foreground',
    section: 'admin',
  },
];
