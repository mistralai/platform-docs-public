import type { Meta, StoryObj } from '@storybook/react';
import { Combobox } from './combobox';
import React from 'react';

const meta: Meta<typeof Combobox> = {
  title: 'UI/Combobox',
  component: Combobox,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Combobox>;

const modelOptions = [
  { value: 'mistral-large-latest', label: 'Mistral Large' },
  { value: 'mistral-small-latest', label: 'Mistral Small' },
  { value: 'devstral-latest', label: 'Devstral' },
  { value: 'codestral-latest', label: 'Codestral' },
  { value: 'mistral-embed', label: 'Mistral Embed' },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <Combobox
        options={modelOptions}
        value={value}
        onValueChange={setValue}
        placeholder="Select a model..."
        searchPlaceholder="Search models..."
        emptyText="No model found."
        width="w-[250px]"
      />
    );
  },
};

export const WithPreselectedValue: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(
      'mistral-large-latest'
    );

    return (
      <Combobox
        options={modelOptions}
        value={value}
        onValueChange={setValue}
        placeholder="Select a model..."
        searchPlaceholder="Search models..."
        width="w-[250px]"
      />
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <Combobox
      options={modelOptions}
      value="mistral-large-latest"
      placeholder="Select a model..."
      disabled
      width="w-[250px]"
    />
  ),
};

export const WithDisabledOptions: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);

    const options = [
      { value: 'mistral-large-latest', label: 'Mistral Large' },
      { value: 'mistral-small-latest', label: 'Mistral Small' },
      {
        value: 'devstral-latest',
        label: 'Devstral (not available in your region)',
        disabled: true,
      },
      {
        value: 'codestral-latest',
        label: 'Codestral (requires upgrade)',
        disabled: true,
      },
      { value: 'mistral-embed', label: 'Mistral Embed' },
    ];

    return (
      <Combobox
        options={options}
        value={value}
        onValueChange={setValue}
        placeholder="Select a model..."
        searchPlaceholder="Search models..."
        width="w-[300px]"
      />
    );
  },
};

export const NoChevron: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <Combobox
        options={modelOptions}
        value={value}
        onValueChange={setValue}
        placeholder="Select a model..."
        showChevron={false}
        width="w-[250px]"
      />
    );
  },
};

export const AlignCenter: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);

    return (
      <div className="flex justify-center">
        <Combobox
          options={modelOptions}
          value={value}
          onValueChange={setValue}
          placeholder="Select a model..."
          align="center"
          width="w-[250px]"
        />
      </div>
    );
  },
};

export const CustomPlaceholders: Story = {
  render: () => {
    const [value, setValue] = React.useState<string | null>(null);

    const regionOptions = [
      { value: 'eu-west', label: 'EU West (Paris)' },
      { value: 'us-east', label: 'US East (Virginia)' },
      { value: 'ap-southeast', label: 'AP Southeast (Singapore)' },
    ];

    return (
      <Combobox
        options={regionOptions}
        value={value}
        onValueChange={setValue}
        placeholder="Choose a deployment region..."
        searchPlaceholder="Filter regions..."
        emptyText="No region matches your search."
        width="w-[300px]"
      />
    );
  },
};
