import type { Meta, StoryObj } from '@storybook/react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
} from './card';
import { Button } from './button';
import { Badge } from './badge';
import React from 'react';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Mistral Large</CardTitle>
        <CardDescription>Our flagship model for complex reasoning tasks</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          128k context window, multilingual, with function calling support.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Mistral Large</CardTitle>
        <CardDescription>Flagship model</CardDescription>
        <CardAction>
          <Badge variant="model">Latest</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Best for complex reasoning, math, and code generation.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>Create API Key</CardTitle>
        <CardDescription>Generate a new API key for your project</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          API keys grant access to Mistral endpoints. Keep them secure.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline">Cancel</Button>
        <Button>Create</Button>
      </CardFooter>
    </Card>
  ),
};

export const Full: Story = {
  render: () => (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>Mistral Large</CardTitle>
        <CardDescription>mistral-large-latest</CardDescription>
        <CardAction>
          <Badge variant="model">128k</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Input price</span>
            <span>$2 / 1M tokens</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Output price</span>
            <span>$6 / 1M tokens</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Context window</span>
            <span>128,000 tokens</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Try in Playground</Button>
      </CardFooter>
    </Card>
  ),
};
