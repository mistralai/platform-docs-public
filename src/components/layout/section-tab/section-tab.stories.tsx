import type { Meta, StoryObj } from '@storybook/react';
import { SectionTab } from './index';
import React from 'react';

const meta: Meta<typeof SectionTab> = {
  title: 'Layout/SectionTab',
  component: SectionTab,
  tags: ['autodocs'],
  args: {
    children: 'Chat completions',
  },
  parameters: {
    docs: {
      description: {
        component:
          'A styled section heading tab with an optional copy-link button. Used to label and anchor content sections in documentation pages. Supports default and secondary color variants, configurable heading levels, and an optional page icon.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SectionTab>;

export const Default: Story = {};

export const WithSectionId: Story = {
  args: {
    children: 'Authentication',
    sectionId: 'authentication',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <SectionTab variant="default" sectionId="models">
        Available models
      </SectionTab>
      <div className="p-4 text-sm text-muted-foreground">
        Content for the default variant section.
      </div>
      <SectionTab variant="secondary" sectionId="endpoints">
        API endpoints
      </SectionTab>
      <div className="p-4 text-sm text-muted-foreground">
        Content for the secondary variant section.
      </div>
    </div>
  ),
};

export const WithoutIcon: Story = {
  args: {
    children: 'Rate limits',
    showIcon: false,
    sectionId: 'rate-limits',
  },
};

export const HeadingLevels: Story = {
  render: () => (
    <div className="space-y-6 max-w-2xl">
      <SectionTab as="h2" sectionId="h2-section">
        H2 — Getting started
      </SectionTab>
      <SectionTab as="h3" sectionId="h3-section">
        H3 — Configuration
      </SectionTab>
      <SectionTab as="h4" sectionId="h4-section">
        H4 — Advanced options
      </SectionTab>
    </div>
  ),
};

export const LongTitle: Story = {
  args: {
    children: 'Configuring fine-tuning parameters for Mistral Large with custom datasets',
    sectionId: 'long-title',
  },
};
