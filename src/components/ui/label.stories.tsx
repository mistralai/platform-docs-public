import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import { Input } from './input';
import React from 'react';

const meta: Meta<typeof Label> = {
  title: 'UI/Label',
  component: Label,
  tags: ['autodocs'],
  args: {
    children: 'API key name',
  },
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {};

export const WithInput: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <Label htmlFor="api-key">API key</Label>
      <Input id="api-key" placeholder="Enter your API key" />
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="group space-y-2 max-w-sm" data-disabled="true">
      <Label htmlFor="disabled-input">Deployment region</Label>
      <Input id="disabled-input" placeholder="eu-west-1" disabled />
    </div>
  ),
};

export const FormFields: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="project-name">Project name</Label>
        <Input id="project-name" placeholder="My Mistral project" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="model-endpoint">Model endpoint</Label>
        <Input id="model-endpoint" placeholder="https://api.mistral.ai/v1/chat/completions" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="max-tokens">Max tokens</Label>
        <Input id="max-tokens" type="number" placeholder="4096" />
      </div>
    </div>
  ),
};
