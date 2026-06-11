import type { StorybookConfig } from '@storybook/nextjs-vite';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-themes'],
  framework: '@storybook/nextjs-vite',
  staticDirs: ['../public'],
  docs: { autodocs: 'tag' },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': resolve(__dirname, '../src'),
    };
    return config;
  },
};

export default config;
