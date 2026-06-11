import type { Meta, StoryObj } from '@storybook/react';
import { ScrollGradient } from './scroll-gradient';
import React from 'react';

const meta: Meta<typeof ScrollGradient> = {
  title: 'Common/ScrollGradient',
  component: ScrollGradient,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Container that adds gradient fade indicators at the edges when content overflows. Supports both horizontal and vertical scroll directions.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof ScrollGradient>;

export const VerticalScroll: Story = {
  render: () => (
    <ScrollGradient direction="y" className="h-48 w-80 border border-border rounded-md">
      <div className="p-4 space-y-4">
        <h3 className="font-semibold">Available models</h3>
        <p className="text-sm text-muted-foreground">Mistral Large -- our most capable model for complex reasoning and analysis tasks.</p>
        <p className="text-sm text-muted-foreground">Mistral Small -- a fast, cost-effective model ideal for simple tasks and high-throughput workloads.</p>
        <p className="text-sm text-muted-foreground">Devstral -- optimized for code generation, code review, and software engineering tasks.</p>
        <p className="text-sm text-muted-foreground">Mistral Embed -- creates vector representations of text for search and retrieval applications.</p>
        <p className="text-sm text-muted-foreground">Codestral Mamba -- a code model using the Mamba architecture for efficient long-context handling.</p>
        <p className="text-sm text-muted-foreground">Mistral Medium -- balanced model offering a good trade-off between quality and latency.</p>
        <p className="text-sm text-muted-foreground">Pixtral Large -- multimodal model with vision capabilities for image understanding.</p>
      </div>
    </ScrollGradient>
  ),
};

export const HorizontalScroll: Story = {
  render: () => (
    <ScrollGradient direction="x" className="w-80 border border-border rounded-md">
      <div className="flex gap-4 p-4 w-max">
        {[
          'mistral-large-latest',
          'mistral-small-latest',
          'devstral-small-latest',
          'mistral-embed',
          'codestral-mamba-latest',
          'pixtral-large-latest',
        ].map((model) => (
          <div
            key={model}
            className="flex-shrink-0 px-3 py-2 bg-secondary rounded-md text-sm font-mono"
          >
            {model}
          </div>
        ))}
      </div>
    </ScrollGradient>
  ),
};

export const CustomGradientSize: Story = {
  render: () => (
    <ScrollGradient
      direction="y"
      gradientSize={80}
      className="h-40 w-80 border border-border rounded-md"
    >
      <div className="p-4 space-y-3">
        <p className="text-sm">Line 1: Configure your API key in environment variables.</p>
        <p className="text-sm">Line 2: Set the model parameter to your preferred model.</p>
        <p className="text-sm">Line 3: Adjust temperature for response variability.</p>
        <p className="text-sm">Line 4: Use max_tokens to control response length.</p>
        <p className="text-sm">Line 5: Enable streaming for real-time output.</p>
        <p className="text-sm">Line 6: Add system prompts to guide model behavior.</p>
        <p className="text-sm">Line 7: Implement error handling for rate limits.</p>
        <p className="text-sm">Line 8: Use JSON mode for structured responses.</p>
        <p className="text-sm">Line 9: Enable function calling for tool use.</p>
        <p className="text-sm">Line 10: Monitor token usage via response metadata.</p>
      </div>
    </ScrollGradient>
  ),
};

export const NoOverflow: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'When content fits within the container, no gradient indicators are shown.',
      },
    },
  },
  render: () => (
    <ScrollGradient direction="y" className="h-48 w-80 border border-border rounded-md">
      <div className="p-4">
        <p className="text-sm text-muted-foreground">
          This content fits within the container, so no scroll gradients appear.
        </p>
      </div>
    </ScrollGradient>
  ),
};
