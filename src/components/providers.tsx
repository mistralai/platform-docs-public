'use client';

import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { SearchProvider } from './context/search-provider';
import { TabSyncProvider } from '@/contexts/tab-sync-context';
import { SDKVersionSyncProvider } from '@/contexts/sdk-version-sync-context';

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SearchProvider>
        <TabSyncProvider>
          <SDKVersionSyncProvider>{children}</SDKVersionSyncProvider>
        </TabSyncProvider>
      </SearchProvider>
    </ThemeProvider>
  );
}
