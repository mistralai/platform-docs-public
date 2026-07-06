'use client';
import { ContextualHiddenDocsSidebar } from '@/components/layout/contextual-hidden-sidebar';
import { ApiSidebarItem } from '../schema/api-sidebar';
import React from 'react';
import { MethodBadge } from './method-badge';
import { DownloadIcon } from '@/components/icons/pixel';

export const ContextualHiddenApiSidebar = ({
  sidebar,
  children,
}: {
  sidebar: ApiSidebarItem[];
  children?: React.ReactNode;
}) => {
  const renderItem = React.useCallback(
    ({ item, isActive }: { item: ApiSidebarItem; isActive: boolean }) => {
      if (item.type === 'action') {
        return (
          <>
            <span>{item.label}</span>
            <DownloadIcon className="size-4" />
          </>
        );
      }
      if (item.type === 'category') {
        return <>{item.label}</>;
      }
      return (
        <>
          <MethodBadge active={isActive}>{item.method}</MethodBadge>
          <span className="w-full truncate">{item.label}</span>
        </>
      );
    },
    []
  );

  return (
    <ContextualHiddenDocsSidebar<ApiSidebarItem>
      expandedCategoriesOptions={{
        overridedExpandedCategories: {
          '/api': [['api', 'endpoint', 'chat']],
        },
      }}
      hashResponsive={true}
      sidebar={sidebar}
      renderItem={renderItem}
      filterByActiveHeaderTab={false}
    >
      {children}
    </ContextualHiddenDocsSidebar>
  );
};
