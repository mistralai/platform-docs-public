import type { Meta, StoryObj } from '@storybook/react';
import { SectionWrapper, Section } from './mdx-section';
import React from 'react';

const meta: Meta<typeof SectionWrapper> = {
  title: 'Layout/MdxSection',
  component: SectionWrapper,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Layout primitives for MDX content sections. SectionWrapper provides a tall container with spacing between sections. Section wraps individual content blocks with consistent bottom margins.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof SectionWrapper>;

export const Default: Story = {
  render: () => (
    <SectionWrapper>
      <Section>
        <div className="p-6 border border-border rounded-lg bg-muted/30">
          <h2 className="text-lg font-bold mb-2">Getting started</h2>
          <p className="text-muted-foreground">
            Set up your environment, grab an API key, and make your first request to Mistral Large.
          </p>
        </div>
      </Section>
      <Section>
        <div className="p-6 border border-border rounded-lg bg-muted/30">
          <h2 className="text-lg font-bold mb-2">Chat completions</h2>
          <p className="text-muted-foreground">
            Send messages and receive model-generated responses using the chat completions endpoint.
          </p>
        </div>
      </Section>
      <Section>
        <div className="p-6 border border-border rounded-lg bg-muted/30">
          <h2 className="text-lg font-bold mb-2">Function calling</h2>
          <p className="text-muted-foreground">
            Connect your models to external tools and APIs with structured function calls.
          </p>
        </div>
      </Section>
    </SectionWrapper>
  ),
};

export const SingleSection: Story = {
  render: () => (
    <SectionWrapper>
      <Section>
        <div className="p-6 border border-border rounded-lg bg-muted/30">
          <h2 className="text-lg font-bold mb-2">Model deployment</h2>
          <p className="text-muted-foreground">
            Deploy Mistral models to your own infrastructure or use our managed endpoints.
          </p>
        </div>
      </Section>
    </SectionWrapper>
  ),
};
