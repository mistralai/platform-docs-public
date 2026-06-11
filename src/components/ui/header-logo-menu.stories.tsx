import type { Meta, StoryObj } from '@storybook/react';
import { HeaderLogoMenu } from './header-logo-menu';
import React from 'react';
import { BookOpen, Code, FileText, Layers, Rocket } from 'lucide-react';
import type { HeaderItem, HeaderSection } from './header-logo-menu';

const meta: Meta<typeof HeaderLogoMenu> = {
  title: 'UI/HeaderLogoMenu',
  component: HeaderLogoMenu,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/docs',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeaderLogoMenu>;

const items: HeaderItem[] = [
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
    items,
  },
};

export const WithSections: Story = {
  args: {
    items,
    sections: [
      {
        id: 'learn',
        label: 'Learn',
        items: [
          {
            id: 'docs',
            label: 'Documentation',
            href: '/docs',
            icon: <BookOpen className="h-4 w-4" />,
            bg: 'bg-blue-100 dark:bg-blue-900/20',
          },
          {
            id: 'quickstart',
            label: 'Quickstart',
            href: '/quickstart',
            icon: <Rocket className="h-4 w-4" />,
            bg: 'bg-purple-100 dark:bg-purple-900/20',
          },
        ],
      },
      {
        id: 'build',
        label: 'Build',
        items: [
          {
            id: 'api',
            label: 'API reference',
            href: '/api',
            icon: <Code className="h-4 w-4" />,
            bg: 'bg-green-100 dark:bg-green-900/20',
          },
          {
            id: 'sdks',
            label: 'SDKs',
            href: '/sdks',
            icon: <Layers className="h-4 w-4" />,
            bg: 'bg-amber-100 dark:bg-amber-900/20',
          },
        ],
      },
    ] satisfies HeaderSection[],
  },
};

export const WithCustomDefaults: Story = {
  args: {
    items,
    defaultBg: 'bg-purple-100 dark:bg-purple-900/20',
    defaultIcon: <Layers className="h-4 w-4" />,
  },
};

export const ActiveDocumentation: Story = {
  args: {
    items,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/docs/getting-started',
      },
    },
  },
};

export const ActiveApi: Story = {
  args: {
    items,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/api/chat-completions',
      },
    },
  },
};
