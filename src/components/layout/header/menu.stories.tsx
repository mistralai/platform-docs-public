import type { Meta, StoryObj } from '@storybook/react';
import { MobileMenu, MobileMenuButton } from './menu';
import React from 'react';

const metaMenu: Meta<typeof MobileMenu> = {
  title: 'Layout/MobileMenu',
  component: MobileMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'The mobile menu content panel. Contains navigation links, CTA buttons (Reach out, Try Studio), and a theme toggle. Typically displayed inside a dialog/overlay on mobile viewports.',
      },
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="max-w-md border border-border rounded-lg overflow-hidden">
        <Story />
      </div>
    ),
  ],
};

export default metaMenu;
type MenuStory = StoryObj<typeof MobileMenu>;

export const Default: MenuStory = {};

export const Button: StoryObj<typeof MobileMenuButton> = {
  render: () => (
    <div className="flex items-center gap-3">
      <div data-state="closed" className="group">
        <MobileMenuButton />
      </div>
      <div data-state="open" className="group">
        <MobileMenuButton />
      </div>
    </div>
  ),
};
