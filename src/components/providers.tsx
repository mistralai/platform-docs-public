import { ThemeProvider } from 'next-themes';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { LingoProvider } from '@lingo.dev/react';
import { SearchProvider } from './context/search-provider';
import { TabSyncProvider } from '@/contexts/tab-sync-context';
import { SDKVersionSyncProvider } from '@/contexts/sdk-version-sync-context';
import { loadMessages } from '@/i18n/server';
import type { Locale } from '@/i18n/config';

interface ProvidersProps {
  children: React.ReactNode;
  locale: Locale;
}

export async function Providers({ children, locale }: ProvidersProps) {
  const messages = loadMessages(locale);
  return (
    <LingoProvider locale={locale} messages={messages}>
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
    </LingoProvider>
  );
}
