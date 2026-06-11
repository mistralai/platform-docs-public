import type { Meta, StoryObj } from '@storybook/react';
import { TimelineClient } from './timeline-client';
import React from 'react';

const meta: Meta<typeof TimelineClient> = {
  title: 'UI/TimelineClient',
  component: TimelineClient,
  tags: ['autodocs'],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/getting-started/changelog',
      },
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="w-64">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TimelineClient>;

const mockTimelineData = [
  {
    year: '2025',
    months: [
      { month: 'March', href: '#march-2025' },
      { month: 'February', href: '#february-2025' },
      { month: 'January', href: '#january-2025' },
    ],
  },
  {
    year: '2024',
    months: [
      { month: 'December', href: '#december-2024' },
      { month: 'November', href: '#november-2024' },
      { month: 'October', href: '#october-2024' },
      { month: 'September', href: '#september-2024' },
      { month: 'August', href: '#august-2024' },
      { month: 'July', href: '#july-2024' },
      { month: 'June', href: '#june-2024' },
    ],
  },
  {
    year: '2023',
    months: [
      { month: 'December', href: '#december-2023' },
      { month: 'September', href: '#september-2023' },
    ],
  },
];

export const Default: Story = {
  args: {
    timelineData: mockTimelineData,
  },
};

export const SingleYear: Story = {
  args: {
    timelineData: [
      {
        year: '2025',
        months: [
          { month: 'March', href: '#march-2025' },
          { month: 'February', href: '#february-2025' },
          { month: 'January', href: '#january-2025' },
        ],
      },
    ],
  },
};

export const HiddenOnOtherPages: Story = {
  args: {
    timelineData: mockTimelineData,
  },
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/docs/getting-started',
      },
    },
  },
};
