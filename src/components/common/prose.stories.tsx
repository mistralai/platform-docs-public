import type { Meta, StoryObj } from '@storybook/react';
import { Prose } from './prose';
import React from 'react';

const meta: Meta<typeof Prose> = {
  title: 'Content/Prose',
  component: Prose,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Prose wrapper that applies consistent typographic styles to rendered markdown content. Handles headings, blockquotes, code, details, and horizontal rules.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Prose>;

export const Default: Story = {
  render: () => (
    <Prose className="max-w-2xl">
      <h1>Getting started with the Mistral API</h1>
      <p>
        The Mistral API gives you access to our latest models for chat
        completion, embeddings, and more. This guide walks you through your
        first API call.
      </p>
      <h2>Prerequisites</h2>
      <p>
        Before you begin, make sure you have an API key. You can create one
        from the <a href="#">Mistral AI Studio</a> console.
      </p>
      <h3>Authentication</h3>
      <p>
        All API requests require a valid API key passed in the{' '}
        <code>Authorization</code> header as a bearer token.
      </p>
      <blockquote>
        <p>
          Store your API keys securely and never expose them in client-side
          code.
        </p>
      </blockquote>
      <hr />
      <h2>Making your first request</h2>
      <p>
        Send a POST request to the <code>/v1/chat/completions</code> endpoint
        with a model ID and an array of messages. The response includes the
        model's completion along with token usage metadata.
      </p>
    </Prose>
  ),
};

export const WithCode: Story = {
  render: () => (
    <Prose className="max-w-2xl">
      <h2>Code examples</h2>
      <p>
        Use the <code>model</code> parameter to specify which Mistral model to
        call. For example, <code>mistral-large-latest</code> targets the most
        recent Mistral Large version.
      </p>
      <pre>
        <code>{`curl https://api.mistral.ai/v1/chat/completions \\
  -H "Authorization: Bearer $MISTRAL_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "mistral-large-latest",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'`}</code>
      </pre>
    </Prose>
  ),
};

export const WithDetails: Story = {
  render: () => (
    <Prose className="max-w-2xl">
      <h2>Frequently asked questions</h2>
      <details>
        <summary>What models are available?</summary>
        <p>
          We offer Mistral Large for complex reasoning, Mistral Small for
          cost-effective tasks, and Devstral for code generation. Check the
          models page for the full list.
        </p>
      </details>
      <details>
        <summary>How do I handle rate limits?</summary>
        <p>
          If you exceed your rate limit, the API returns a 429 status code.
          Implement exponential backoff in your retry logic to handle this
          gracefully.
        </p>
      </details>
    </Prose>
  ),
};
