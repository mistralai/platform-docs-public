import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './badge';
import React from 'react';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: {
    children: 'v1.0',
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="security">Security</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="model">Model</Badge>
      <Badge variant="api">API</Badge>
      <Badge variant="deprecated">Deprecated</Badge>
      <Badge variant="fixed">Fixed</Badge>
      <Badge variant="yellow">Yellow</Badge>
      <Badge variant="orange">Orange</Badge>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge size="2xs">2XS</Badge>
      <Badge size="xs">XS</Badge>
      <Badge size="sm">SM</Badge>
      <Badge size="default">Default</Badge>
      <Badge size="lg">LG</Badge>
    </div>
  ),
};

export const TypeBadges: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge variant="type-string">string</Badge>
      <Badge variant="type-number">number</Badge>
      <Badge variant="type-integer">integer</Badge>
      <Badge variant="type-boolean">boolean</Badge>
      <Badge variant="type-null">null</Badge>
      <Badge variant="type-object">object</Badge>
      <Badge variant="type-array">array</Badge>
      <Badge variant="type-enum">enum</Badge>
      <Badge variant="type-union">union</Badge>
    </div>
  ),
};

export const ModelBadge: Story = {
  args: {
    variant: 'model',
    children: 'Mistral Large',
  },
};
