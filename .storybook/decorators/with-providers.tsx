import React from 'react';
import type { Decorator } from '@storybook/react';
import { LingoProvider } from '@lingo.dev/react';
import { TabSyncProvider } from '@/contexts/tab-sync-context';
import { DocsVariantProvider, type DocsVariant } from '@/contexts/docs-variant';

export const withProviders: Decorator = (Story, context) => {
  const docsVariant: DocsVariant =
    context.globals.docsVariant === 'api' ? 'api' : 'docs';

  return (
    <LingoProvider locale="en" messages={{}}>
      <TabSyncProvider>
        <DocsVariantProvider variant={docsVariant}>
          <div className="bg-background text-foreground min-h-[100px] p-4">
            <Story />
          </div>
        </DocsVariantProvider>
      </TabSyncProvider>
    </LingoProvider>
  );
};
