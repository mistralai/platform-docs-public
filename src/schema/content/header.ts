import {
  MISTRAL_CHAT_URL,
  MISTRAL_API_REFERENCE_URL,
  MISTRAL_STUDIO_URL,
} from '@/lib/constants';

export const headerLinks = [
  {
    label: 'Docs',
    href: `/`,
  },
  {
    label: 'API',
    href: `/api`,
  },
  {
    label: 'Cookbooks',
    href: '/cookbooks',
  },
  {
    label: 'Ambassadors',
    href: '/ambassadors',
  },
];

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
    label: 'AI Studio',
    href: `${MISTRAL_STUDIO_URL}`,
    bg: 'bg-indigo-500',
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
