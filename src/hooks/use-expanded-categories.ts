'use client';

import { usePathname } from 'next/navigation';
import * as React from 'react';
import { useIsRendered } from './use-is-rendered';
import { SideBarTreeNode } from '@/components/layout/sidebar';

type OverridedExpandedCategories = Record<string, string[][]>;
const isPathContained = (
  containerPath: string[],
  targetPath: string[]
): boolean => {
  if (containerPath.length >= targetPath.length) return false;
  return containerPath.every((segment, index) => segment === targetPath[index]);
};

const getExpandedPaths = (
  sidebar: SideBarTreeNode[],
  pathname: string,
  overridedExpandedCategories: OverridedExpandedCategories
): Set<string> => {
  const expandedPaths = new Set<string>();

  let targetSlugs = [];
  if (overridedExpandedCategories[pathname]) {
    targetSlugs = overridedExpandedCategories[pathname];
  } else {
    targetSlugs = [pathname.slice(1).split('/')];
  }

  const traverse = (items: SideBarTreeNode[]) => {
    items.forEach(item => {
      if (item.href) {
        const categoryPath = item.href.split('/');
        const pathKey = categoryPath.join('/');

        if (
          targetSlugs.some(targetSlug =>
            isPathContained(categoryPath, targetSlug)
          )
        ) {
          expandedPaths.add(pathKey);
        }

        traverse(item.children);
      }
    });
  };

  traverse(sidebar);
  return expandedPaths;
};

export type ExpandedCategoriesOptions = {
  // this overrides matching paths with the given paths (like ['getting-started', 'introduction'] with '/)
  /**
   * @example
   * {
   *   '/api': [['about']],
   *   '/api/getting-started': [['getting-started', 'introduction'], ['getting-started']],
   * }
   */
  overridedExpandedCategories: OverridedExpandedCategories;
};

const defaultExpandedCategoriesOptions: ExpandedCategoriesOptions = {
  overridedExpandedCategories: {},
};

export const useExpandedCategories = (
  sidebar: SideBarTreeNode[],
  options: ExpandedCategoriesOptions = defaultExpandedCategoriesOptions
) => {
  const { overridedExpandedCategories } = {
    ...defaultExpandedCategoriesOptions,
    ...options,
  };

  const pathname = usePathname();
  const isHydrated = useIsRendered();

  const autoExpandedPaths = React.useMemo(() => {
    return getExpandedPaths(sidebar, pathname, overridedExpandedCategories);
  }, [sidebar, pathname]);

  const [expandedCategories, setExpandedCategories] = React.useState<
    Set<string>
  >(() => {
    const merged = new Set([...Array.from(autoExpandedPaths)]);
    return merged;
  });

  React.useEffect(() => {
    setExpandedCategories(prev => {
      const merged = new Set([
        ...Array.from(autoExpandedPaths),
        ...Array.from(prev),
      ]);
      return merged;
    });
  }, [autoExpandedPaths]);

  return {
    expandedCategories,
    isHydrated,
  };
};
