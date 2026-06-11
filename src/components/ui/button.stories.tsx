import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './button';
import { ArrowRightIcon, DownloadIcon } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Get API Key',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button variant="default">Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="tertiary">Tertiary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="xs">Extra Small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button size="icon"><ArrowRightIcon /></Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button>
        <DownloadIcon />
        Deploy Model
      </Button>
      <Button variant="outline">
        <ArrowRightIcon />
        Get Started
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Button disabled>Default</Button>
      <Button variant="destructive" disabled>Destructive</Button>
      <Button variant="outline" disabled>Outline</Button>
      <Button variant="secondary" disabled>Secondary</Button>
    </div>
  ),
};
