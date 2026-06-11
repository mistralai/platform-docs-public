import type { Meta, StoryObj } from '@storybook/react';
import NoSidebarPageLayout from './no-sidebar-page-layout';
import React from 'react';

const meta: Meta<typeof NoSidebarPageLayout> = {
  title: 'Layout/NoSidebarPageLayout',
  component: NoSidebarPageLayout,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A centered, max-width layout for pages without a sidebar. Applies consistent vertical spacing between child sections. Use noSpacing to disable the default gap.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof NoSidebarPageLayout>;

export const Default: Story = {
  render: () => (
    <NoSidebarPageLayout>
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">API keys</h1>
        <p className="text-muted-foreground">
          Manage your API keys for authenticating requests to Mistral models.
          Each key is scoped to a Workspace and can be rotated independently.
        </p>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Create a new key</h2>
        <div className="p-4 rounded-lg border border-border bg-muted/30">
          <p className="text-sm text-muted-foreground">
            Navigate to Mistral AI Studio, open your Workspace settings, and select
            &quot;API keys&quot; to generate a new key.
          </p>
        </div>
      </section>
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Best practices</h2>
        <ul className="list-disc pl-6 space-y-1 text-muted-foreground">
          <li>Store keys in environment variables, never in source code.</li>
          <li>Rotate keys regularly and revoke unused ones.</li>
          <li>Use separate keys for development and production.</li>
        </ul>
      </section>
    </NoSidebarPageLayout>
  ),
};

export const NoSpacing: Story = {
  render: () => (
    <NoSidebarPageLayout noSpacing>
      <div className="p-4 border-b border-border">
        <h2 className="font-bold">Section one</h2>
        <p className="text-sm text-muted-foreground">No vertical spacing between sections.</p>
      </div>
      <div className="p-4 border-b border-border">
        <h2 className="font-bold">Section two</h2>
        <p className="text-sm text-muted-foreground">Content stacks directly.</p>
      </div>
      <div className="p-4">
        <h2 className="font-bold">Section three</h2>
        <p className="text-sm text-muted-foreground">Useful for custom spacing control.</p>
      </div>
    </NoSidebarPageLayout>
  ),
};

export const WithCustomClass: Story = {
  args: {
    className: 'border border-dashed border-border rounded-lg',
    children: (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Custom styled container</h2>
        <p className="text-muted-foreground">
          The className prop lets you add extra styles to the layout wrapper.
        </p>
      </div>
    ),
  },
};
