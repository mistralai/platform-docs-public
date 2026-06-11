import type { Meta, StoryObj } from '@storybook/react';
import { table, thead, tbody, tr, th, td } from './markdown-table';
import React from 'react';

const Table = table;

const meta: Meta<typeof Table> = {
  title: 'Content/MarkdownTable',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Styled markdown table components with horizontal scroll gradient. Used as MDX component overrides for tables rendered from markdown content.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const Thead = thead;
const Tbody = tbody;
const Tr = tr;
const Th = th;
const Td = td;

export const Default: Story = {
  render: () => (
    <Table>
      <Thead>
        <Tr>
          <Th>Model</Th>
          <Th>Context window</Th>
          <Th>Max output tokens</Th>
          <Th>Input price (per 1M tokens)</Th>
          <Th>Output price (per 1M tokens)</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td>Mistral Large</Td>
          <Td>128,000</Td>
          <Td>4,096</Td>
          <Td>$2.00</Td>
          <Td>$6.00</Td>
        </Tr>
        <Tr>
          <Td>Mistral Small</Td>
          <Td>32,000</Td>
          <Td>4,096</Td>
          <Td>$0.20</Td>
          <Td>$0.60</Td>
        </Tr>
        <Tr>
          <Td>Devstral</Td>
          <Td>128,000</Td>
          <Td>8,192</Td>
          <Td>$0.30</Td>
          <Td>$0.90</Td>
        </Tr>
      </Tbody>
    </Table>
  ),
};

export const WideTable: Story = {
  render: () => (
    <div className="max-w-md">
      <Table>
        <Thead>
          <Tr>
            <Th>Model</Th>
            <Th>Context</Th>
            <Th>Function calling</Th>
            <Th>JSON mode</Th>
            <Th>Vision</Th>
            <Th>Streaming</Th>
            <Th>Fine-tuning</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>Mistral Large</Td>
            <Td>128k</Td>
            <Td>Yes</Td>
            <Td>Yes</Td>
            <Td>Yes</Td>
            <Td>Yes</Td>
            <Td>No</Td>
          </Tr>
          <Tr>
            <Td>Mistral Small</Td>
            <Td>32k</Td>
            <Td>Yes</Td>
            <Td>Yes</Td>
            <Td>No</Td>
            <Td>Yes</Td>
            <Td>Yes</Td>
          </Tr>
        </Tbody>
      </Table>
    </div>
  ),
};

export const SingleRow: Story = {
  render: () => (
    <Table>
      <Thead>
        <Tr>
          <Th>Parameter</Th>
          <Th>Type</Th>
          <Th>Required</Th>
          <Th>Description</Th>
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          <Td><code>model</code></Td>
          <Td><code>string</code></Td>
          <Td>Yes</Td>
          <Td>The model ID to use for completion (e.g. mistral-large-latest)</Td>
        </Tr>
      </Tbody>
    </Table>
  ),
};
