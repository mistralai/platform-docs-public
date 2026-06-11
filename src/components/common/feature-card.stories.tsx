import type { Meta, StoryObj } from '@storybook/react';
import { FeatureCard } from './feature-card';
import { ChatIcon, KeyIcon, StatsIcon, FireIcon } from '@/components/icons/pixel';
import React from 'react';

const meta: Meta<typeof FeatureCard> = {
  title: 'Content/FeatureCard',
  component: FeatureCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FeatureCard>;

export const Default: Story = {
  args: {
    title: 'Chat Completion',
    description: 'Generate conversational responses with Mistral models',
    icon: ChatIcon,
  },
};

export const Outline: Story = {
  args: {
    title: 'Embeddings',
    description: 'Create vector representations of text for search and retrieval',
    icon: StatsIcon,
    variant: 'outline',
  },
};

export const Ghost: Story = {
  args: {
    title: 'Fine-tuning',
    description: 'Customize models with your own data',
    icon: FireIcon,
    variant: 'ghost',
  },
};

export const Interactive: Story = {
  args: {
    title: 'API Keys',
    description: 'Manage your API keys and access tokens',
    icon: KeyIcon,
    interactive: true,
  },
};

export const Grid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
      <FeatureCard
        title="Chat Completion"
        description="Generate conversational responses"
        icon={ChatIcon}
        variant="outline"
      />
      <FeatureCard
        title="Embeddings"
        description="Vector representations of text"
        icon={StatsIcon}
        variant="outline"
      />
      <FeatureCard
        title="Fine-tuning"
        description="Customize models with your data"
        icon={FireIcon}
        variant="outline"
      />
      <FeatureCard
        title="API Keys"
        description="Manage access tokens"
        icon={KeyIcon}
        variant="outline"
      />
    </div>
  ),
};
