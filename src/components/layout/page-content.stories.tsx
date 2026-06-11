import type { Meta, StoryObj } from '@storybook/react';
import PageContent from './page-content';
import React from 'react';

const meta: Meta<typeof PageContent> = {
  title: 'Layout/PageContent',
  component: PageContent,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Main page content container with a background, rounded borders, and an integrated BackGradient overlay. Supports rendering as a div or main element, with a special "isRoot" mode for top-level layouts.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof PageContent>;

export const Default: Story = {
  render: () => (
    <PageContent>
      <div className="p-8 max-w-2xl mx-auto space-y-4">
        <h1 className="text-2xl font-bold">Mistral AI documentation</h1>
        <p className="text-muted-foreground">
          Build AI-powered applications with our models. This page content container provides the
          standard layout wrapper with background styling and a scroll gradient.
        </p>
        <div className="p-4 rounded-md bg-muted border border-border">
          <code className="text-sm font-mono">POST /v1/chat/completions</code>
        </div>
      </div>
    </PageContent>
  ),
};

export const AsMain: Story = {
  render: () => (
    <PageContent as="main">
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold">Rendered as &lt;main&gt;</h1>
        <p className="text-muted-foreground mt-2">
          Use <code className="bg-muted px-1 rounded">as=&quot;main&quot;</code> for semantic
          HTML when this is the primary content area.
        </p>
      </div>
    </PageContent>
  ),
};

export const IsRoot: Story = {
  render: () => (
    <PageContent isRoot>
      <div className="p-8 max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold">Root layout mode</h1>
        <p className="text-muted-foreground mt-2">
          When <code className="bg-muted px-1 rounded">isRoot</code> is true, the container uses
          <code className="bg-muted px-1 rounded">lg:contents</code> to dissolve its box at larger
          breakpoints.
        </p>
      </div>
    </PageContent>
  ),
};

export const WithCustomClass: Story = {
  args: {
    className: 'bg-muted/50',
    children: (
      <div className="p-8">
        <p>Custom background applied via className prop.</p>
      </div>
    ),
  },
};
