import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';
import React from 'react';

const meta: Meta<typeof Separator> = {
  title: 'UI/Separator',
  component: Separator,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Separator>;

export const Horizontal: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <p className="text-sm text-foreground">Section above</p>
      <Separator />
      <p className="text-sm text-foreground">Section below</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-4">
      <span className="text-sm">Item 1</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Item 2</span>
      <Separator orientation="vertical" />
      <span className="text-sm">Item 3</span>
    </div>
  ),
};
