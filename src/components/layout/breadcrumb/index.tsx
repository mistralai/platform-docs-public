'use client';

import React from 'react';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';
import {
  Breadcrumb as BreadcrumbRoot,
  BreadcrumbItem as BreadcrumbItemPrimitive,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb';
import { ChevronDown } from 'lucide-react';
import {
  getBreadcrumb,
  getSlugOrOverridedSlug,
} from '@/lib/content/breadcrumb-stuff';
import { SidebarItem } from '@/schema';
import HomeIcon from '@/components/icons/home';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bullet } from '@/components/ui/bullet';
import { useSidebar } from '@/components/ui/sidebar';
import { useCopyButton } from '@/components/ui/copy-button';
import { CheckIcon, CopyIcon } from '@/components/icons/pixel';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
  clickable?: boolean;
}

export interface BreadcrumbOverrides {
  /** Custom breadcrumb items to display instead of auto-generated ones */
  items?: BreadcrumbItem[];
  /** Whether to show the home icon (default: true) */
  showHome?: boolean;
  /** Additional CSS classes to apply to the breadcrumb container */
  className?: string;
  /** Custom mobile toggle handler (default: uses sidebar toggle) */
  onMobileToggle?: () => void;
  /** Whether to show the mobile toggle button (default: true) */
  showMobileToggle?: boolean;
  /** Whether to show the top category CTA (default: true) */
  showTopCategoryCta?: boolean;
  /** Custom top category CTA component to replace the default one */
  customTopCategoryCta?: React.ReactNode;
  /** Override the default slug for root path (default: ['getting-started', 'introduction']) */
  rootSlug?: string[];
  /** Override slug mappings for specific paths (e.g., { '/api': ['api', 'getting-started'] }) */
  pathSlugMap?: Record<string, string[]>;
  /** Override the home path (default: '/') */
  homePath?: string;
}

