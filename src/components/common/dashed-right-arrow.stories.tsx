import type { Meta, StoryObj } from '@storybook/react';
import DashedRightArrow from './dashed-right-arrow';
import React from 'react';

const meta: Meta<typeof DashedRightArrow> = {
  title: 'Common/DashedRightArrow',
  component: DashedRightArrow,
  tags: ['autodocs'],
  decorators: [
    (Story: React.ComponentType) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DashedRightArrow>;

export const Default: Story = {};

export const CustomSize: Story = {
  args: {
    arrowSize: 14,
    lineThickness: 2,
  },
};

export const SmallArrow: Story = {
  args: {
    arrowSize: 5,
    lineThickness: 1,
  },
};

export const WithCustomClasses: Story = {
  args: {
    lineClassName: 'border-orange-500',
    headClassName: 'text-orange-500',
  },
};

export const InContext: Story = {
  render: () => (
    <div className="flex items-center gap-3 max-w-md">
      <span className="text-sm font-medium whitespace-nowrap">API request</span>
      <DashedRightArrow />
      <span className="text-sm font-medium whitespace-nowrap">Mistral Large</span>
      <DashedRightArrow />
      <span className="text-sm font-medium whitespace-nowrap">Response</span>
    </div>
  ),
};
