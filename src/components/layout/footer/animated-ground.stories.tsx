import type { Meta, StoryObj } from '@storybook/react';
import AnimatedGround from './animated-ground';

const meta: Meta<typeof AnimatedGround> = {
  title: 'Layout/AnimatedGround',
  component: AnimatedGround,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Animated pixel-art footer scene with a scrolling grass ground, flowers, a walking cat, and a sun. Uses a marquee for continuous horizontal scrolling. The ground tile animation syncs with the marquee speed.',
      },
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedGround>;

export const Default: Story = {};
