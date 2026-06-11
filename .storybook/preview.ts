import type { Preview } from '@storybook/react';
import { withThemeByClassName } from '@storybook/addon-themes';
import { withProviders } from './decorators/with-providers';

import '../src/app/globals.css';
import './storybook-fonts.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: { disable: true },
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: '/docs/getting-started',
      },
    },
  },
  globalTypes: {
    docsVariant: {
      description: 'Switch between Docs and API variant',
      toolbar: {
        title: 'Docs Variant',
        icon: 'document',
        items: [
          { value: 'docs', title: 'Docs' },
          { value: 'api', title: 'API' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    docsVariant: 'docs',
  },
  decorators: [
    withThemeByClassName({
      themes: {
        Light: '',
        Dark: 'dark',
      },
      defaultTheme: 'Light',
    }),
    withProviders,
  ],
};

export default preview;