const BreadcrumbItemComponent = ({ item }: { item: BreadcrumbItem }) => {
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

const BreadcrumbItem = ({
  item,
  isCurrentPage,
}: {
  item: SidebarItem;
  isCurrentPage: boolean;
}) => {
  const sidebarLabel =
    item.type === 'file'
      ? item.metadata?.sidebar_label || item.metadata?.title
      : item.metadata?.label;
  const isClickable = item.clickable;
  const href = getSlugOrOverridedSlug(item);

  const commonPageClasses = 'uppercase whitespace-nowrap';

  if (isCurrentPage) {
    return (
      <BreadcrumbPage className={cn(commonPageClasses, 'font-semibold')}>
        {sidebarLabel}
      </BreadcrumbPage>
    );
  }

  if (href) {
    return (
      <BreadcrumbLink
        onClick={e => e.stopPropagation()}
        className={cn(
          'uppercase min-w-0 truncate',
          !isClickable && 'pointer-events-none'
        )}
        href={href}
      >
        {sidebarLabel}
      </BreadcrumbLink>
    );
  }

  return (
    <BreadcrumbPage className={commonPageClasses}>
      {sidebarLabel}
    </BreadcrumbPage>
  );
};

/**
 * Generic breadcrumb component that can work with any items
 * 
 * @param items - Array of breadcrumb items to display
 * @param showHome - Whether to show the home icon (default: true)
 * @param className - Additional CSS classes
 * @param onMobileToggle - Custom mobile toggle handler
 * @param showMobileToggle - Whether to show mobile toggle button (default: false)
 * @param showTopCategoryCta - Whether to show top category CTA (default: false)
 * @param customTopCategoryCta - Custom top category CTA component
 * 
 * @example
 * // Simple breadcrumb with custom items
 * <GenericBreadcrumb 
 *   items={[
 *     { label: 'Home', href: '/' },
 *     { label: 'Products', href: '/products' },
 *     { label: 'Current Product', isCurrentPage: true }
 *   ]} 
 * />
 * 
 * @example
 * // E-commerce breadcrumb
 * <GenericBreadcrumb 
 *   items={[
 *     { label: 'Store', href: '/store' },
 *     { label: 'Electronics', href: '/store/electronics' },
 *     { label: 'Phones', href: '/store/electronics/phones' },
 *     { label: 'iPhone 15', isCurrentPage: true }
 *   ]} 
 * />
 * 
 * @example
 * // API documentation breadcrumb
 * <GenericBreadcrumb 
 *   items={[
 *     { label: 'API', href: '/api' },
 *     { label: 'Endpoints', href: '/api/endpoints' },
     { label: 'POST /users', isCurrentPage: true }
   ]} 
 * />
 */
export function GenericBreadcrumb({
  items,
  showHome = true,
  className,
  onMobileToggle,
  showMobileToggle = false,
  showTopCategoryCta = false,
  customTopCategoryCta,
  homePath = '/',
}: {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
  onMobileToggle?: () => void;
  showMobileToggle?: boolean;
  showTopCategoryCta?: boolean;
  customTopCategoryCta?: React.ReactNode;
  homePath?: string;
}) {
  return (
    <div
      onClick={onMobileToggle}
      className={cn(
        'flex max-lg:sticky z-50 top-0 items-center justify-between bg-background gap-4 lg:gap-2 max-lg:border-b border-border/50 h-breadcrumb max-lg:px-inner-sides font-mono max-lg:-mx-inner-sides text-foreground/70 text-xs 2xl:text-sm',
        className
      )}
    >
      <BreadcrumbRoot className="flex-3 max-w-max shrink-0 min-w-0 overflow-hidden">
        <BreadcrumbList className="!gap-2 min-w-0 flex-nowrap">
          {showHome && (
            <>
              <BreadcrumbHome homePath={homePath} />
              <BreadcrumbSeparator />
            </>
          )}
          {items.map((item, i) => (
            <React.Fragment key={`${item.label}-${i}`}>
              <BreadcrumbItemPrimitive
                className={cn(
                  item.isCurrentPage
                    ? 'text-foreground'
                    : 'overflow-hidden min-w-0'
                )}
              >
                <BreadcrumbItemComponent item={item} />
              </BreadcrumbItemPrimitive>
              {i < items.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </BreadcrumbRoot>
      <div className="h-px flex-1 bg-foreground/30 mb-[calc(var(--breadcrumb)/2)-1px] shrink min-w-0 max-lg:hidden" />
      {showTopCategoryCta && customTopCategoryCta}
      {showMobileToggle && (
        <span className="lg:hidden">
          <ChevronDown className="size-4" />
        </span>
      )}
    </div>
  );
}

/**
 * Breadcrumb component with optional override functionality
 *
 * @param sidebar - The sidebar items used to generate breadcrumbs
 * @param overrides - Optional overrides to customize breadcrumb behavior
 *
 * @example
 * // Basic usage (no overrides)
 * <Breadcrumb sidebar={sidebarItems} />
 *
 * @example
 * // With custom items (replaces auto-generated breadcrumbs)
 * <Breadcrumb
 *   sidebar={sidebarItems}
 *   overrides={{
 *     items: [
 *       { label: 'Home', href: '/' },
 *       { label: 'API', href: '/api' },
 *       { label: 'Current Page', isCurrentPage: true }
 *     ]
 *   }}
 * />
 *
 * @example
 * // Hide home icon and top category CTA
 * <Breadcrumb
 *   sidebar={sidebarItems}
 *   overrides={{
 *     showHome: false,
 *     showTopCategoryCta: false
 *   }}
 * />
 *
 * @example
 * // Override the root path slug
 * <Breadcrumb
 *   sidebar={sidebarItems}
 *   overrides={{
 *     rootSlug: ['api', 'getting-started']
 *   }}
 * />
 *
 * @example
 * // Override specific path slugs
 * <Breadcrumb
 *   sidebar={sidebarItems}
 *   overrides={{
 *     pathSlugMap: {
 *       '/api': ['api', 'getting-started'],
 *       '/api/endpoints': ['api', 'endpoints'],
 *       '/docs': ['documentation', 'overview']
 *     }
 *   }}
 * />
 */
export default function Breadcrumb({
  sidebar,
  overrides,
}: {
  sidebar: SidebarItem[];
  overrides?: BreadcrumbOverrides;
}) {
  const { setOpenMobile, openMobile } = useSidebar();
  const pathname = usePathname();

  // Determine the slug based on overrides
  let slug: string[];
  if (overrides?.pathSlugMap?.[pathname]) {
    // Use path-specific override
    slug = overrides.pathSlugMap[pathname];
  } else if (pathname === '/') {
    // Use root slug override or default
    slug = overrides?.rootSlug ?? ['getting-started', 'introduction'];
  } else {
    // Use pathname-based slug (default behavior)
    slug = pathname.slice(1).split('/');
  }

  const { breadcrumb, topCategory } = getBreadcrumb(sidebar, slug);
  const lastItem = breadcrumb[breadcrumb.length - 1];

  // Use overrides if provided, otherwise use default behavior
  const showHome = overrides?.showHome ?? true;
  const showMobileToggle = overrides?.showMobileToggle ?? true;
  const showTopCategoryCta = overrides?.showTopCategoryCta ?? true;
  const customTopCategoryCta = overrides?.customTopCategoryCta;
  const onMobileToggle =
    overrides?.onMobileToggle ?? (() => setOpenMobile(!openMobile));
  const className = overrides?.className;
  const homePath = overrides?.homePath ?? '/';
  // If custom items are provided, use GenericBreadcrumb
  if (overrides?.items) {
    return (
      <GenericBreadcrumb
        items={overrides.items}
        showHome={showHome}
        className={className}
        onMobileToggle={onMobileToggle}
        showMobileToggle={showMobileToggle}
        showTopCategoryCta={showTopCategoryCta}
        customTopCategoryCta={customTopCategoryCta}
        homePath={homePath}
      />
    );
  }

  // Otherwise, use the sidebar-based breadcrumb
  return (
    <div
      onClick={onMobileToggle}
      className={cn(
        'flex max-lg:sticky z-50 top-0 items-center justify-between bg-background gap-4 lg:gap-2 max-lg:border-b border-border/50 h-breadcrumb max-lg:px-inner-sides font-mono max-lg:-mx-inner-sides text-foreground/70 text-xs 2xl:text-sm',
        className
      )}
    >
      <BreadcrumbRoot className="flex-3 max-w-max shrink-0 min-w-0 overflow-hidden">
        <BreadcrumbList className="!gap-2 min-w-0 flex-nowrap">
          {showHome && (
            <>
              <BreadcrumbHome />
              <BreadcrumbSeparator />
            </>
          )}
          {breadcrumb.map((item, i) => {
            const isCurrentPage = i === breadcrumb.length - 1;

            return (
              <React.Fragment key={item.slug.join('/')}>
                <BreadcrumbItemPrimitive
                  className={cn(
                    isCurrentPage
                      ? 'text-foreground'
                      : 'overflow-hidden min-w-0'
                  )}
                >
                  <BreadcrumbItem item={item} isCurrentPage={isCurrentPage} />
                </BreadcrumbItemPrimitive>
                {i < breadcrumb.length - 1 && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </BreadcrumbRoot>
      <div className="h-px flex-1 bg-foreground/30 mb-[calc(var(--breadcrumb)/2)-1px] shrink min-w-0 max-lg:hidden" />
      {showTopCategoryCta &&
        (customTopCategoryCta || (
          <TopCategoryCta
            topCategory={topCategory}
            lastItem={lastItem}
            className="max-lg:hidden"
          />
        ))}
      {showMobileToggle && (
        <span className="lg:hidden">
          <ChevronDown className="size-4" />
        </span>
      )}
    </div>
  );
}

export const BreadcrumbHome = ({ homePath = '/' }: { homePath?: string }) => {
  return (
    <BreadcrumbItemPrimitive
      className="flex items-center justify-center"
      onClick={e => e.stopPropagation()}
    >
      <BreadcrumbLink href={homePath} onClick={e => e.stopPropagation()}>
        <HomeIcon className="2xl:size-3.5 size-3 mb-[2px]" />
      </BreadcrumbLink>
    </BreadcrumbItemPrimitive>
  );
};

const isDownloadable = (item: SidebarItem) => {
  return (
    (item.type === 'file' && item.isMarkdownFile) ||
    (item.type === 'category' && item.hasPage && item.isMarkdownFile)
  );
};
export const TopCategoryCta = ({
  topCategory,
  lastItem,
  className,
}: {
  topCategory: SidebarItem | null;
  lastItem: SidebarItem;
  className?: string;
}) => {
  if (!topCategory) {
    return null;
  }

  if (lastItem.type === 'file' && lastItem.metadata?.cta) {
    return (
      <Button variant="tertiary" size="xs" asChild className={className}>
        <Link
          href={lastItem.metadata.cta.href}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Bullet size="sm" />
          <span className="uppercase font-mono font-semibold">
            {lastItem.metadata.cta.label}
          </span>
        </Link>
      </Button>
    );
  }

  if (isDownloadable(lastItem)) {
    return <CopyMarkdownButton lastItem={lastItem} />;
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <p className="text-xs 2xl:text-sm text-foreground/30 shrink-0 tracking-wide uppercase">
        [
        {topCategory.type === 'file'
          ? topCategory.metadata?.sidebar_label || topCategory.metadata?.title
          : topCategory.metadata?.label}
        ]
      </p>
    </div>
  );
};

const CopyMarkdownButton = ({ lastItem }: { lastItem: SidebarItem }) => {
  const handleCopyMarkdown = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isDownloadable(lastItem)) return;

    const slugPath = lastItem.slug.join('/');
    const filePath = `/${slugPath}.md`;

    try {
      const response = await fetch(filePath);
      if (response.ok) {
        const content = await response.text();
        await navigator.clipboard.writeText(content);
      }
    } catch (error) {
      console.error('Failed to copy markdown:', error);
    }
  };
  const { copyState, handleCopy } = useCopyButton({
    handleCopy: handleCopyMarkdown,
    value: '',
  });
  return (
    <Button
      variant="outline"
      size="xs"
      className="font-medium"
      onClick={handleCopy}
    >
      {copyState === 'copied' ? (
        <CheckIcon className="size-3 text-primary-soft" />
      ) : (
        <CopyIcon className="size-3" />
      )}
      <span className="font-medium">Copy markdown</span>
    </Button>
  );
};
