import type { Meta, StoryObj } from '@storybook/react';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from './drawer';
import { Button } from './button';
import { Input } from './input';
import React from 'react';

const meta: Meta<typeof Drawer> = {
  title: 'UI/Drawer',
  component: Drawer,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
  render: () => (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Model configuration</DrawerTitle>
          <DrawerDescription>
            Adjust the parameters for your next API request.
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-4 px-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Model</label>
            <Input defaultValue="mistral-large-latest" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Max tokens</label>
            <Input type="number" defaultValue="4096" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Temperature</label>
            <Input type="number" defaultValue="0.7" step="0.1" min="0" max="2" />
          </div>
        </div>
        <DrawerFooter>
          <Button>Apply settings</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const DirectionTop: Story = {
  render: () => (
    <Drawer direction="top">
      <DrawerTrigger asChild>
        <Button variant="outline">Open top drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Service status</DrawerTitle>
          <DrawerDescription>
            All API endpoints are operating normally. Last checked 5 minutes ago.
          </DrawerDescription>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  ),
};

export const DirectionRight: Story = {
  render: () => (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline">Open right drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Request inspector</DrawerTitle>
          <DrawerDescription>
            View the details of your most recent API request.
          </DrawerDescription>
        </DrawerHeader>
        <div className="space-y-3 px-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Endpoint</p>
            <p className="text-sm font-mono">/v1/chat/completions</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Model</p>
            <p className="text-sm font-mono">mistral-large-latest</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Tokens used</p>
            <p className="text-sm font-mono">1,247 input / 532 output</p>
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Latency</p>
            <p className="text-sm font-mono">1.8s</p>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ),
};

export const DirectionLeft: Story = {
  render: () => (
    <Drawer direction="left">
      <DrawerTrigger asChild>
        <Button variant="outline">Open left drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Workspace navigation</DrawerTitle>
          <DrawerDescription>
            Switch between your Workspaces and Projects.
          </DrawerDescription>
        </DrawerHeader>
        <nav className="space-y-1 px-4">
          <p className="text-sm py-1.5 px-2 rounded-sm bg-accent font-medium">
            Production
          </p>
          <p className="text-sm py-1.5 px-2 text-muted-foreground">Staging</p>
          <p className="text-sm py-1.5 px-2 text-muted-foreground">Development</p>
          <p className="text-sm py-1.5 px-2 text-muted-foreground">Research</p>
        </nav>
      </DrawerContent>
    </Drawer>
  ),
};
