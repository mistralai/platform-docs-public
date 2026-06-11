import type { Meta, StoryObj } from '@storybook/react';
import { ActiveIndicator } from './active-indicator';
import React from 'react';

const meta: Meta<typeof ActiveIndicator> = {
  title: 'UI/ActiveIndicator',
  component: ActiveIndicator,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ActiveIndicator>;

export const Default: Story = {};

export const WithCustomClass: Story = {
  args: {
    className: 'p-1',
  },
};

export const InNavItem: Story = {
  render: () => (
    <div className="space-y-2 max-w-xs">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent">
        <ActiveIndicator />
        <span className="text-sm font-medium">Getting started</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md">
        <span className="text-sm text-muted-foreground ml-[7px]">API reference</span>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md">
        <span className="text-sm text-muted-foreground ml-[7px]">Model deployment</span>
      </div>
    </div>
  ),
};
