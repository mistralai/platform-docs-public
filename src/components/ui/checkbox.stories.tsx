import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './checkbox';
import { Label } from './label';
import React from 'react';

const meta: Meta<typeof Checkbox> = {
  title: 'UI/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {};

export const Checked: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledChecked: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept API usage terms</Label>
    </div>
  ),
};

export const ModelSelection: Story = {
  render: () => (
    <div className="space-y-3 max-w-xs">
      <div className="flex items-center gap-2">
        <Checkbox id="model-large" defaultChecked />
        <Label htmlFor="model-large">Mistral Large</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="model-small" />
        <Label htmlFor="model-small">Mistral Small</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="model-devstral" defaultChecked />
        <Label htmlFor="model-devstral">Devstral</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="model-codestral" disabled />
        <Label htmlFor="model-codestral">Codestral (unavailable)</Label>
      </div>
    </div>
  ),
};
