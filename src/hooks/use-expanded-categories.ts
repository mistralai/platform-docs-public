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
  overridedExpandedCategories: OverridedExpandedCategories,
  defaultExpandedCategories: string[] = []
): Set<string> => {
  const expandedPaths = new Set<string>();

  let targetSlugs = [];
  if (overridedExpandedCategories[pathname]) {
    targetSlugs = overridedExpandedCategories[pathname];
  } else {
    targetSlugs = [pathname.split('/').filter(Boolean)];
  }

  const traverse = (items: SideBarTreeNode[]) => {
    items.forEach(item => {
      if (item.href) {
        const categoryPathText = item.href.split('/');
        const pathKey = categoryPathText.join('/');
        const categoryPath = categoryPathText.filter(Boolean);

        if (
          targetSlugs.some((targetSlug: any) =>
            isPathContained(categoryPath, targetSlug)
          )
        ) {
          expandedPaths.add(pathKey);
        }
      }

      if (item.children) {
        traverse(item.children);
      }
    });
  };

  traverse(sidebar);

  for (const href of defaultExpandedCategories) {
    expandedPaths.add(href);
  }

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
  /* Category hrefs that should be expanded by default on all pages */
  defaultExpandedCategories?: string[];
};

const defaultExpandedCategoriesOptions: ExpandedCategoriesOptions = {
  overridedExpandedCategories: {},
  defaultExpandedCategories: [],
};

export const useExpandedCategories = (
  sidebar: SideBarTreeNode[],
  options: ExpandedCategoriesOptions = defaultExpandedCategoriesOptions
) => {
  const { overridedExpandedCategories, defaultExpandedCategories } = {
    ...defaultExpandedCategoriesOptions,
    ...options,
  };

  const pathname = usePathname();
  const isHydrated = useIsRendered();

  const autoExpandedPaths = React.useMemo(() => {
    return getExpandedPaths(sidebar, pathname, overridedExpandedCategories, defaultExpandedCategories);
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

  const toggleCategory = React.useCallback((href: string, isOpen: boolean, accordion = false) => {
    setExpandedCategories(prev => {
      const next = new Set<string>();
      if (accordion) {
        if (isOpen) {
          for (const p of prev) {
            if (href.startsWith(p) || p.startsWith(href)) {
              next.add(p);
            }
          }
          next.add(href);
        } else {
          for (const p of prev) {
            if (p !== href && !p.startsWith(href)) {
              next.add(p);
            }
          }
        }
      } else {
        for (const p of prev) {
          next.add(p);
        }
        if (isOpen) {
          next.add(href);
        } else {
          next.delete(href);
        }
      }
      return next;
    });
  }, []);

  return {
    expandedCategories,
    toggleCategory,
    isHydrated,
  };
};
