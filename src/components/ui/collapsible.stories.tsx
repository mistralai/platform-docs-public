import type { Meta, StoryObj } from '@storybook/react';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';
import { Button } from './button';
import { ChevronDownIcon } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof Collapsible> = {
  title: 'UI/Collapsible',
  component: Collapsible,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Collapsible>;

export const Default: Story = {
  render: () => (
    <Collapsible className="w-full max-w-sm">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between px-4">
          API key permissions
          <ChevronDownIcon className="size-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="px-4 pt-2 text-sm text-muted-foreground">
        This key has read and write access to the chat completions endpoint, embeddings
        endpoint, and model listing endpoint.
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const DefaultOpen: Story = {
  render: () => (
    <Collapsible defaultOpen className="w-full max-w-sm">
      <CollapsibleTrigger asChild>
        <Button variant="ghost" className="flex w-full justify-between px-4">
          Model parameters
          <ChevronDownIcon className="size-4" />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-2 px-4 pt-2 text-sm text-muted-foreground">
        <p><strong>temperature</strong> — controls randomness (0.0 to 1.0)</p>
        <p><strong>top_p</strong> — nucleus sampling threshold</p>
        <p><strong>max_tokens</strong> — maximum number of tokens to generate</p>
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const MultipleItems: Story = {
  render: () => (
    <div className="w-full max-w-sm space-y-1">
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between px-4">
            Chat completions
            <ChevronDownIcon className="size-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pt-2 pb-3 text-sm text-muted-foreground">
          Send a list of messages and receive a model-generated response.
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between px-4">
            Embeddings
            <ChevronDownIcon className="size-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pt-2 pb-3 text-sm text-muted-foreground">
          Generate vector embeddings for a given input text.
        </CollapsibleContent>
      </Collapsible>
      <Collapsible>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex w-full justify-between px-4">
            Function calling
            <ChevronDownIcon className="size-4" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="px-4 pt-2 pb-3 text-sm text-muted-foreground">
          Let the model call external functions by generating structured JSON output.
        </CollapsibleContent>
      </Collapsible>
    </div>
  ),
};
