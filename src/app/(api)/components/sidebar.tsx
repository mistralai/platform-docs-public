'use client';
import { DocsSidebar } from '@/components/layout/sidebar';
import { ApiSidebarItem } from '../schema/api-sidebar';

import React from 'react';
import { MethodBadge } from './method-badge';

export const ApiDocsSidebar = ({ sidebar }: { sidebar: ApiSidebarItem[] }) => {
  const renderItem = React.useCallback(
    ({ item, isActive }: { item: ApiSidebarItem; isActive: boolean }) => {
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
    <DocsSidebar<ApiSidebarItem>
      expandedCategoriesOptions={{
        overridedExpandedCategories: {
          '/api': [['api', 'endpoint', 'chat']],
        },
      }}
      hashResponsive={true}
      sidebar={sidebar}
      renderItem={renderItem}
    />
  );
};
