import type { Meta, StoryObj } from '@storybook/react';
import { CollabButton } from './collab-button';

const meta: Meta<typeof CollabButton> = {
  title: 'Common/CollabButton',
  component: CollabButton,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CollabButton>;

export const Default: Story = {
  args: {
    colabUrl:
      'https://colab.research.google.com/github/mistralai/cookbook/blob/main/quickstart.ipynb',
  },
};
