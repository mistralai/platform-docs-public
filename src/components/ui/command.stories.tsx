import type { Meta, StoryObj } from '@storybook/react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
  CommandDialog,
} from './command';
import { Button } from './button';
import React from 'react';

const meta: Meta<typeof Command> = {
  title: 'UI/Command',
  component: Command,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Command>;

export const Default: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md max-w-md">
      <CommandInput placeholder="Search models, endpoints, settings..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Models">
          <CommandItem>Mistral Large</CommandItem>
          <CommandItem>Mistral Small</CommandItem>
          <CommandItem>Devstral</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>
            Create API key
            <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
          <CommandItem>
            View usage dashboard
            <CommandShortcut>⌘U</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Open Workspace settings
            <CommandShortcut>⌘,</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md max-w-md">
      <CommandInput placeholder="Search documentation..." />
      <CommandList>
        <CommandEmpty>No matching pages.</CommandEmpty>
        <CommandGroup heading="Getting started">
          <CommandItem>Quickstart guide</CommandItem>
          <CommandItem>Authentication</CommandItem>
          <CommandItem>Rate limits</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="API reference">
          <CommandItem>Chat completions</CommandItem>
          <CommandItem>Embeddings</CommandItem>
          <CommandItem>Function calling</CommandItem>
          <CommandItem>JSON mode</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Features">
          <CommandItem>Agents</CommandItem>
          <CommandItem>Connectors</CommandItem>
          <CommandItem>Libraries</CommandItem>
          <CommandItem>Canvas</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const WithShortcuts: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md max-w-md">
      <CommandInput placeholder="Type a command..." />
      <CommandList>
        <CommandEmpty>No commands found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem>
            Go to dashboard
            <CommandShortcut>⌘D</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Go to API keys
            <CommandShortcut>⌘K</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Go to billing
            <CommandShortcut>⌘B</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem>
            Create new Agent
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Deploy model
            <CommandShortcut>⌘⇧D</CommandShortcut>
          </CommandItem>
          <CommandItem>
            Open documentation
            <CommandShortcut>⌘⇧H</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

export const DialogVariant: Story = {
  render: () => {
    const [open, setOpen] = React.useState(false);

    return (
      <>
        <Button variant="outline" onClick={() => setOpen(true)}>
          Open command palette
        </Button>
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput placeholder="Search models, actions, settings..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Models">
              <CommandItem>Mistral Large</CommandItem>
              <CommandItem>Mistral Small</CommandItem>
              <CommandItem>Devstral</CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Quick actions">
              <CommandItem>
                Create API key
                <CommandShortcut>⌘K</CommandShortcut>
              </CommandItem>
              <CommandItem>
                View token usage
                <CommandShortcut>⌘U</CommandShortcut>
              </CommandItem>
              <CommandItem>
                Workspace settings
                <CommandShortcut>⌘,</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </>
    );
  },
};

export const EmptyState: Story = {
  render: () => (
    <Command className="rounded-lg border shadow-md max-w-md">
      <CommandInput placeholder="Search..." value="nonexistent-model-xyz" />
      <CommandList>
        <CommandEmpty>
          No results found. Try searching for a model name or feature.
        </CommandEmpty>
        <CommandGroup heading="Models">
          <CommandItem>Mistral Large</CommandItem>
          <CommandItem>Mistral Small</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
