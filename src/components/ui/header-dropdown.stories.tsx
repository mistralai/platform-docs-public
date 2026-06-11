import type { Meta, StoryObj } from '@storybook/react';
import { HeaderDropdown } from './header-dropdown';
import React from 'react';
import { BookOpen, Code, FileText, Key } from 'lucide-react';
import type { HeaderItem } from './header-logo-menu';

const meta: Meta<typeof HeaderDropdown> = {
  title: 'UI/HeaderDropdown',
  component: HeaderDropdown,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HeaderDropdown>;

const defaultItems: HeaderItem[] = [
  {
    id: 'docs',
    label: 'Documentation',
    href: '/docs',
    icon: <BookOpen className="h-4 w-4" />,
    bg: 'bg-blue-100 dark:bg-blue-900/20',
  },
  {
    id: 'api',
    label: 'API reference',
    href: '/api',
    icon: <Code className="h-4 w-4" />,
    bg: 'bg-green-100 dark:bg-green-900/20',
  },
  {
    id: 'changelog',
    label: 'Changelog',
    href: '/changelog',
    icon: <FileText className="h-4 w-4" />,
    bg: 'bg-orange-100 dark:bg-orange-900/20',
  },
];

export const Default: Story = {
  args: {
    items: defaultItems,
    triggerLabel: 'Docs & API',
  },
};

export const WithTriggerIcon: Story = {
  args: {
    items: defaultItems,
    triggerLabel: 'Resources',
    triggerIcon: <Key className="h-4 w-4" />,
  },
};

export const ExternalLinks: Story = {
  args: {
    items: [
      {
        id: 'console',
        label: 'Mistral AI Studio',
        href: 'https://console.mistral.ai',
        icon: <Code className="h-4 w-4" />,
        bg: 'bg-purple-100 dark:bg-purple-900/20',
        isExternal: true,
      },
      {
        id: 'chat',
        label: 'le Chat',
        href: 'https://chat.mistral.ai',
        icon: <BookOpen className="h-4 w-4" />,
        bg: 'bg-orange-100 dark:bg-orange-900/20',
        isExternal: true,
      },
    ],
    triggerLabel: 'Products',
  },
};

export const SingleItem: Story = {
  args: {
    items: [
      {
        id: 'api',
        label: 'API reference',
        href: '/api',
        icon: <Code className="h-4 w-4" />,
        bg: 'bg-green-100 dark:bg-green-900/20',
      },
    ],
    triggerLabel: 'API',
  },
};
