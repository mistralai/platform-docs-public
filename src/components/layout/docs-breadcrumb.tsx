'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import {
  TopCategoryCta,
  BreadcrumbHome,
  BreadcrumbItem,
} from '@/components/layout/breadcrumb';
import {
  getBreadcrumb,
  getSlugOrOverridedSlug,
} from '@/lib/content/breadcrumb-stuff';
import { SidebarItem } from '@/schema';
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

export function DocsBreadcrumb({ sidebar }: { sidebar: SidebarItem[] }) {
  const { setOpenMobile, openMobile } = useSidebar();
  const pathname = usePathname();
  const slug =
    pathname === '/'
      ? ['getting-started', 'introduction']
      : pathname.slice(1).split('/');

  const { breadcrumb, topCategory } = getBreadcrumb(sidebar, slug);
  const lastItem = breadcrumb[breadcrumb.length - 1];

  const breadcrumbItems: BreadcrumbItem[] = breadcrumb.map((item, i) => {
    const sidebarLabel =
      item.type === 'file'
        ? item.metadata?.sidebar_label || item.metadata?.title
        : item.metadata?.label;
    const href = getSlugOrOverridedSlug(item);
    const isCurrentPage = i === breadcrumb.length - 1;

    return {
      label: sidebarLabel || '',
      href: href || undefined,
      isCurrentPage,
      clickable: item.clickable,
    };
  });

  return (
    <div
      onClick={() => setOpenMobile(!openMobile)}
      className="flex max-lg:sticky z-50 top-0 items-center justify-between bg-background gap-4 lg:gap-2 max-lg:border-b border-border/50 h-breadcrumb max-lg:px-inner-sides font-mono max-lg:-mx-inner-sides text-foreground/70 text-xs 2xl:text-sm"
    >
      <BreadcrumbRoot className="flex-3 max-w-max shrink-0 min-w-0 overflow-hidden">
        <BreadcrumbList className="!gap-2 min-w-0 flex-nowrap">
          <BreadcrumbHome />
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
      <TopCategoryCta
        topCategory={topCategory}
        lastItem={lastItem}
        className="max-lg:hidden"
      />
      <span className="lg:hidden">
        <ChevronDown className="size-4" />
      </span>
    </div>
  );
}
