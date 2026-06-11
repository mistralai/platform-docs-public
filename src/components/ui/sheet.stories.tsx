import type { Meta, StoryObj } from '@storybook/react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from './sheet';
import { Button } from './button';
import { Input } from './input';
import React from 'react';

const meta: Meta<typeof Sheet> = {
  title: 'UI/Sheet',
  component: Sheet,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Sheet>;

export const Default: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open sheet</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>API key details</SheetTitle>
          <SheetDescription>
            View and manage the settings for this API key.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Key name</label>
            <Input defaultValue="Production Backend" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Created</label>
            <p className="text-sm text-muted-foreground">March 15, 2026</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Last used</label>
            <p className="text-sm text-muted-foreground">2 hours ago</p>
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button>Save changes</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const LeftSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open left sheet</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>
            Browse Mistral AI documentation sections.
          </SheetDescription>
        </SheetHeader>
        <nav className="space-y-2 px-4">
          <p className="text-sm font-medium">Getting started</p>
          <p className="text-sm text-muted-foreground pl-4">Quickstart</p>
          <p className="text-sm text-muted-foreground pl-4">Authentication</p>
          <p className="text-sm font-medium mt-4">Models</p>
          <p className="text-sm text-muted-foreground pl-4">Mistral Large</p>
          <p className="text-sm text-muted-foreground pl-4">Mistral Small</p>
          <p className="text-sm text-muted-foreground pl-4">Devstral</p>
          <p className="text-sm font-medium mt-4">API reference</p>
          <p className="text-sm text-muted-foreground pl-4">Chat completions</p>
          <p className="text-sm text-muted-foreground pl-4">Embeddings</p>
        </nav>
      </SheetContent>
    </Sheet>
  ),
};

export const TopSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open top sheet</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>System announcement</SheetTitle>
          <SheetDescription>
            Scheduled maintenance on March 25, 2026 from 02:00 to 04:00 UTC.
            API endpoints may experience brief interruptions.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  ),
};

export const BottomSide: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open bottom sheet</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Rate limit exceeded</SheetTitle>
          <SheetDescription>
            You've reached 95% of your token budget for this billing cycle.
            Upgrade your plan or wait for the next cycle to continue.
          </SheetDescription>
        </SheetHeader>
        <div className="flex gap-2 px-4 pb-4">
          <Button>Upgrade plan</Button>
          <SheetClose asChild>
            <Button variant="outline">Dismiss</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const NoOverlay: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open without overlay</Button>
      </SheetTrigger>
      <SheetContent noOverlay>
        <SheetHeader>
          <SheetTitle>Quick settings</SheetTitle>
          <SheetDescription>
            Adjust model parameters without leaving the current view.
          </SheetDescription>
        </SheetHeader>
        <div className="space-y-4 px-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Default model</label>
            <Input defaultValue="mistral-large-latest" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Temperature</label>
            <Input type="number" defaultValue="0.7" step="0.1" min="0" max="2" />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};
