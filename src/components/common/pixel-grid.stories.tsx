import type { Meta, StoryObj } from '@storybook/react';
import { PixelGrid } from './pixel-grid';
import React from 'react';

const meta: Meta<typeof PixelGrid> = {
  title: 'Common/PixelGrid',
  component: PixelGrid,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Animated pixel grid overlay using Perlin noise. Shows on parent hover by default, or permanently with forceVisible. Used as a decorative background effect on cards and containers.',
      },
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="relative w-64 h-40 border border-border rounded-md overflow-hidden">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PixelGrid>;

export const Default: Story = {
  args: {
    forceVisible: true,
  },
};

export const LargePixels: Story = {
  args: {
    pixelSize: 24,
    forceVisible: true,
  },
};

export const SmallPixels: Story = {
  args: {
    pixelSize: 6,
    forceVisible: true,
  },
};

export const HighOpacity: Story = {
  args: {
    opacity: 1,
    forceVisible: true,
  },
};

export const SlowAnimation: Story = {
  args: {
    speed: 0.5,
    forceVisible: true,
  },
};

export const FastAnimation: Story = {
  args: {
    speed: 4,
    forceVisible: true,
  },
};

export const LowRandomness: Story = {
  args: {
    randomness: 0.1,
    forceVisible: true,
  },
};

export const HoverActivated: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The default behavior: the pixel grid appears when hovering the parent container.',
      },
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <div className="relative w-64 h-40 border border-border rounded-md overflow-hidden cursor-pointer">
        <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
          Hover to reveal
        </div>
        <Story />
      </div>
    ),
  ],
  args: {
    forceVisible: false,
  },
};
