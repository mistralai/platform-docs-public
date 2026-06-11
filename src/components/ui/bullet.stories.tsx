import type { Meta, StoryObj } from '@storybook/react';
import { Bullet } from './bullet';
import React from 'react';

const meta: Meta<typeof Bullet> = {
  title: 'UI/Bullet',
  component: Bullet,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Bullet>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Bullet size="sm" />
        <span className="text-sm">Small</span>
      </div>
      <div className="flex items-center gap-2">
        <Bullet size="default" />
        <span className="text-sm">Default</span>
      </div>
      <div className="flex items-center gap-2">
        <Bullet size="lg" />
        <span className="text-sm">Large</span>
      </div>
      <div className="flex items-center gap-2">
        <Bullet size="xl" />
        <span className="text-sm">Extra Large</span>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-4">
      <div className="flex items-center gap-2">
        <Bullet variant="primary" />
        <span className="text-sm">Primary</span>
      </div>
      <div className="flex items-center gap-2">
        <Bullet variant="secondary" />
        <span className="text-sm">Secondary</span>
      </div>
    </div>
  ),
};

export const StatusList: Story = {
  render: () => (
    <div className="space-y-2 max-w-xs">
      <div className="flex items-center gap-2">
        <Bullet variant="primary" size="sm" />
        <span className="text-sm">Mistral Large — active</span>
      </div>
      <div className="flex items-center gap-2">
        <Bullet variant="secondary" size="sm" />
        <span className="text-sm">Mistral Small — idle</span>
      </div>
      <div className="flex items-center gap-2">
        <Bullet variant="primary" size="sm" />
        <span className="text-sm">Devstral — active</span>
      </div>
    </div>
  ),
};
