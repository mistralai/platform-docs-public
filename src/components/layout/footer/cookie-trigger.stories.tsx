import type { Meta, StoryObj } from '@storybook/react';
import CookieTrigger from './cookie-trigger';

const meta: Meta<typeof CookieTrigger> = {
  title: 'Layout/CookieTrigger',
  component: CookieTrigger,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A footer button that opens the cookie consent manager (Axeptio). Falls back to "Manage Cookies" if no title is provided.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof CookieTrigger>;

export const Default: Story = {};

export const WithCustomTitle: Story = {
  args: {
    title: 'Cookie preferences',
  },
};

export const WithDefaultTitle: Story = {
  args: {
    title: 'Manage cookies',
  },
};
