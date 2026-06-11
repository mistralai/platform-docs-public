import type { Meta, StoryObj } from '@storybook/react';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableCaption,
} from './table';
import React from 'react';

const meta: Meta<typeof Table> = {
  title: 'UI/Table',
  component: Table,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Table>;

const MODELS = [
  { name: 'Mistral Large', context: '128k', inputPrice: '$2', outputPrice: '$6' },
  { name: 'Mistral Small', context: '32k', inputPrice: '$0.2', outputPrice: '$0.6' },
  { name: 'Codestral', context: '32k', inputPrice: '$0.3', outputPrice: '$0.9' },
  { name: 'Mistral Embed', context: '8k', inputPrice: '$0.1', outputPrice: '—' },
];

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Model</TableHead>
          <TableHead>Context</TableHead>
          <TableHead>Input Price</TableHead>
          <TableHead>Output Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {MODELS.map((model) => (
          <TableRow key={model.name}>
            <TableCell className="font-medium">{model.name}</TableCell>
            <TableCell>{model.context}</TableCell>
            <TableCell>{model.inputPrice}</TableCell>
            <TableCell>{model.outputPrice}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};

export const WithCaption: Story = {
  render: () => (
    <Table>
      <TableCaption>Mistral AI model comparison — prices per 1M tokens</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Model</TableHead>
          <TableHead>Context</TableHead>
          <TableHead>Input Price</TableHead>
          <TableHead>Output Price</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {MODELS.map((model) => (
          <TableRow key={model.name}>
            <TableCell className="font-medium">{model.name}</TableCell>
            <TableCell>{model.context}</TableCell>
            <TableCell>{model.inputPrice}</TableCell>
            <TableCell>{model.outputPrice}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  ),
};
