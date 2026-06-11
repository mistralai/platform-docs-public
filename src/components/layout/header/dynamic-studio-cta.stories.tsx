import type { Meta, StoryObj } from '@storybook/react';
import { DynamicStudioCta } from './dynamic-studio-cta';

const meta: Meta<typeof DynamicStudioCta> = {
  title: 'Layout/DynamicStudioCta',
  component: DynamicStudioCta,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'A dynamic call-to-action button that changes its label and destination based on the current page. For example, on the audio transcription page it shows "Try our Audio API", and on the models page it shows "Visit the Playground".',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof DynamicStudioCta>;

export const Default: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/getting-started/quickstart',
      },
    },
  },
};

export const AudioPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/capabilities/audio_transcription',
      },
    },
  },
};

export const ModelsPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/getting-started/models',
      },
    },
  },
};

export const FineTuningPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/capabilities/finetuning',
      },
    },
  },
};

export const DocumentAiPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/capabilities/document_ai',
      },
    },
  },
};

export const CodeGenerationPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/capabilities/code_generation',
      },
    },
  },
};

export const LargeSize: Story = {
  args: {
    size: 'lg',
    className: 'w-full',
  },
};
