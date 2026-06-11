import type { Meta, StoryObj } from '@storybook/react';
import { LinkCard, UsefullLinkContainer } from './link-card';
import { PageIcon, KeyIcon, ChatIcon, StatsIcon } from '@/components/icons/pixel';
import React from 'react';

const meta: Meta<typeof LinkCard> = {
  title: 'Content/LinkCard',
  component: LinkCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof LinkCard>;

export const Default: Story = {
  args: {
    title: 'Getting Started',
    href: '/docs/getting-started',
    icon: <PageIcon className="size-5" />,
  },
};

export const WithContainer: Story = {
  render: () => (
    <UsefullLinkContainer>
      <LinkCard
        title="Getting Started"
        href="/docs/getting-started"
        icon={<PageIcon className="size-5" />}
      />
      <LinkCard
        title="API Reference"
        href="/api"
        icon={<KeyIcon className="size-5" />}
      />
      <LinkCard
        title="Models"
        href="/docs/models"
        icon={<ChatIcon className="size-5" />}
      />
      <LinkCard
        title="Capabilities"
        href="/docs/capabilities"
        icon={<StatsIcon className="size-5" />}
      />
    </UsefullLinkContainer>
  ),
};
