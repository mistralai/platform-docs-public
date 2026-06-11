import type { Meta, StoryObj } from '@storybook/react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './select';
import React from 'react';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="mistral-large">Mistral Large</SelectItem>
        <SelectItem value="mistral-small">Mistral Small</SelectItem>
        <SelectItem value="devstral">Devstral</SelectItem>
        <SelectItem value="codestral">Codestral</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithGroups: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[280px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Premier models</SelectLabel>
          <SelectItem value="mistral-large">Mistral Large</SelectItem>
          <SelectItem value="mistral-small">Mistral Small</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Code models</SelectLabel>
          <SelectItem value="codestral">Codestral</SelectItem>
          <SelectItem value="devstral">Devstral</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Open-weight models</SelectLabel>
          <SelectItem value="mistral-7b">Mistral 7B</SelectItem>
          <SelectItem value="mixtral-8x7b">Mixtral 8x7B</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const SmallSize: Story = {
  render: () => (
    <Select>
      <SelectTrigger size="sm" className="w-[200px]">
        <SelectValue placeholder="Region" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="eu-west">EU West</SelectItem>
        <SelectItem value="us-east">US East</SelectItem>
        <SelectItem value="ap-southeast">AP Southeast</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithDisabledItems: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[240px]">
        <SelectValue placeholder="Select deployment" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="cloud">Cloud deployment</SelectItem>
        <SelectItem value="vpc">VPC deployment</SelectItem>
        <SelectItem value="on-prem" disabled>On-premises (enterprise only)</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithDefaultValue: Story = {
  render: () => (
    <Select defaultValue="mistral-large">
      <SelectTrigger className="w-[240px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="mistral-large">Mistral Large</SelectItem>
        <SelectItem value="mistral-small">Mistral Small</SelectItem>
        <SelectItem value="devstral">Devstral</SelectItem>
      </SelectContent>
    </Select>
  ),
};
