import type { Meta, StoryObj } from '@storybook/react';
import { ThemeToggle } from './theme-toggle';

const meta: Meta<typeof ThemeToggle> = {
  title: 'Layout/ThemeToggle',
  component: ThemeToggle,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Toggle between light and dark themes. Supports keyboard shortcut Cmd/Ctrl+T. Displays sun and moon icons with a sliding indicator.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeToggle>;

export const Default: Story = {};
