import type { Meta, StoryObj } from '@storybook/react';
import BackGradient from './back-gradient';
import React from 'react';

const meta: Meta<typeof BackGradient> = {
  title: 'Layout/BackGradient',
  component: BackGradient,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A fixed gradient overlay at the top of the viewport. Appears after scrolling past 72px and hides when the footer reaches the top of the screen. Provides a smooth fade-to-background effect.',
      },
    },
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof BackGradient>;

export const Default: Story = {
  render: () => (
    <div className="relative">
      <BackGradient />
      <div className="p-6 space-y-4">
        <p className="text-muted-foreground text-sm">
          Scroll down to see the gradient appear at the top of the viewport.
        </p>
        {Array.from({ length: 30 }, (_, i) => (
          <div
            key={i}
            className="p-4 border border-border rounded-lg bg-muted/50"
          >
            <p className="font-mono text-sm">
              {i === 0 && 'Configure your API key to authenticate requests.'}
              {i === 1 && 'Select a model: Mistral Large, Mistral Small, or Devstral.'}
              {i === 2 && 'Set temperature and top_p parameters for output control.'}
              {i > 2 && `Content block ${i + 1}`}
            </p>
          </div>
        ))}
        <footer className="p-8 bg-muted text-center text-sm text-muted-foreground">
          Footer area — gradient hides when this reaches the top.
        </footer>
      </div>
    </div>
  ),
};
