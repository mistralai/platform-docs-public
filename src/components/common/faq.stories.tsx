import type { Meta, StoryObj } from '@storybook/react';
import { Faq, FaqItem } from './faq';
import React from 'react';

const meta: Meta<typeof Faq> = {
  title: 'Content/FAQ',
  component: Faq,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Faq>;

export const Default: Story = {
  render: () => (
    <Faq type="multiple" className="max-w-2xl">
      <FaqItem question="What models are available?">
        <p>
          Mistral offers several models: Mistral Large for complex reasoning, Mistral Small
          for cost-effective tasks, Codestral for code generation, and Mistral Embed for
          text embeddings.
        </p>
      </FaqItem>
      <FaqItem question="How is pricing calculated?">
        <p>
          Pricing is based on token usage. Input and output tokens are priced separately,
          with rates varying by model. Check the pricing page for current rates.
        </p>
      </FaqItem>
      <FaqItem question="What is the maximum context window?">
        <p>
          Context window sizes vary: Mistral Large supports 128k tokens, while smaller
          models support 32k tokens. The context window includes both input and output tokens.
        </p>
      </FaqItem>
    </Faq>
  ),
};

export const MultipleOpen: Story = {
  render: () => (
    <Faq type="multiple" className="max-w-2xl" defaultValue={['what-models-are-available', 'how-is-pricing-calculated']}>
      <FaqItem question="What models are available?">
        <p>
          Mistral offers Mistral Large, Mistral Small, Codestral, and open-weight models
          like Mistral 7B and Mixtral 8x7B.
        </p>
      </FaqItem>
      <FaqItem question="How is pricing calculated?">
        <p>
          Pricing is based on the number of tokens processed. Input and output tokens
          are priced separately.
        </p>
      </FaqItem>
      <FaqItem question="Do you offer enterprise plans?">
        <p>
          Yes, enterprise plans with custom rate limits, dedicated support, and SLAs
          are available. Contact our sales team for details.
        </p>
      </FaqItem>
    </Faq>
  ),
};
