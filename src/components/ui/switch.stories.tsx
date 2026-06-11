import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './switch';
import { Label } from './label';
import React from 'react';

const meta: Meta<typeof Switch> = {
  title: 'UI/Switch',
  component: Switch,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Switch>;

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
      <Switch id="streaming" />
      <Label htmlFor="streaming">Enable streaming</Label>
    </div>
  ),
};

export const SettingsPanel: Story = {
  render: () => (
    <div className="space-y-4 max-w-sm">
      <div className="flex items-center justify-between">
        <Label htmlFor="stream-mode">Stream responses</Label>
        <Switch id="stream-mode" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="safe-prompt">Safe prompt</Label>
        <Switch id="safe-prompt" defaultChecked />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="json-mode">JSON mode</Label>
        <Switch id="json-mode" />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="function-calling">Function calling</Label>
        <Switch id="function-calling" disabled />
      </div>
    </div>
  ),
};
