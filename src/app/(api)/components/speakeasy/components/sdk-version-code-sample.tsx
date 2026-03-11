'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { tabsTriggerVariants, tabsListVariants } from '@/components/ui/tabs';
import {
  useSDKVersionSync,
} from '@/contexts/sdk-version-sync-context';

const VERSIONS = [
  { value: 'v2', label: 'V2' },
  { value: 'v1', label: 'V1' },
] as const;

/**
 * Renders V1/V2 Python SDK code samples with a version toggle.
 *
 * Expects two `<div data-version="v2">` and `<div data-version="v1">` children,
 * each wrapping a <CodeSample> block. The selected version syncs globally via
 * SDKVersionSyncContext so switching it here updates all other SDK version tabs
 * on the page.
 */
export function SDKVersionCodeSample({
  children,
}: {
  children: React.ReactNode;
}) {
  const { selectedSDKVersion, setSelectedSDKVersion } = useSDKVersionSync();

  const childArray = React.Children.toArray(children);

  const getVersionChild = (version: string) =>
    childArray.find(
      child =>
        React.isValidElement(child) &&
        (child.props as { 'data-version'?: string })['data-version'] === version
    );

  const activeChild = getVersionChild(selectedSDKVersion) ?? getVersionChild('v2');

  return (
    <div>
      <div
        data-slot="tabs-list"
        className={cn(tabsListVariants({ variant: 'code' }), 'mb-0 rounded-b-none')}
      >
        {VERSIONS.map(({ value, label }) => (
          <button
            key={value}
            data-slot="tabs-trigger"
            data-state={selectedSDKVersion === value ? 'active' : 'inactive'}
            className={cn(
              'speakeasy-code-tab-trigger cursor-pointer',
              tabsTriggerVariants({ variant: 'code', size: 'code' }),
              'data-[state=active]:bg-code-background dark:data-[state=active]:text-foreground'
            )}
            onClick={() => setSelectedSDKVersion(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {activeChild}
    </div>
  );
}
