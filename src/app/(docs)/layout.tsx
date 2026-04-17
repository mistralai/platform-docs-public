import React, { Suspense } from 'react';
import { getSidebar } from '@/lib/content';
import { DocsSidebar, SideBarTreeNode } from '@/components/layout/sidebar';
import { SidebarProvider, Sidebar } from '@/components/ui/sidebar';
import PageContent from '@/components/layout/page-content';
import { DocsBreadcrumb } from '@/components/layout/docs-breadcrumb';
import DocsPagination from '@/components/layout/docs-pagination';
import { Timeline } from '@/components/ui/timeline';
import { cn } from '@/lib/utils';
import { TableOfContents } from '@/components/ui/table-of-contents';
import { Metadata } from 'next';
import { Prose } from '@/components/common/prose';
import { SidebarItem } from '@/schema';
import { DocsVariantProvider } from '@/contexts/docs-variant';
import sidebarMetadata from '@/app/(api)/components/sidebar-metadata.json';
import { flattenSidebar } from '@/lib/api-sidebar';
import { ApiSidebarItem } from '@/app/(api)/schema/api-sidebar';

export const metadata: Metadata = {
  title: {
    template: '%s | Mistral Docs',
    absolute: 'Mistral Docs',
    default: 'Mistral Docs',
  },
};

export default async function SidebarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sidebar = await getSidebar('src/app/(docs)');
  const { tree: sidebarTree, defaultExpandedCategories } = sidebarTreeData(sidebar);

  const asideClassName =
    'hidden xl:flex w-[calc(var(--sidebar-width)-var(--sides))] ml-10 2xl:ml-14 pl-2';

  return (
    <SidebarProvider className="max-lg:px-inner-sides">
      <DocsVariantProvider variant="docs">
        <Sidebar
          className="h-fold sticky top-header overflow-y-auto scrollbar-none shrink-0"
          collapsible="none"
        >
          <DocsSidebar
            sidebar={sidebarTree}
            expandedCategoriesOptions={{
              overridedExpandedCategories: {
                '/': [['getting-started']],
              },
              defaultExpandedCategories,
            }}
          />
        </Sidebar>
        <div className="flex flex-1 gap-8 min-w-0 lg:pr-sides">
          <div className="flex flex-col flex-1 min-w-0">
            <PageContent
              as="main"
              className="max-lg:contents lg:px-inner-sides"
            >
              <div className="flex-1 min-w-0 w-full flex justify-center lg:py-6 relative">
                <div
                  className={cn(
                    'flex flex-col gap-8 lg:gap-4 flex-1 w-full min-w-0',
                    'lg:max-w-4xl lg:[&:has(~_[data-table-of-contents])]:max-w-2xl 2xl:[&:has(~_[data-table-of-contents])]:max-w-3xl'
                  )}
                >
                  <DocsBreadcrumb sidebar={sidebar} />

                  <Prose data-page-content className={cn('flex-1')}>
                    {children}
                    <Suspense>
                      <DocsPagination sidebar={sidebar} />
                    </Suspense>
                  </Prose>
                </div>

                <TableOfContents
                  className={asideClassName}
                  maxDepth={3}
                  sidebar={sidebar}
                />
                <Timeline className={cn(asideClassName)} />
              </div>
            </PageContent>
          </div>
        </div>
      </DocsVariantProvider>
    </SidebarProvider>
  );
}

const mapApiSidebarToTreeNode = (items: ApiSidebarItem[]): SideBarTreeNode[] => {
  return items.map(item => ({
    label: item.label,
    href: item.href,
    clickable: item.clickable,
    pagination: { prev: undefined, next: undefined },
    children: [],
    isExternalLink: true,
  }));
};

const sidebarTreeData = (sidebar: SidebarItem[]): { tree: SideBarTreeNode[]; defaultExpandedCategories: string[] } => {
  const items: SideBarTreeNode[] = [];
  const defaultExpandedCategories: string[] = [];
  const apiSidebarData = mapApiSidebarToTreeNode(flattenSidebar(sidebarMetadata));

  for (const item of sidebar) {
    if (item.hidden) {
      continue;
    }

    switch (item.type) {
      /* File --- */
      case 'file': {
        let label = item.metadata?.title;
        if (item.metadata?.sidebar_label) {
          label = item.metadata.sidebar_label;
        } else if (!label) {
          label = item.slug[item.slug.length - 1]!;
        }
        const fileHref =
          item.overridedSlug && item.overridedSlug.length > 0
            ? `/${item.overridedSlug.join('/')}`
            : `/${item.slug.join('/')}`;

        if (label === 'API Reference') {
          items.push({
            label: label,
            href: fileHref,
            children: apiSidebarData,
            pagination: { prev: undefined, next: undefined },
            clickable: true,
          });
          break;
        }

        items.push({
          label: label,
          href: fileHref,
          children: [] as SideBarTreeNode[],
          pagination: { prev: undefined, next: undefined },
          clickable: true,
        });
        break;
      }
      case 'category': {
        // get label ------------------------------------------------------------
        let label = item.slug[item.slug.length - 1]!;
        if (item.type === 'category' && item.metadata) {
          label = item.metadata.label;
        }

        // get href ------------------------------------------------------------
        const href =
          item.overridedSlug && item.overridedSlug.length > 0
            ? `/${item.overridedSlug.join('/')}`
            : `/${item.slug.join('/')}`;

        const childResult = sidebarTreeData(item.children || []);
        const categoryChildren = childResult.tree;
        defaultExpandedCategories.push(...childResult.defaultExpandedCategories);

        if (label === 'API Reference') {
          categoryChildren.push(...apiSidebarData);
        }

        const isGettingStarted = label === 'Getting Started' && item.slug.length === 1;
        const categoryHref = isGettingStarted ? '/' : href;

        if (item.metadata?.defaultExpanded) {
          defaultExpandedCategories.push(categoryHref);
        }

        items.push({
          label: label,
          children: categoryChildren,
          href: categoryHref,
          pagination: { prev: undefined, next: undefined },
          clickable: isGettingStarted || item.clickable ? true : false,
        });
        break;
      }
    }
  }
  return { tree: items, defaultExpandedCategories };
};
