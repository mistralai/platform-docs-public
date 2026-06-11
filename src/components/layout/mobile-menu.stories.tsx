import type { Meta, StoryObj } from '@storybook/react';
import {
  MobileMenuProvider,
  MobileMenuTrigger,
  MobileMenuContent,
  MobileMenuClose,
} from './mobile-menu';
import React from 'react';
import { Button } from '@/components/ui/button';

const meta: Meta<typeof MobileMenuContent> = {
  title: 'Layout/MobileMenuDialog',
  component: MobileMenuContent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Dialog-based mobile menu system built on Radix UI Dialog. Provides MobileMenuProvider (root), MobileMenuTrigger, MobileMenuContent (portal + overlay), and MobileMenuClose primitives.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof MobileMenuContent>;

export const Default: Story = {
  render: () => (
    <MobileMenuProvider>
      <MobileMenuTrigger asChild>
        <Button variant="outline">Open mobile menu</Button>
      </MobileMenuTrigger>
      <MobileMenuContent>
        <div className="bg-muted border-y border-border/50 pointer-events-auto p-6">
          <nav className="flex flex-col gap-2">
            <a href="/" className="px-3 py-2 rounded-md hover:bg-accent">Docs</a>
            <a href="/api" className="px-3 py-2 rounded-md hover:bg-accent">API</a>
            <a href="/cookbooks" className="px-3 py-2 rounded-md hover:bg-accent">Cookbooks</a>
          </nav>
          <div className="mt-4 pt-4 border-t border-border/50">
            <MobileMenuClose asChild>
              <Button variant="secondary" className="w-full">Close menu</Button>
            </MobileMenuClose>
          </div>
        </div>
      </MobileMenuContent>
    </MobileMenuProvider>
  ),
};
