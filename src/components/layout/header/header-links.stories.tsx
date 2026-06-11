import type { Meta, StoryObj } from '@storybook/react';
import DesktopHeaderLinks, { MobileHeaderLinks } from './header-links';
import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';

const meta: Meta<typeof DesktopHeaderLinks> = {
  title: 'Layout/HeaderLinks',
  component: DesktopHeaderLinks,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Navigation links displayed in the header. Includes both desktop (horizontal) and mobile (vertical) variants. Active state is determined by the current pathname.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DesktopHeaderLinks>;

export const Default: Story = {};

export const WithCustomClass: Story = {
  args: {
    className: 'gap-8',
  },
};

export const ActiveOnDocs: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/',
      },
    },
  },
};

export const ActiveOnApi: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/api',
      },
    },
  },
};

export const ActiveOnCookbooks: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/cookbooks',
      },
    },
  },
};

export const Mobile: StoryObj<typeof MobileHeaderLinks> = {
  render: () => (
    <Dialog.Root open>
      <div className="w-80 bg-background border border-border rounded-lg p-4">
        <MobileHeaderLinks />
      </div>
    </Dialog.Root>
  ),
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/api',
      },
    },
  },
};
