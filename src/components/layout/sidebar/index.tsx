'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { SearchInput } from './search-input';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';
import { ActiveIndicator } from '@/components/ui/active-indicator';
import * as Collapsible from '@radix-ui/react-collapsible';
import { cn } from '@/lib/utils';
import {
  useExpandedCategories as useSidebarExpandedCategories,
  ExpandedCategoriesOptions,
} from '@/hooks/use-expanded-categories';
import { getHrefSlugs } from '@/lib/urls';
import { useActiveElementHash } from '@/app/(api)/components/hash-auto-change';
import { AnyDocsMetadata } from '@/schema';

export type SideBarTreeNode = {
  clickable: boolean;
  label: string;
  href?: string;
  children: SideBarTreeNode[];
  pagination: {
    prev?: {
      href: string;
      title: string;
    };
    next?: {
      href: string;
      title: string;
    };
  };
  metadata?: AnyDocsMetadata | null;
};

const isPathContained = (
  containerPath: string[],
  targetPath: string[]
): boolean => {
  if (containerPath.length >= targetPath.length) return false;
  return containerPath.every((segment, index) => segment === targetPath[index]);
};

// Context for expanded categories state
type ExpandedCategoriesContextType<T extends SideBarTreeNode> = {
  expandedCategories: Set<string>;
  isHydrated: boolean;
  overridedExpandedCategories: ExpandedCategoriesOptions['overridedExpandedCategories'];
  renderItem?: (props: { item: T; isActive: boolean }) => React.ReactNode;
  lastActiveItem: T | null;
  setLastActiveItem: (item: T | null) => void;
  hashResponsive: boolean;
};

const ExpandedCategoriesContext =
  React.createContext<ExpandedCategoriesContextType<SideBarTreeNode> | null>(
    null
  );

// Custom hook to use the expanded categories context
const useExpandedCategories = () => {
  const context = React.useContext(ExpandedCategoriesContext);
  if (!context) {
    throw new Error(
      'useExpandedCategories must be used within DocsSidebarProvider'
    );
  }
  return context;
};

export const DocsSidebarProvider = <T extends SideBarTreeNode>({
  children,
  sidebar,
  expandedCategoriesOptions,
  renderItem,
  hashResponsive,
}: {
  children: React.ReactNode;
  sidebar: T[];
  expandedCategoriesOptions?: ExpandedCategoriesOptions;
  renderItem?: (props: { item: T; isActive: boolean }) => React.ReactNode;
  hashResponsive?: boolean;
}) => {
  const { expandedCategories, isHydrated } = useSidebarExpandedCategories(
    sidebar,
    expandedCategoriesOptions
  );
  const [lastActiveItem, setLastActiveItem] = React.useState<T | null>(null);

  const contextValue = useMemo(
    () => ({
      expandedCategories,
      isHydrated,
      overridedExpandedCategories:
        expandedCategoriesOptions?.overridedExpandedCategories ?? {},
      renderItem,
      lastActiveItem,
      setLastActiveItem,
      hashResponsive: hashResponsive,
    }),
    [
      expandedCategories,
      isHydrated,
      expandedCategoriesOptions?.overridedExpandedCategories ?? {},
      renderItem,
      lastActiveItem,
      hashResponsive,
    ]
  );

  return (
    <ExpandedCategoriesContext.Provider
      value={contextValue as ExpandedCategoriesContextType<SideBarTreeNode>}
    >
      {children}
    </ExpandedCategoriesContext.Provider>
  );
};

