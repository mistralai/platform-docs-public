import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import React from 'react';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    type: 'text',
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Enter your API key...',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const File: Story = {
  args: {
    type: 'file',
  },
};

export const Invalid: Story = {
  render: () => (
    <div className="space-y-2 max-w-sm">
      <Input aria-invalid="true" defaultValue="invalid-key-format" />
      <p className="text-sm text-destructive">Invalid API key format</p>
    </div>
  ),
};
