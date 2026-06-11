import type { Meta, StoryObj } from '@storybook/react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from './hover-card';
import React from 'react';

const meta: Meta<typeof HoverCard> = {
  title: 'UI/HoverCard',
  component: HoverCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer text-sm font-medium underline underline-offset-4">
          Mistral Large
        </span>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Mistral Large</h4>
          <p className="text-sm text-muted-foreground">
            Our most capable model for complex reasoning, code generation, and
            multilingual tasks. Supports up to 128k tokens of context.
          </p>
          <p className="text-xs text-muted-foreground">
            Endpoint: mistral-large-latest
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};

export const ModelComparison: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className="cursor-pointer text-sm font-medium underline underline-offset-4">
            Mistral Large
          </span>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Mistral Large</h4>
            <p className="text-sm text-muted-foreground">
              Best for complex reasoning, function calling, and multilingual
              tasks. 128k context window.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className="cursor-pointer text-sm font-medium underline underline-offset-4">
            Mistral Small
          </span>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Mistral Small</h4>
            <p className="text-sm text-muted-foreground">
              Optimized for low-latency workloads. Ideal for classification,
              summarization, and simple generation. 32k context window.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
      <HoverCard>
        <HoverCardTrigger asChild>
          <span className="cursor-pointer text-sm font-medium underline underline-offset-4">
            Devstral
          </span>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Devstral</h4>
            <p className="text-sm text-muted-foreground">
              Specialized for code generation, debugging, and software
              engineering workflows.
            </p>
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  ),
};

export const AlignStart: Story = {
  render: () => (
    <HoverCard>
      <HoverCardTrigger asChild>
        <span className="cursor-pointer text-sm font-medium underline underline-offset-4">
          API key permissions
        </span>
      </HoverCardTrigger>
      <HoverCardContent align="start">
        <div className="space-y-2">
          <h4 className="text-sm font-semibold">API key permissions</h4>
          <p className="text-sm text-muted-foreground">
            Each API key can be scoped to specific endpoints. You can restrict
            keys to read-only access or allow full management of your Workspace.
          </p>
        </div>
      </HoverCardContent>
    </HoverCard>
  ),
};
