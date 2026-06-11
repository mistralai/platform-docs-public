import type { Meta, StoryObj } from '@storybook/react';
import { Root, Trigger, Target, useLinkedHoverSafeArea } from './linked-hover-safe-area';
import React from 'react';

const meta: Meta<typeof Root> = {
  title: 'UI/LinkedHoverSafeArea',
  component: Root,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Root>;

const TargetContent = () => {
  const { isHovered } = useLinkedHoverSafeArea();

  if (!isHovered) return null;

  return (
    <Target>
      <div className="absolute top-full left-0 mt-2 w-64 rounded-md border bg-popover p-4 shadow-md">
        <p className="text-sm font-medium">Mistral Large</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Our most capable model with 128k token context window. Supports
          function calling, JSON mode, and multilingual tasks.
        </p>
      </div>
    </Target>
  );
};

export const Default: Story = {
  render: () => (
    <div className="relative p-8">
      <Root hoverDelayEnter={200} hoverDelayLeave={150}>
        <Trigger>
          <button className="inline-flex items-center rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent transition-colors">
            Hover for model details
          </button>
        </Trigger>
        <TargetContent />
      </Root>
    </div>
  ),
};

const DropdownTarget = () => {
  const { isHovered } = useLinkedHoverSafeArea();

  if (!isHovered) return null;

  return (
    <Target>
      <div className="absolute top-full left-0 mt-2 w-48 rounded-md border bg-popover shadow-md">
        <ul className="py-1">
          <li className="px-4 py-2 text-sm hover:bg-accent cursor-pointer">Mistral Large</li>
          <li className="px-4 py-2 text-sm hover:bg-accent cursor-pointer">Mistral Small</li>
          <li className="px-4 py-2 text-sm hover:bg-accent cursor-pointer">Devstral</li>
          <li className="px-4 py-2 text-sm hover:bg-accent cursor-pointer">Codestral</li>
        </ul>
      </div>
    </Target>
  );
};

export const MenuDropdown: Story = {
  render: () => (
    <div className="relative p-8">
      <Root hoverDelayEnter={100} hoverDelayLeave={200}>
        <Trigger>
          <button className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
            Models
          </button>
        </Trigger>
        <DropdownTarget />
      </Root>
    </div>
  ),
};

export const CustomDelays: Story = {
  render: () => (
    <div className="flex gap-8 p-8">
      <div className="relative">
        <Root hoverDelayEnter={0} hoverDelayLeave={50}>
          <Trigger>
            <button className="rounded-md border px-4 py-2 text-sm">
              Fast (0ms enter)
            </button>
          </Trigger>
          <TargetContent />
        </Root>
      </div>
      <div className="relative">
        <Root hoverDelayEnter={500} hoverDelayLeave={300}>
          <Trigger>
            <button className="rounded-md border px-4 py-2 text-sm">
              Slow (500ms enter)
            </button>
          </Trigger>
          <TargetContent />
        </Root>
      </div>
    </div>
  ),
};

const CardTarget = () => {
  const { isHovered } = useLinkedHoverSafeArea();

  if (!isHovered) return null;

  return (
    <Target>
      <div className="absolute top-full right-0 mt-2 w-80 rounded-lg border bg-popover p-5 shadow-lg">
        <div className="mb-3 flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">ML</span>
          </div>
          <div>
            <p className="text-sm font-semibold">Mistral Large</p>
            <p className="text-xs text-muted-foreground">mistral-large-latest</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div>Context: 128k tokens</div>
          <div>Max output: 4k tokens</div>
          <div>Languages: 11+</div>
          <div>Function calling: Yes</div>
        </div>
      </div>
    </Target>
  );
};

export const RichContent: Story = {
  render: () => (
    <div className="relative flex justify-end p-8">
      <Root>
        <Trigger>
          <span className="cursor-pointer text-sm text-primary underline underline-offset-4">
            mistral-large-latest
          </span>
        </Trigger>
        <CardTarget />
      </Root>
    </div>
  ),
};
