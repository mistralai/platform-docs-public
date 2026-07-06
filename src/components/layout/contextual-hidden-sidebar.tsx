'use client';

import React from 'react';
import { usePathname } from '@/i18n/navigation.client';
import { DocsSidebar, SideBarTreeNode } from '@/components/layout/sidebar';
import type { ExpandedCategoriesOptions } from '@/hooks/use-expanded-categories';

type HiddenTreeNode = SideBarTreeNode & {
  hidden?: boolean;
  children: HiddenTreeNode[];
};

function normalizePath(path?: string): string {
  if (!path) return '';
  const [pathname] = path.split('#');
  if (!pathname) return '';
  if (pathname === '/') return pathname;
  return pathname.replace(/\/+$/, '');
}

function nodePath(item: HiddenTreeNode): string {
  return normalizePath(item.categoryPath || item.href);
}

function pathContains(pathname: string, itemPath: string): boolean {
  if (!itemPath || itemPath === '/') return pathname === itemPath;
  return pathname === itemPath || pathname.startsWith(`${itemPath}/`);
}

function branchContainsPath(item: HiddenTreeNode, pathname: string): boolean {
  const path = nodePath(item);
  return (
    pathContains(pathname, path) ||
    item.children.some(child => branchContainsPath(child, pathname))
  );
}

function filterHiddenTree<T extends HiddenTreeNode>(
  items: T[],
  pathname: string
): T[] {
  return items.flatMap(item => {
    if (item.hidden) {
      return branchContainsPath(item, pathname) ? [item] : [];
    }

    return [
      {
        ...item,
        children: filterHiddenTree(item.children as T[], pathname),
      },
    ];
  });
}

export function ContextualHiddenDocsSidebar<T extends HiddenTreeNode>({
  sidebar,
  expandedCategoriesOptions,
  renderItem,
  hashResponsive = false,
  forceExpandAll = false,
  filterByActiveHeaderTab = true,
  children,
}: {
  sidebar: T[];
  expandedCategoriesOptions?: ExpandedCategoriesOptions;
  renderItem?: (props: { item: T; isActive: boolean }) => React.ReactNode;
  hashResponsive?: boolean;
  forceExpandAll?: boolean;
  filterByActiveHeaderTab?: boolean;
  children?: React.ReactNode;
}) {
  const pathname = normalizePath(usePathname());
  const contextualSidebar = React.useMemo(
    () => filterHiddenTree(sidebar, pathname),
    [sidebar, pathname]
  );

  return (
    <DocsSidebar<T>
      sidebar={contextualSidebar}
      expandedCategoriesOptions={expandedCategoriesOptions}
      renderItem={renderItem}
      hashResponsive={hashResponsive}
      forceExpandAll={forceExpandAll}
      filterByActiveHeaderTab={filterByActiveHeaderTab}
    >
      {children}
    </DocsSidebar>
  );
}
