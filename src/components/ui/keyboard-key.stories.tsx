import type { Meta, StoryObj } from '@storybook/react';
import { KeyboardKey } from './keyboard-key';
import React from 'react';

const meta: Meta<typeof KeyboardKey> = {
  title: 'UI/KeyboardKey',
  component: KeyboardKey,
  tags: ['autodocs'],
  args: {
    children: 'K',
  },
};

export default meta;
type Story = StoryObj<typeof KeyboardKey>;

export const Default: Story = {};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <KeyboardKey size="sm">K</KeyboardKey>
      <KeyboardKey size="default">K</KeyboardKey>
      <KeyboardKey size="lg">K</KeyboardKey>
      <KeyboardKey size="xl">K</KeyboardKey>
    </div>
  ),
};

export const Pressed: Story = {
  args: {
    variant: 'pressed',
    children: 'K',
  },
};

export const KeyCombination: Story = {
  render: () => (
    <div className="flex items-center gap-1.5">
      <KeyboardKey size="sm">&#8984;</KeyboardKey>
      <span className="text-muted-foreground text-sm">+</span>
      <KeyboardKey size="sm">K</KeyboardKey>
    </div>
  ),
};
