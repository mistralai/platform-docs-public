import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverTrigger, PopoverContent } from './popover';
import { Button } from './button';
import { Input } from './input';
import React from 'react';

const meta: Meta<typeof Popover> = {
  title: 'UI/Popover',
  component: Popover,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">API key settings</h4>
          <p className="text-sm text-muted-foreground">
            Configure rate limits and permissions for this key.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithForm: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Set token limit</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Token budget</h4>
            <p className="text-sm text-muted-foreground">
              Set the maximum number of tokens per request.
            </p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Max tokens</label>
            <Input type="number" placeholder="4096" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Temperature</label>
            <Input type="number" placeholder="0.7" step="0.1" min="0" max="2" />
          </div>
          <Button size="sm" className="w-full">
            Save settings
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const AlignStart: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Aligned start</Button>
      </PopoverTrigger>
      <PopoverContent align="start">
        <p className="text-sm text-muted-foreground">
          This popover is aligned to the start of the trigger.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

export const AlignEnd: Story = {
  render: () => (
    <div className="flex justify-end">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Aligned end</Button>
        </PopoverTrigger>
        <PopoverContent align="end">
          <p className="text-sm text-muted-foreground">
            This popover is aligned to the end of the trigger.
          </p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
