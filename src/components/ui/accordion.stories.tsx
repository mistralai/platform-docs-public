import type { Meta, StoryObj } from '@storybook/react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './accordion';
import React from 'react';

const meta: Meta<typeof Accordion> = {
  title: 'UI/Accordion',
  component: Accordion,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Accordion>;

export const Single: Story = {
  render: () => (
    <Accordion type="single" collapsible className="w-full max-w-lg">
      <AccordionItem value="item-1">
        <AccordionTrigger>What models does Mistral offer?</AccordionTrigger>
        <AccordionContent>
          Mistral offers a range of models including Mistral Large, Mistral Small,
          Codestral, and open-weight models like Mistral 7B and Mixtral 8x7B.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How is pricing calculated?</AccordionTrigger>
        <AccordionContent>
          Pricing is based on the number of tokens processed. Input and output tokens
          are priced separately, with rates varying by model.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What is the context window size?</AccordionTrigger>
        <AccordionContent>
          Context window sizes vary by model. Mistral Large supports up to 128k tokens,
          while smaller models support 32k tokens.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const Multiple: Story = {
  render: () => (
    <Accordion type="multiple" className="w-full max-w-lg">
      <AccordionItem value="item-1">
        <AccordionTrigger>Does Mistral support function calling?</AccordionTrigger>
        <AccordionContent>
          Yes, Mistral Large and Mistral Small support function calling, allowing
          models to generate structured JSON for API integrations.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Can I fine-tune Mistral models?</AccordionTrigger>
        <AccordionContent>
          Yes, fine-tuning is available through the Mistral platform. You can
          customize models with your own data for improved performance.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>What languages are supported?</AccordionTrigger>
        <AccordionContent>
          Mistral models are multilingual. Mistral Large supports English, French,
          Spanish, German, Italian, Portuguese, Dutch, Russian, Chinese, Japanese, and Korean.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <Accordion type="single" collapsible defaultValue="item-1" className="w-full max-w-lg">
      <AccordionItem value="item-1">
        <AccordionTrigger>What is the rate limit?</AccordionTrigger>
        <AccordionContent>
          Rate limits depend on your account tier. Free tier allows 5 requests per
          second, while paid tiers offer higher limits. Contact support for enterprise rates.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I get an API key?</AccordionTrigger>
        <AccordionContent>
          Sign up at console.mistral.ai, navigate to API Keys, and create a new key.
          Store it securely — it will only be shown once.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
};
