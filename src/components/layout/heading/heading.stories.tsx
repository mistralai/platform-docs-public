import type { Meta, StoryObj } from '@storybook/react';
import { Heading, HeadingTitle, HeadingSubtitle, HeadingCTAs } from './index';
import { Button } from '@/components/ui/button';
import React from 'react';

const meta: Meta<typeof Heading> = {
  title: 'Layout/Heading',
  component: Heading,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const H1: Story = {
  render: () => (
    <Heading>
      <HeadingTitle as="h1">Mistral AI Documentation</HeadingTitle>
      <HeadingSubtitle>
        Build AI-powered applications with Mistral&apos;s state-of-the-art language models.
      </HeadingSubtitle>
    </Heading>
  ),
};

export const H2: Story = {
  render: () => (
    <Heading>
      <HeadingTitle as="h2">Getting Started</HeadingTitle>
      <HeadingSubtitle>Set up your environment and make your first API call.</HeadingSubtitle>
    </Heading>
  ),
};

export const H3: Story = {
  render: () => (
    <Heading>
      <HeadingTitle as="h3">Chat Completion</HeadingTitle>
      <HeadingSubtitle>Generate conversational responses with Mistral models.</HeadingSubtitle>
    </Heading>
  ),
};

export const H4: Story = {
  render: () => (
    <Heading>
      <HeadingTitle as="h4">Parameters</HeadingTitle>
    </Heading>
  ),
};

export const H5: Story = {
  render: () => (
    <Heading>
      <HeadingTitle as="h5">Required Fields</HeadingTitle>
    </Heading>
  ),
};

export const H6: Story = {
  render: () => (
    <Heading>
      <HeadingTitle as="h6">Example Response</HeadingTitle>
    </Heading>
  ),
};

export const AllColors: Story = {
  render: () => (
    <div className="space-y-4">
      <Heading>
        <HeadingTitle as="h3" color="default">Default Color</HeadingTitle>
      </Heading>
      <Heading>
        <HeadingTitle as="h3" color="muted">Muted Color</HeadingTitle>
      </Heading>
      <Heading>
        <HeadingTitle as="h3" color="primary">Primary Color</HeadingTitle>
      </Heading>
      <Heading>
        <HeadingTitle as="h3" color="destructive">Destructive Color</HeadingTitle>
      </Heading>
    </div>
  ),
};

export const WithSubtitle: Story = {
  render: () => (
    <Heading>
      <HeadingTitle as="h2">Models</HeadingTitle>
      <HeadingSubtitle size="lg" color="default">
        Explore the full range of Mistral AI models, from lightweight to flagship.
      </HeadingSubtitle>
    </Heading>
  ),
};

export const WithCTAs: Story = {
  render: () => (
    <Heading>
      <HeadingTitle as="h1">Mistral AI Platform</HeadingTitle>
      <HeadingSubtitle>
        Build, deploy, and scale AI applications with confidence.
      </HeadingSubtitle>
      <HeadingCTAs>
        <Button>Get API Key</Button>
        <Button variant="outline">View Documentation</Button>
      </HeadingCTAs>
    </Heading>
  ),
};

export const Centered: Story = {
  render: () => (
    <Heading align="center">
      <HeadingTitle as="h1">Welcome to Mistral</HeadingTitle>
      <HeadingSubtitle>
        The leading open-weight AI platform for developers.
      </HeadingSubtitle>
      <HeadingCTAs justify="center">
        <Button>Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </HeadingCTAs>
    </Heading>
  ),
};

export const ApiVariant: Story = {
  render: () => (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground font-mono">
        Switch to &quot;API&quot; in the toolbar to see API variant styling
      </p>
      <Heading>
        <HeadingTitle as="h1">Chat Completion</HeadingTitle>
        <HeadingSubtitle>POST /v1/chat/completions</HeadingSubtitle>
      </Heading>
      <Heading>
        <HeadingTitle as="h2">Request Body</HeadingTitle>
      </Heading>
      <Heading>
        <HeadingTitle as="h3">Messages</HeadingTitle>
      </Heading>
    </div>
  ),
};
