import type { Meta, StoryObj } from '@storybook/react';
import { CopyButton } from './copy-button';
import React from 'react';

const meta: Meta<typeof CopyButton> = {
  title: 'UI/CopyButton',
  component: CopyButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CopyButton>;

export const Default: Story = {
  args: {
    value: 'pip install mistralai',
    children: <span className="font-mono text-sm">pip install mistralai</span>,
  },
};

export const WithCustomText: Story = {
  args: {
    value: 'MISTRAL_API_KEY=your_key_here',
    children: <span className="font-mono text-sm">MISTRAL_API_KEY=your_key_here</span>,
  },
};

export const Disabled: Story = {
  args: {
    value: 'pip install mistralai',
    disabled: true,
    children: <span className="font-mono text-sm text-muted-foreground">pip install mistralai</span>,
  },
};