const SidebarFileItem = <T extends SideBarTreeNode>({
  item,
  className,
  isActive,
}: {
  item: T;
  isActive: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const { setOpenMobile } = useSidebar();
  const { renderItem } = useExpandedCategories();
  const Content = renderItem ?? (props => props.item.label);
  const href = item.href!;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn('group', className)}
      >
        <Link href={href} onClick={() => setOpenMobile(false)}>
          <Content item={item as T} isActive={isActive} />
          <ActiveIndicator className="group-data-[state=on]:block hidden ml-auto pr-1" />
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarFirstLevelCategoryItem = <T extends SideBarTreeNode>({
  item,
}: {
  item: SideBarTreeNode;
}) => {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{item.label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {item.children.map((child, index) => (
            <SidebarItem<SideBarTreeNode>
              key={index}
              item={child as SideBarTreeNode}
            />
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

const SidebarSubCategory = <T extends SideBarTreeNode>({
  item,
  submenu,
}: {
  item: SideBarTreeNode;
  submenu?: boolean;
}) => {
  const { setOpenMobile } = useSidebar();
  const {
    expandedCategories,
    overridedExpandedCategories,
    renderItem,
    hashResponsive,
  } = useExpandedCategories();

  const pathnameWithoutHash = usePathname();
  const pathname = usePathnameWithHash({ hashResponsive });
  const isCategoryOverridedActive =
    !!item.href &&
    overridedExpandedCategories[pathnameWithoutHash]?.some(
      slug => slug.join('/') === getHrefSlugs(item.href!).join('/')
    );
  const isCategoryOverridedActiveHash =
    !!item.href &&
    overridedExpandedCategories[pathname]?.some(
      slug => slug.join('/') === getHrefSlugs(item.href!).join('/')
    );
  const isCategoryActive =
    pathname === item.href ||
    (hashResponsive
      ? isCategoryOverridedActiveHash
      : isCategoryOverridedActive);

  const currentSlugs = overridedExpandedCategories[pathname]
    ? overridedExpandedCategories[pathname]
    : [getHrefSlugs(pathname)];

  const hasActiveDescendant = currentSlugs.some(currentSlug =>
    isPathContained(getHrefSlugs(item.href!), currentSlug)
  );

  const [isExpanded, setIsExpanded] = React.useState(
    expandedCategories.has(item.href!) ||
      isCategoryActive ||
      hasActiveDescendant
  );

  React.useEffect(() => {
    const shouldExpand =
      isCategoryActive ||
      expandedCategories.has(item.href!) ||
      item.href! === pathname ||
      hasActiveDescendant ||
      (hashResponsive && pathname.startsWith(item.href!));
    if (shouldExpand) {
      setIsExpanded(true);
    }
  }, [
    isCategoryActive,
    hasActiveDescendant,
    expandedCategories,
    pathnameWithoutHash,
  ]);
  const UsedSidebarItem = submenu ? SidebarMenuItem : SidebarMenuSubItem;
  const Content = renderItem ?? (props => props.item.label);
  return (
    <Collapsible.Root
      className="group/collapsible"
      open={isExpanded}
      onOpenChange={setIsExpanded}
    >
      <UsedSidebarItem>
        <div className="flex items-center">
          {item.href ? (
            <div className="relative w-full h-full">
              <SidebarMenuButton
                asChild
                className="flex-1"
                isActive={isCategoryActive}
              >
                <Link
                  onClick={() => setOpenMobile(false)}
                  className="flex-1 group w-full h-full"
                  href={item.href!}
                  data-state={isCategoryActive ? 'on' : 'off'}
                >
                  <Content item={item as T} isActive={isCategoryActive} />
                </Link>
              </SidebarMenuButton>
              <Collapsible.Trigger asChild>
                <button
                  onClick={e => e.stopPropagation()}
                  className="p-1 pr-2 hover:text-foreground text-foreground/50 rounded-md ml-1 absolute right-0 top-1/2 -translate-y-1/2"
                >
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 transition-transform',
                      isExpanded && 'rotate-90'
                    )}
                  />
                </button>
              </Collapsible.Trigger>
            </div>
          ) : (
            <Collapsible.Trigger asChild>
              <SidebarMenuButton
                className="flex-1 relative"
                isActive={isCategoryActive}
              >
                <Content item={item as T} isActive={isCategoryActive} />
                <ChevronRight
                  className={cn(
                    'h-4 w-4 ml-auto transition-transform',
                    isExpanded && 'rotate-90'
                  )}
                />
              </SidebarMenuButton>
            </Collapsible.Trigger>
          )}
        </div>
        <Collapsible.Content>
          <SidebarMenuSub className="mr-0 pr-0">
            {item.children.map((child, index) => (
              <SidebarItem<SideBarTreeNode>
                item={child as SideBarTreeNode}
                key={index}
                submenu
              />
            ))}
          </SidebarMenuSub>
        </Collapsible.Content>
      </UsedSidebarItem>
    </Collapsible.Root>
  );
};

const DocsSidebarContent = <T extends SideBarTreeNode>({
  sidebar,
  renderItem,
}: {
  sidebar: T[];
  renderItem?: (props: { item: T; isActive: boolean }) => React.ReactNode;
}) => {
  const UsedSidebarItem = renderItem ? SidebarItem<T> : SidebarFileItem<T>;
  const [hasScrollDown, setHasScrollDown] = React.useState(false);

  React.useEffect(() => {
    const element = document.querySelector(
      '[data-slot="sidebar"]'
    ) as HTMLElement;

    const handleScroll = () => {
      if (!element) return;

      const { scrollTop, scrollHeight, clientHeight } = element;

      setHasScrollDown(scrollTop + clientHeight < scrollHeight - 32);
    };

    if (element) {
      handleScroll();

      element.addEventListener('scroll', handleScroll);

      const resizeObserver = new ResizeObserver(handleScroll);
      resizeObserver.observe(element);

      return () => {
        element.removeEventListener('scroll', handleScroll);
        resizeObserver.disconnect();
      };
    }
  }, []);

  return (
    <>
      <SidebarHeader className="max-lg:hidden">
        <SearchInput />
      </SidebarHeader>
      <SidebarContent>
        {sidebar.map((item, index) => {
          if (!item.children.length) {
            return (
              <SidebarGroup key={index}>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <UsedSidebarItem item={item as T} isActive={false} />
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            );
          }
          return <SidebarFirstLevelCategoryItem key={index} item={item as T} />;
        })}
      </SidebarContent>

      {/* Bottom gradient with down arrow */}
      <div
        aria-hidden="true"
        className="pointer-events-none h-14 w-full bg-gradient-to-t from-background lg:from-muted to-transparent shrink-0 sticky bottom-0 flex justify-center items-center"
      >
        <div
          className={cn(
            'p-1 rounded-lg border border-border bg-background transition-opacity duration-300',
            hasScrollDown ? 'opacity-100' : 'opacity-0'
          )}
        >
          <ChevronDown className="size-4 text-foreground/50" />
        </div>
      </div>
    </>
  );
};

const isItemActive = (
  pathname: string,
  itemHref: string | undefined,
  customMatches?: string[]
) => {
  if (!itemHref || itemHref === '/') return false;

  // Default: exact match
  if (pathname === itemHref) return true;

  // Custom matches (e.g., for models)
  if (customMatches?.some(match => pathname.includes(match))) {
    return true;
  }

  // Optional: Add more generic logic here if needed
  return false;
};

const SidebarItem = <T extends SideBarTreeNode>({
  item,
  submenu,
}: {
  item: T;
  submenu?: boolean;
}) => {
  const { overridedExpandedCategories, setLastActiveItem, hashResponsive } =
    useExpandedCategories();

  const pathname = usePathnameWithHash({ hashResponsive });

  if (!item.children.length) {
    const isOverridedExpanded =
      !!item.href &&
      overridedExpandedCategories[pathname.split('#')[0]]?.some(
        slug =>
          slug.join('/') === getHrefSlugs(item.href?.split('#')[0]!).join('/')
      );

    const overridedHashActive =
      isOverridedExpanded &&
      pathname.split('#')[1] === item.href?.split('#')[1];
    // if is overrided expanded, and the hash is not the same as the item href, return false

    // Define custom matches for special cases
    const customMatches = item.href?.startsWith('/models') ? ['models'] : [];

    const isActive =
      isItemActive(pathname, item.href, customMatches) ||
      (hashResponsive ? overridedHashActive : isOverridedExpanded);
    return <SidebarFileItem<T> item={item} isActive={isActive} />;
  }

  return <SidebarSubCategory<T> item={item} submenu={submenu} />;
};

export const DocsSidebar = <T extends SideBarTreeNode>({
  sidebar,
  expandedCategoriesOptions,
  renderItem,
  hashResponsive = false,
}: {
  sidebar: T[];
  expandedCategoriesOptions?: ExpandedCategoriesOptions;
  renderItem?: (props: { item: T; isActive: boolean }) => React.ReactNode;
  hashResponsive?: boolean;
}) => {
  return (
    <DocsSidebarProvider<T>
      renderItem={renderItem}
      sidebar={sidebar}
      expandedCategoriesOptions={expandedCategoriesOptions}
      hashResponsive={hashResponsive}
    >
      <DocsSidebarContent<T> sidebar={sidebar as T[]} renderItem={renderItem} />
    </DocsSidebarProvider>
  );
};

const usePathnameWithHash = ({
  hashResponsive,
}: {
  hashResponsive: boolean;
}) => {
  const pathname = usePathname();
  const params = useParams();
  const [hash, setHash] = React.useState('');
  const activeElementHashState = useActiveElementHash();
  const activeElementHash = activeElementHashState?.activeElementHash;

  React.useEffect(() => {
    const handleHashChange = () => {
      setHash(window.location.hash);
    };
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [params]);

  const fullPathname = useMemo(() => {
    if (hashResponsive && (activeElementHash || hash)) {
      return pathname + (activeElementHash ?? hash);
    }
    return pathname;
  }, [pathname, hash, activeElementHash]);
  return fullPathname;
};
