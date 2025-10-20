'use client';
import { usePathname } from 'next/navigation';

import { getHrefSlugs } from '@/lib/urls';
import {
  Pagination,
  PaginationPrevious,
  PaginationNext,
  PaginationContent,
} from '@/components/ui/pagination';
import { SideBarTreeNode } from '@/components/layout/sidebar';

export function ApiPagination({
  items,
  overrides,
}: {
  items: SideBarTreeNode[];
  overrides?: {
    pathSlugMap?: Record<string, string[]>;
  };
}) {
  const { prev, next, hidden } = useApiPagination({ items, overrides });

  if (hidden) return null;

  return (
    <Pagination>
      <PaginationContent className="ml-api-operation-content mr-api-operation-response mt-4 pt-4 pb-6 border-t border-border">
        {prev ? (
          <PaginationPrevious href={prev?.href} label={prev.title} />
        ) : (
          <div />
        )}
        {next ? (
          <PaginationNext href={next?.href} label={next.title} />
        ) : (
          <div />
        )}
      </PaginationContent>
    </Pagination>
  );
}

const useApiPagination = ({
  items,
  overrides,
}: {
  items: SideBarTreeNode[];
  overrides?: {
    pathSlugMap?: Record<string, string[]>;
  };
}) => {
  const pathname = usePathname();

  const currentItem = findApiItemByPath(items, pathname, overrides);

  if (!currentItem) {
    return { prev: null, next: null, hidden: true };
  }

  const prevItem = currentItem?.pagination.prev;
  const nextItem = currentItem?.pagination.next;

  const hidden = !prevItem && !nextItem;
  return { prev: prevItem ?? null, next: nextItem ?? null, hidden };
};

function findApiItemByPath(
  items: SideBarTreeNode[],
  targetPath: string,
  overrides?: {
    pathSlugMap?: Record<string, string[]>;
  }
): SideBarTreeNode | null {
  const [stable, beta] = items;

  const stableItem = stable.children.find(item => {
    const overrideHref =
      overrides?.pathSlugMap?.[targetPath]?.join('/') ?? null;
    const itemHref = getHrefSlugs(item.href ?? '').join('/');
    const targetHref = getHrefSlugs(targetPath).join('/');
    return (
      item.href &&
      (itemHref === targetHref ||
        (overrideHref ? overrideHref === itemHref : false))
    );
  }) as SideBarTreeNode | null;

  if (stableItem) return stableItem;
  const betaItem = beta.children.find(item => {
    const overrideHref =
      overrides?.pathSlugMap?.[targetPath]?.join('/') ?? null;
    const itemHref = getHrefSlugs(item.href ?? '').join('/');
    const targetHref = getHrefSlugs(targetPath).join('/');
    return (
      item.href &&
      (itemHref === targetHref ||
        (overrideHref ? overrideHref === itemHref : false))
    );
  }) as SideBarTreeNode | null;
  if (betaItem) return betaItem;

  return null;
}
