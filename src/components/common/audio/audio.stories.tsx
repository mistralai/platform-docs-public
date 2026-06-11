import type { Meta, StoryObj } from '@storybook/react';
import { AudioPlayer } from './index';
import React from 'react';

const meta: Meta<typeof AudioPlayer> = {
  title: 'Common/AudioPlayer',
  component: AudioPlayer,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Audio player with waveform visualization powered by WaveSurfer. Displays a play/pause button, animated waveform bars, and a time counter.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AudioPlayer>;

export const Default: Story = {
  render: () => (
    <AudioPlayer>
      <source
        src="https://www2.cs.uic.edu/~i101/SoundFiles/BabyElephantWalk60.wav"
        type="audio/wav"
      />
    </AudioPlayer>
  ),
};

export const WithControls: Story = {
  render: () => (
    <div className="space-y-4 max-w-lg">
      <p className="text-sm text-muted-foreground">
        Sample audio demonstrating the waveform player used in Mistral
        documentation for speech and audio model examples.
      </p>
      <AudioPlayer>
        <source
          src="https://www2.cs.uic.edu/~i101/SoundFiles/StarWars60.wav"
          type="audio/wav"
        />
      </AudioPlayer>
    </div>
  ),
};
