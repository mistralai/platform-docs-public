'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Tabs as UITabs,
  TabsList as UITabsList,
  TabsTrigger as UITabsTrigger,
  TabsContent as UITabsContent,
} from '@/components/ui/tabs';
import Image from 'next/image';
import { CopyButton } from '../ui/copy-button';
import { CheckIcon, CopyIcon } from '@/components/icons/pixel';
import { Prose } from './prose';
import {
  ExplorerTabsProvider,
  useExplorerTabsContext,
} from '@/contexts/explorer-tabs-context';

type ExplorerTabsProps = {
  className?: string;
  children: React.ReactNode;
  mode?: 'default' | 'close';
  id?: string;
};

export function ExplorerTabs({
  id,
  className,
  children,
  mode = 'default',
}: ExplorerTabsProps) {
  const parentContext = useExplorerTabsContext();
  const items = React.Children.toArray(children).filter((child: any) =>
    React.isValidElement(child)
  ) as React.ReactElement<ExplorerTabProps>[];

  const explorerId = id ? `explorer-tabs-${id}` : undefined;
  const isRootLevel = !parentContext;
  const rootExplorerId = parentContext?.rootExplorerId || explorerId;
  const tabDepth = parentContext ? parentContext.tabDepth + 1 : 0;
  const currentTabPath = parentContext?.tabPath || [];

  const [value, setValue] = React.useState<string | undefined>(() => {
    if (typeof window !== 'undefined' && rootExplorerId) {
      const hash = window.location.hash.replace(/^#/, '');
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');

      // Only process tab parameter if hash matches the root explorer ID
      if (hash === rootExplorerId && tabParam) {
        const tabValues = tabParam.split('_');

        // Get the tab value for current depth
        if (tabValues.length > tabDepth) {
          const targetTabValue = tabValues[tabDepth];
          const match = items.find(item => item.props.value === targetTabValue);
          if (match) return match.props.value;
        }
      }
    }
    return mode === 'default' ? items[0]?.props.value ?? 'empty' : 'empty';
  });

  const handleTabChange = (newValue: string | undefined) => {
    setValue(newValue);

    const url = new URL(window.location.href);
    url.searchParams.delete('tab');
    window.history.replaceState({}, '', url.toString());
  };

  const makeUrlForTab = (tab: string) => {
    if (typeof window === 'undefined' || !rootExplorerId) return '';
    const url = new URL(window.location.href);

    // Build the comma-separated tab path using context information
    const fullTabPath = [...currentTabPath, tab];

    url.searchParams.set('tab', fullTabPath.join('_'));
    url.hash = rootExplorerId;
    return url.toString();
  };

  return (
    <UITabs
      id={explorerId}
      activationMode="manual"
      value={value}
      onValueChange={handleTabChange}
      className={cn('w-full mt-6 flex flex-col gap-0', className)}
    >
      <div className="flex items-center group/tabs">
        <UITabsList
          className="h-9 gap-2 group/explorer-tabs"
          variant="tertiary"
        >
          {items.map(item => (
            <div className="relative" key={item.props.value}>
              <UITabsTrigger
                data-state={value === item.props.value ? 'active' : 'inactive'}
                aria-selected={value === item.props.value}
                disabled={value === item.props.value}
                variant="tertiary"
                size="sm"
                value={item.props.value}
                className={cn(
                  'justify-start text-sm gap-2',
                  rootExplorerId && 'data-[state=active]:pr-10'
                )}
              >
                <span className="truncate">{item.props.label}</span>
              </UITabsTrigger>

              {value === item.props.value && rootExplorerId ? (
                <span className="absolute border-l border-foreground/10 inline-flex items-center justify-center right-px top-px bottom-0 w-8">
                  <CopyButton
                    value={makeUrlForTab(item.props.tabId ?? item.props.value)}
                    CopyIcon={({ copyState }) => {
                      return (
                        <>
                          {copyState !== 'idle' ? (
                            <CheckIcon className="size-3.5 text-primary-soft" />
                          ) : (
                            <CopyIcon className="size-3.5 text-current" />
                          )}
                        </>
                      );
                    }}
                    className="p-0 hover:bg-foreground/10 rounded-tr-[7px] justify-center size-full"
                  />
                </span>
              ) : null}
            </div>
          ))}

          {value !== 'empty' && (
            <UITabsTrigger
              variant="tertiary"
              size="sm"
              value="empty"
              className="ml-auto justify-start text-sm gap-2"
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setValue(undefined);
              }}
            >
              Close
            </UITabsTrigger>
          )}
        </UITabsList>
      </div>

      <div className="space-y-2">
        <div
          data-slot="tabs-content-wrapper"
          className={cn(
            'rounded-lg rounded-tl-none border-foreground/10 border bg-background p-4 text-muted-foreground prose max-w-none min-h-14',
            value !== 'empty' && 'rounded-tr-none'
          )}
        >
          <UITabsContent value="empty" className="px-2">
            <div className="flex items-center not-prose gap-2">
              <Image
                src="/assets/sprites/cat_head.png"
                alt="Cat head"
                width={24}
                height={18}
              />
              <p className="text-base text-foreground/50">
                ¡Meow! Click one of the tabs above to learn more.
              </p>
            </div>
          </UITabsContent>
          {items.map(item => (
            <UITabsContent
              key={item.props.value}
              value={item.props.value}
              id={item.props.tabId ?? item.props.value}
              data-language={item.props.value}
              className={cn(
                'relative pt-2',
                '[&:hover>.tab-copy]:opacity-100',
                '[&:hover>.tab-copy]:pointer-events-auto',
                '[&:has([data-slot="tabs-content-wrapper"]:hover)>.tab-copy]:opacity-0',
                '[&:has([data-slot="tabs-content-wrapper"]:hover)>.tab-copy]:pointer-events-none',
                '[&:has([data-slot="tabs-content-wrapper"]:focus-within)>.tab-copy]:opacity-0',
                '[&:has([data-slot="tabs-content-wrapper"]:focus-within)>.tab-copy]:pointer-events-none',
                '[&:has(pre:hover)>.tab-copy]:opacity-0'
              )}
            >
              <ExplorerTabsProvider
                parentTabId={item.props.value}
                tabDepth={tabDepth}
                rootExplorerId={rootExplorerId}
                tabPath={[...currentTabPath, item.props.value]}
              >
                <Prose>{item.props.children}</Prose>
              </ExplorerTabsProvider>
            </UITabsContent>
          ))}
        </div>
      </div>
    </UITabs>
  );
}

// Rest of your file remains the same
type ExplorerTabProps = {
  value: string;
  label: React.ReactNode;
  children: React.ReactNode;
  default?: boolean;
  tabId?: string;
};

export function ExplorerTab(_props: ExplorerTabProps) {
  return null;
}

(ExplorerTab as any).isExplorerTab = true;
ExplorerTab.displayName = 'ExplorerTab';

export const ExplorerTabItem = ExplorerTab;
