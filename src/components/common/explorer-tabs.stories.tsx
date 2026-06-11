import type { Meta, StoryObj } from '@storybook/react';
import { ExplorerTabs, ExplorerTab } from './explorer-tabs';
import React from 'react';

const meta: Meta<typeof ExplorerTabs> = {
  title: 'Content/ExplorerTabs',
  component: ExplorerTabs,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ExplorerTabs>;

export const Default: Story = {
  render: () => (
    <ExplorerTabs>
      <ExplorerTab value="overview" label="Overview">
        <h3>Overview</h3>
        <p>
          The Chat Completion API allows you to generate conversational responses
          using Mistral models. Send a list of messages and receive a model-generated
          response.
        </p>
      </ExplorerTab>
      <ExplorerTab value="parameters" label="Parameters">
        <h3>Parameters</h3>
        <ul>
          <li><strong>model</strong> — The model ID to use (e.g. &quot;mistral-large-latest&quot;)</li>
          <li><strong>messages</strong> — Array of message objects with role and content</li>
          <li><strong>temperature</strong> — Sampling temperature (0.0 to 1.0)</li>
          <li><strong>max_tokens</strong> — Maximum tokens to generate</li>
        </ul>
      </ExplorerTab>
      <ExplorerTab value="response" label="Response">
        <h3>Response</h3>
        <p>
          Returns a chat completion object containing the model&apos;s response,
          usage statistics, and metadata.
        </p>
      </ExplorerTab>
    </ExplorerTabs>
  ),
};

export const Nested: Story = {
  render: () => (
    <ExplorerTabs id="outer">
      <ExplorerTab value="models" label="Models">
        <h3>Available Models</h3>
        <ExplorerTabs>
          <ExplorerTab value="large" label="Mistral Large">
            <p>
              Our flagship model for complex reasoning, math, coding, and multilingual tasks.
              128k context window.
            </p>
          </ExplorerTab>
          <ExplorerTab value="small" label="Mistral Small">
            <p>
              Cost-effective model for simpler tasks. 32k context window.
              Great for classification, summarization, and simple Q&amp;A.
            </p>
          </ExplorerTab>
        </ExplorerTabs>
      </ExplorerTab>
      <ExplorerTab value="endpoints" label="Endpoints">
        <h3>API Endpoints</h3>
        <ul>
          <li><code>/v1/chat/completions</code> — Chat completion</li>
          <li><code>/v1/embeddings</code> — Text embeddings</li>
          <li><code>/v1/models</code> — List available models</li>
        </ul>
      </ExplorerTab>
    </ExplorerTabs>
  ),
};
