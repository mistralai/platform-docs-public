import type { Meta, StoryObj } from '@storybook/react';
import { Admonition } from './admonition';
import React from 'react';

const meta: Meta<typeof Admonition> = {
  title: 'Content/Admonition',
  component: Admonition,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Admonition>;

export const AllTypes: Story = {
  render: () => (
    <div className="space-y-4 max-w-2xl">
      <Admonition type="info">
        <p>The chat completion API supports streaming responses for real-time output.</p>
      </Admonition>
      <Admonition type="note">
        <p>API keys should be stored securely and never exposed in client-side code.</p>
      </Admonition>
      <Admonition type="tip">
        <p>Use function calling to integrate Mistral models with your existing APIs.</p>
      </Admonition>
      <Admonition type="caution">
        <p>Rate limit: 5 requests per second on the free tier. Upgrade for higher limits.</p>
      </Admonition>
      <Admonition type="warning">
        <p>Deprecated: the v0 API endpoints will be removed on March 1, 2025.</p>
      </Admonition>
      <Admonition type="danger">
        <p>Never commit API keys to version control. Use environment variables instead.</p>
      </Admonition>
      <Admonition type="success">
        <p>New: Vision support is now available for Mistral Large.</p>
      </Admonition>
    </div>
  ),
};

export const WithTitle: Story = {
  args: {
    type: 'info',
    title: 'Model Update',
    children: <p>Mistral Large has been updated with improved reasoning capabilities and extended context window support.</p>,
  },
};

export const Collapsible: Story = {
  args: {
    type: 'tip',
    title: 'Advanced Configuration',
    collapsible: true,
    children: (
      <p>
        You can configure temperature, top_p, and max_tokens parameters to control
        the model output. Lower temperature values produce more deterministic results.
      </p>
    ),
  },
};

export const CollapsibleOpen: Story = {
  args: {
    type: 'caution',
    title: 'Breaking Changes',
    collapsible: true,
    open: true,
    children: (
      <p>
        The response format has changed in v2. The &quot;choices&quot; array now includes
        a &quot;finish_reason&quot; field. Update your parsing logic accordingly.
      </p>
    ),
  },
};
