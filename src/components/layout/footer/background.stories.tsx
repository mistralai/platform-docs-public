import type { Meta, StoryObj } from '@storybook/react';
import BackgroundGradient from './background';
import React from 'react';

const meta: Meta<typeof BackgroundGradient> = {
  title: 'Layout/FooterBackground',
  component: BackgroundGradient,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'SVG gradient background for the footer. Renders separate light and dark mode gradients that toggle via CSS. The light version uses warm sunset tones, while the dark version uses deep blue-to-black tones.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof BackgroundGradient>;

export const Default: Story = {
  render: () => (
    <div className="relative w-full h-96 overflow-hidden rounded-lg border border-border">
      <BackgroundGradient />
      <div className="relative z-10 flex items-end h-full p-6">
        <div className="space-y-2">
          <p className="font-bold text-foreground">Footer background gradient</p>
          <p className="text-sm text-foreground/70">
            Toggle between light and dark themes to see both gradient variants.
          </p>
        </div>
      </div>
    </div>
  ),
};
