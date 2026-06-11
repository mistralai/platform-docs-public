import type { Meta, StoryObj } from '@storybook/react';
import { HeaderCta } from './cta';
import React from 'react';

const meta: Meta<typeof HeaderCta> = {
  title: 'Layout/HeaderCta',
  component: HeaderCta,
  tags: ['autodocs'],
  args: {
    href: 'https://console.mistral.ai',
    children: 'Try Studio',
  },
  parameters: {
    docs: {
      description: {
        component:
          'A call-to-action button used in the header. Wraps the Button component with Next.js Link for navigation.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof HeaderCta>;

export const Default: Story = {};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <HeaderCta href="https://console.mistral.ai">
        Try Studio
      </HeaderCta>
      <HeaderCta href="https://console.mistral.ai" variant="secondary">
        Get API Key
      </HeaderCta>
      <HeaderCta href="https://console.mistral.ai" variant="outline">
        View Models
      </HeaderCta>
      <HeaderCta href="https://console.mistral.ai" variant="ghost">
        Documentation
      </HeaderCta>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <HeaderCta href="https://console.mistral.ai" size="sm">
        Deploy
      </HeaderCta>
      <HeaderCta href="https://console.mistral.ai" size="default">
        Deploy Model
      </HeaderCta>
      <HeaderCta href="https://console.mistral.ai" size="lg">
        Deploy to Production
      </HeaderCta>
    </div>
  ),
};

export const ExternalLink: Story = {
  args: {
    href: 'https://console.mistral.ai',
    target: '_blank',
    children: 'Open Mistral AI Studio',
  },
};
