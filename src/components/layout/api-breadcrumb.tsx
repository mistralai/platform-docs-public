'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { BreadcrumbHome, BreadcrumbItem } from '@/components/layout/breadcrumb';
import { ApiSidebarItem } from '@/app/(api)/schema/api-sidebar';
import { getHrefSlugs } from '@/lib/urls';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem as BreadcrumbItemPrimitive,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
  BreadcrumbLink,
} from '@/components/ui/breadcrumb';

const GenericBreadcrumbItemComponent = ({ item }: { item: BreadcrumbItem }) => {
  const commonPageClasses = 'uppercase whitespace-nowrap';

  if (item.isCurrentPage) {
    return (
      <BreadcrumbPage className={cn(commonPageClasses, 'font-semibold')}>
        {item.label}
      </BreadcrumbPage>
    );
  }

  if (item.href) {
    return (
      <BreadcrumbLink
        onClick={e => e.stopPropagation()}
        className={cn(
          'uppercase min-w-0 truncate',
          item.clickable === false && 'pointer-events-none'
        )}
        href={item.href}
      >
        {item.label}
      </BreadcrumbLink>
    );
  }

  return (
    <BreadcrumbPage className={commonPageClasses}>{item.label}</BreadcrumbPage>
  );
};

function findApiItemByPath(
  items: ApiSidebarItem[],
  targetPath: string
): { item: ApiSidebarItem; category?: ApiSidebarItem } | null {
  for (const item of items) {
    if (item.type === 'category') {
      for (const child of item.children) {
        if (
          child.href &&
          getHrefSlugs(child.href).join('/') ===
            getHrefSlugs(targetPath).join('/')
        ) {
          return { item: child, category: item };
        }
      }

      if (
        item.href &&
        getHrefSlugs(item.href).join('/') === getHrefSlugs(targetPath).join('/')
      ) {
        return { item };
      }
    }
  }
  return null;
}

export function ApiBreadcrumb({ sidebar }: { sidebar: ApiSidebarItem[] }) {
  const { setOpenMobile, openMobile } = useSidebar();
  const pathname = usePathname();

  // Map /api to the specific slug structure like docs breadcrumb does
  const slug = pathname === '/api' ? '/api/endpoint/chat' : pathname;

  const result = findApiItemByPath(sidebar, slug);

  if (!result) {
    return null;
  }

  const breadcrumbItems: BreadcrumbItem[] = [];

  if (result.category) {
    breadcrumbItems.push({
      label: result.category.label,
      href: result.category.href,
    });
  }

  breadcrumbItems.push({
    label: result.item.label,
    href: result.item.href,
    isCurrentPage: true,
  });

  return (
    <div
      onClick={() => setOpenMobile(!openMobile)}
      className="flex lg:hidden max-lg:sticky z-50 top-0 bg-background max-lg:border-b border-border/50 h-breadcrumb font-mono max-lg:-mx-inner-sides text-foreground/70 text-xs 2xl:text-sm px-inner-sides"
    >
      <div className="flex-1 flex px-api-operation-content items-center justify-between gap-4 lg:gap-2">
        <BreadcrumbRoot className="flex-3 max-w-max shrink-0 min-w-0 overflow-hidden">
          <BreadcrumbList className="!gap-2 min-w-0 flex-nowrap">
            <BreadcrumbHome homePath="/api" />
            <BreadcrumbSeparator />
            {breadcrumbItems.map((item, i) => (
              <React.Fragment key={`${item.label}-${i}`}>
                <BreadcrumbItemPrimitive
                  className={cn(
                    item.isCurrentPage
                      ? 'text-foreground'
                      : 'overflow-hidden min-w-0'
                  )}
                >
                  <GenericBreadcrumbItemComponent item={item} />
                </BreadcrumbItemPrimitive>
                {i < breadcrumbItems.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </BreadcrumbRoot>
        <div className="h-px flex-1 bg-foreground/30 mb-[calc(var(--breadcrumb)/2)-1px] shrink min-w-0 max-lg:hidden" />
        <span className="lg:hidden">
          <ChevronDown className="size-4" />
        </span>
      </div>
    </div>
  );
}
