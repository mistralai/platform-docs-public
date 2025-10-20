'use client';

import { usePathname } from 'next/navigation';
import { findItemBySlug } from '@/lib/content/breadcrumb-stuff';
import { SideBarTreeNode } from '../sidebar';
import {
  Pagination,
  PaginationContent,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { SidebarItem } from '@/schema';
import { getHrefSlugs } from '@/lib/urls';

export default function DocsPagination({
  sidebar,
}: {
  sidebar: SidebarItem[];
}) {
  const { prev, next, hidden } = useDocsPagination({ sidebar });
  if (hidden) return null;

  return (
    <Pagination className="flex justify-between items-center pt-3 border-t mt-8 not-prose w-auto">
      <PaginationContent>
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

const useDocsPagination = ({ sidebar }: { sidebar: SidebarItem[] }) => {
  const pathname = usePathname();

  const slug = pathname === '/' ? [] : getHrefSlugs(pathname);
  const currentItem = findItemBySlug(sidebar, slug, true);

  const prevItem = currentItem?.pagination.prev;
  const nextItem = currentItem?.pagination.next;

  const hidden = currentItem?.metadata?.hidePagination ?? false;
  return { prev: prevItem ?? null, next: nextItem ?? null, hidden };
};
