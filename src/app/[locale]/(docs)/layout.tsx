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
import { flattenSidebar } from '@/lib/api-sidebar';
import { ApiSidebarItem } from '@/app/[locale]/(api)/schema/api-sidebar';
import { getApiSidebarMetadata } from '@/lib/content/localized-api-sidebar';
import { defaultLocale, type Locale } from '@/i18n/config';
import { getLingo } from '@/i18n/server';

export const dynamic = 'force-static';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = (await params) as { locale: Locale };
  const l = await getLingo(locale);
  const siteName = l.text('Mistral Docs', { context: 'Site name used in documentation page titles' });
  return {
    title: {
      template: `%s | ${siteName}`,
      absolute: siteName,
      default: siteName,
    },
  };
}

export default async function SidebarLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = (await params) as { locale: Locale };
  const contentRoots =
    locale === defaultLocale
      ? [`src/content/${defaultLocale}/docs`]
      : [`src/content/${locale}/docs`, `src/content/${defaultLocale}/docs`];
  const sidebar = await getSidebar([
    ...contentRoots,
    'src/app/[locale]/(docs)',
  ]);
  const apiSidebarMetadata = await getApiSidebarMetadata(locale);
  const { tree: sidebarTree, defaultExpandedCategories } = sidebarTreeData(
    sidebar,
    apiSidebarMetadata
  );

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
                <Timeline className={cn(asideClassName)} locale={locale} />
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

const isApiReferenceSlug = (slug: string[]) =>
  slug.length === 1 && slug[0] === 'api-reference';

const isGettingStartedSlug = (slug: string[]) =>
  slug.length === 1 && slug[0] === 'getting-started';

const isResourcesSlug = (slug: string[]) =>
  slug.length === 1 && slug[0] === 'resources';

const sidebarTreeData = (
  sidebar: SidebarItem[],
  apiSidebarMetadata: Awaited<ReturnType<typeof getApiSidebarMetadata>>
): { tree: SideBarTreeNode[]; defaultExpandedCategories: string[] } => {
  const items: SideBarTreeNode[] = [];
  const defaultExpandedCategories: string[] = [];
  const apiSidebarData = mapApiSidebarToTreeNode(flattenSidebar(apiSidebarMetadata));

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
        const fileCategoryPath = `/${item.slug.join('/')}`;

        if (isApiReferenceSlug(item.slug)) {
          items.push({
            label: label,
            href: fileHref,
            categoryPath: fileCategoryPath,
            children: apiSidebarData,
            pagination: { prev: undefined, next: undefined },
            clickable: true,
          });
          break;
        }

        items.push({
          label: label,
          href: fileHref,
          categoryPath: fileCategoryPath,
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

        const childResult = sidebarTreeData(item.children || [], apiSidebarMetadata);
        const categoryChildren = childResult.tree;
        defaultExpandedCategories.push(...childResult.defaultExpandedCategories);

        if (isApiReferenceSlug(item.slug)) {
          categoryChildren.push(...apiSidebarData);
        }

        if (isResourcesSlug(item.slug)) {
          categoryChildren.unshift({
            label: 'API Reference',
            href: '/api',
            categoryPath: '/api',
            children: [],
            pagination: { prev: undefined, next: undefined },
            clickable: true,
            isExternalLink: true,
          });
        }

        const isGettingStarted = isGettingStartedSlug(item.slug);
        const categoryHref = isGettingStarted ? '/' : href;
        const categoryPath = isGettingStarted ? '/' : `/${item.slug.join('/')}`;

        if (item.metadata?.defaultExpanded) {
          defaultExpandedCategories.push(categoryPath);
        }

        if (isGettingStarted) {
          categoryChildren.push(
            {
              label: 'SDK Clients ↗',
              href: '/resources/sdks',
              categoryPath: '/resources/sdks',
              children: [],
              pagination: { prev: undefined, next: undefined },
              clickable: true,
              isExternalLink: true,
            },
            {
              label: 'API Reference ↗',
              href: '/api',
              categoryPath: '/api',
              children: [],
              pagination: { prev: undefined, next: undefined },
              clickable: true,
              isExternalLink: true,
            }
          );
        }

        items.push({
          label: label,
          children: categoryChildren,
          href: categoryHref,
          categoryPath,
          pagination: { prev: undefined, next: undefined },
          clickable: isGettingStarted || item.clickable ? true : false,
        });
        break;
      }
    }
  }
  return { tree: items, defaultExpandedCategories };
};
