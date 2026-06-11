import type { Meta, StoryObj } from '@storybook/react';
import { TableOfContents } from './table-of-contents';
import React from 'react';

const meta: Meta<typeof TableOfContents> = {
  title: 'UI/TableOfContents',
  component: TableOfContents,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/docs/getting-started',
      },
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="flex gap-8">
        <div className="flex-1">
          <div className="space-y-16">
            <section>
              <h2 id="overview">Overview</h2>
              <p className="text-sm text-muted-foreground">
                This page covers how to get started with the Mistral API.
              </p>
            </section>
            <section>
              <h2 id="authentication">Authentication</h2>
              <p className="text-sm text-muted-foreground">
                All API requests require an API key passed via the Authorization header.
              </p>
              <h3 id="creating-api-keys">Creating API keys</h3>
              <p className="text-sm text-muted-foreground">
                Navigate to the Mistral AI Studio and create a new API key.
              </p>
              <h3 id="key-management">Key management</h3>
              <p className="text-sm text-muted-foreground">
                You can rotate, disable, or delete API keys from your Workspace settings.
              </p>
            </section>
            <section>
              <h2 id="making-requests">Making requests</h2>
              <p className="text-sm text-muted-foreground">
                Send a POST request to the chat completions endpoint.
              </p>
              <h3 id="request-format">Request format</h3>
              <p className="text-sm text-muted-foreground">
                The request body includes model, messages, and optional parameters.
              </p>
              <h3 id="response-format">Response format</h3>
              <p className="text-sm text-muted-foreground">
                Responses include the model output, token usage, and metadata.
              </p>
            </section>
            <section>
              <h2 id="error-handling">Error handling</h2>
              <p className="text-sm text-muted-foreground">
                The API returns standard HTTP status codes and JSON error bodies.
              </p>
            </section>
            <section>
              <h2 id="rate-limits">Rate limits</h2>
              <p className="text-sm text-muted-foreground">
                Rate limits depend on your account tier and the model you use.
              </p>
            </section>
          </div>
        </div>
        <div className="w-64 shrink-0">
          <Story />
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TableOfContents>;

export const Default: Story = {
  args: {
    tocItems: [
      { id: 'overview', value: 'Overview', depth: 2 },
      { id: 'authentication', value: 'Authentication', depth: 2 },
      { id: 'creating-api-keys', value: 'Creating API keys', depth: 3 },
      { id: 'key-management', value: 'Key management', depth: 3 },
      { id: 'making-requests', value: 'Making requests', depth: 2 },
      { id: 'request-format', value: 'Request format', depth: 3 },
      { id: 'response-format', value: 'Response format', depth: 3 },
      { id: 'error-handling', value: 'Error handling', depth: 2 },
      { id: 'rate-limits', value: 'Rate limits', depth: 2 },
    ],
  },
};

export const ShallowDepth: Story = {
  args: {
    tocItems: [
      { id: 'overview', value: 'Overview', depth: 2 },
      { id: 'authentication', value: 'Authentication', depth: 2 },
      { id: 'creating-api-keys', value: 'Creating API keys', depth: 3 },
      { id: 'key-management', value: 'Key management', depth: 3 },
      { id: 'making-requests', value: 'Making requests', depth: 2 },
      { id: 'request-format', value: 'Request format', depth: 3 },
      { id: 'response-format', value: 'Response format', depth: 3 },
      { id: 'error-handling', value: 'Error handling', depth: 2 },
      { id: 'rate-limits', value: 'Rate limits', depth: 2 },
    ],
    maxDepth: 2,
    title: 'On this page',
  },
};

export const WithTimeline: Story = {
  args: {
    timelineData: [
      {
        year: '2025',
        months: [
          { month: 'March', href: '#march-2025' },
          { month: 'February', href: '#february-2025' },
          { month: 'January', href: '#january-2025' },
        ],
      },
      {
        year: '2024',
        months: [
          { month: 'December', href: '#december-2024' },
          { month: 'November', href: '#november-2024' },
          { month: 'October', href: '#october-2024' },
          { month: 'September', href: '#september-2024' },
        ],
      },
      {
        year: '2023',
        months: [
          { month: 'December', href: '#december-2023' },
          { month: 'September', href: '#september-2023' },
        ],
      },
    ],
    title: 'YEAR',
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export const WithFilters: Story = {
  args: {
    timelineData: [
      {
        year: '2025',
        months: [
          { month: 'March', href: '#march-2025' },
          { month: 'February', href: '#february-2025' },
        ],
      },
      {
        year: '2024',
        months: [
          { month: 'December', href: '#december-2024' },
          { month: 'November', href: '#november-2024' },
        ],
      },
    ],
    title: 'YEAR',
    filters: ['model', 'api', 'other', 'security'],
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export const NoBackToTop: Story = {
  args: {
    tocItems: [
      { id: 'overview', value: 'Overview', depth: 2 },
      { id: 'models', value: 'Models', depth: 2 },
      { id: 'endpoints', value: 'Endpoints', depth: 2 },
      { id: 'sdks', value: 'SDKs', depth: 2 },
    ],
    showBackToTop: false,
    title: 'Sections',
  },
};

export const CustomTitle: Story = {
  args: {
    tocItems: [
      { id: 'mistral-large', value: 'Mistral Large', depth: 2 },
      { id: 'mistral-small', value: 'Mistral Small', depth: 2 },
      { id: 'devstral', value: 'Devstral', depth: 2 },
      { id: 'codestral', value: 'Codestral', depth: 2 },
      { id: 'open-weights', value: 'Open-weight models', depth: 2 },
      { id: 'mistral-7b', value: 'Mistral 7B', depth: 3 },
      { id: 'mixtral-8x7b', value: 'Mixtral 8x7B', depth: 3 },
    ],
    title: 'Available models',
  },
};
