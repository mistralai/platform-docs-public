import type { Meta, StoryObj } from '@storybook/react';
import AnimatedStarsBackground from './animated-stars';
import React from 'react';

const meta: Meta<typeof AnimatedStarsBackground> = {
  title: 'Layout/AnimatedStars',
  component: AnimatedStarsBackground,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Canvas-based animated starfield background for the footer. Stars fade in and out with a pulsing aura effect. Only visible in dark mode. Configurable density, opacity, spawn rate, and lifetime.',
      },
    },
  },
  decorators: [
    (Story: React.ComponentType) => (
      <footer className="relative bg-black w-full h-96 overflow-hidden">
        <Story />
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <p className="text-white/60 text-sm font-mono">
            Switch to dark mode to see the stars
          </p>
        </div>
      </footer>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof AnimatedStarsBackground>;

export const Default: Story = {};

export const HighDensity: Story = {
  args: {
    density: 800,
    maxOpacity: 1.0,
    spawnRate: 0.08,
  },
};

export const Sparse: Story = {
  args: {
    density: 5000,
    maxOpacity: 0.6,
    spawnRate: 0.01,
  },
};

export const FastLifecycle: Story = {
  args: {
    minLifetime: 3000,
    maxLifetime: 8000,
    spawnRate: 0.06,
  },
};
