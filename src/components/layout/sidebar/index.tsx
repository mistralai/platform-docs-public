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
import { ArrowUpRight } from 'lucide-react';
import { ChevronRightIcon, ChevronDownIcon } from '@/components/icons/pixel';
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
import { getActiveSidebarSections } from '@/schema/content/header';

export type SideBarTreeNode = {
  clickable: boolean;
  label: string;
  href?: string;
  download?: {
    filename: string;
  };
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
  isExternalLink?: boolean;
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
  forceExpandAll?: boolean;
  toggleCategory: (href: string, isOpen: boolean, accordion?: boolean) => void;
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
  forceExpandAll,
}: {
  children: React.ReactNode;
  sidebar: T[];
  expandedCategoriesOptions?: ExpandedCategoriesOptions;
  renderItem?: (props: { item: T; isActive: boolean }) => React.ReactNode;
  hashResponsive?: boolean;
  forceExpandAll?: boolean;
}) => {
  const { expandedCategories, isHydrated, toggleCategory } = useSidebarExpandedCategories(
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
      forceExpandAll: forceExpandAll,
      toggleCategory,
    }),
    [
      expandedCategories,
      isHydrated,
      expandedCategoriesOptions?.overridedExpandedCategories ?? {},
      renderItem,
      lastActiveItem,
      hashResponsive,
      forceExpandAll,
      toggleCategory,
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

import { MethodBadge } from '@/app/(api)/components/method-badge';

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
  const Content = renderItem ?? (props => {
    const it = props.item as any;
    if (it.method) {
      return (
        <div className="flex items-center gap-2 min-w-0 w-full">
           <MethodBadge active={isActive}>{it.method}</MethodBadge>
           <span className="truncate leading-tight mt-[1px]">{it.label}</span>
        </div>
      );
    }
    return <span className="truncate">{it.label}</span>;
  });
  const href = item.href!;
  const itemRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    if (isActive && itemRef.current) {
      // Small timeout to allow the sidebar to render and open collapsibles
      setTimeout(() => {
        itemRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [isActive]);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn('group', className)}
      >
        <Link
          ref={itemRef}
          href={href}
          onClick={() => setOpenMobile(false)}
          {...(item.download ? { download: item.download.filename } : {})}
        >
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
  const containerId = item.label.toLowerCase().replace(/\s+/g, '-');
  const pathname = usePathname();
  const isActive = item.clickable && item.href ? pathname === item.href : false;

  return (
    <SidebarGroup id={containerId}>
      <SidebarGroupLabel className="flex justify-between items-center w-full group/label pr-1">
        {item.clickable && item.href ? (
          <Link
            className={cn(
              "flex items-center gap-1.5 transition-colors",
              isActive ? "text-foreground font-bold" : "hover:text-foreground"
            )}
            href={item.href}
          >
            {item.label}
            {(item.label === 'API Reference' || item.isExternalLink) && <ArrowUpRight className="size-3.5 opacity-50 hover:opacity-100" />}
          </Link>
        ) : (
          item.label
        )}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {item.children.map((child, index) => (
            <SidebarItem<SideBarTreeNode>
              key={index}
              item={child as SideBarTreeNode}
              submenu={true}
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
    forceExpandAll,
    toggleCategory,
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

  const hasActiveDescendant = !!item.href && currentSlugs.some(currentSlug =>
    isPathContained(getHrefSlugs(item.href!), currentSlug)
  );

  const categoryId = item.href || item.label;

  const [isExpanded, setIsExpanded] = React.useState(
    forceExpandAll ||
    expandedCategories.has(categoryId) ||
    isCategoryActive ||
    hasActiveDescendant
  );

  const lastPathname = React.useRef(pathname);

  React.useEffect(() => {
    if (forceExpandAll) {
      setIsExpanded(true);
      return;
    }

    const routeIsActive =
      isCategoryActive ||
      hasActiveDescendant ||
      (!!item.href && item.href === pathname) ||
      (!!item.href && hashResponsive && pathname.startsWith(item.href));

    if (pathname !== lastPathname.current) {
      lastPathname.current = pathname;
      if (routeIsActive) {
        setIsExpanded(true);
        return;
      }
    }

    setIsExpanded(expandedCategories.has(categoryId));
  }, [
    forceExpandAll,
    pathname,
    isCategoryActive,
    hasActiveDescendant,
    expandedCategories,
    categoryId,
    hashResponsive,
    item.href,
  ]);
  const UsedSidebarItem = submenu ? SidebarMenuItem : SidebarMenuSubItem;
  const Content = renderItem ?? (props => props.item.label);
  const itemRef = React.useRef<HTMLAnchorElement>(null);

  React.useEffect(() => {
    if (isCategoryActive && itemRef.current) {
      setTimeout(() => {
        itemRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [isCategoryActive]);

  return (
    <Collapsible.Root
      className="group/collapsible"
      open={isExpanded}
      onOpenChange={(open) => {
        setIsExpanded(open);
        toggleCategory(categoryId, open, false);
      }}
    >
      <UsedSidebarItem>
        <div className="flex items-center">
          <div className="relative w-full h-full flex items-center">
            {item.href && item.clickable !== false ? (
              <SidebarMenuButton
                asChild
                className="flex-1 pr-8"
                isActive={isCategoryActive}
              >
                <Link
                  ref={itemRef}
                  onClick={() => {
                    setOpenMobile(false);
                    toggleCategory(categoryId, !isExpanded, true);
                  }}
                  className="flex-1 group w-full h-full"
                  href={item.href}
                  data-state={isCategoryActive ? 'on' : 'off'}
                >
                  <Content item={item as T} isActive={isCategoryActive} />
                </Link>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                className="flex-1 pr-8"
                isActive={isCategoryActive}
                onClick={() => {
                  toggleCategory(categoryId, !isExpanded, true);
                }}
              >
                <Content item={item as T} isActive={isCategoryActive} />
              </SidebarMenuButton>
            )}
            <Collapsible.Trigger asChild>
              <button
                onClick={e => e.stopPropagation()}
                className="py-0.5 pl-1 pr-2 hover:text-foreground text-foreground/50 rounded-md ml-1 absolute right-0 top-1/2 -translate-y-1/2 h-full flex items-center justify-center cursor-pointer touch-manipulation z-10"
              >
                <ChevronRightIcon
                  className={cn(
                    'h-4 w-4 transition-transform',
                    isExpanded && 'rotate-90'
                  )}
                />
              </button>
            </Collapsible.Trigger>
          </div>
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
  children,
}: {
  sidebar: T[];
  renderItem?: (props: { item: T; isActive: boolean }) => React.ReactNode;
  children?: React.ReactNode;
}) => {
  const pathname = usePathname();
  const UsedSidebarItem = renderItem ? SidebarItem<T> : SidebarFileItem<T>;
  const [hasScrollDown, setHasScrollDown] = React.useState(false);

  const filteredSidebar = React.useMemo(() => {
    if (!pathname) return sidebar;
    const activeSections = getActiveSidebarSections(pathname);
    return sidebar.filter(item => activeSections.includes(item.label));
  }, [sidebar, pathname]);

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
      <SidebarHeader className="max-lg:hidden" />
      <SidebarContent>
        {children}
        {filteredSidebar.map((item, index) => {
          if (!item.children || !item.children.length) {
            return (
              <SidebarGroup key={index}>
                <SidebarGroupLabel className="flex justify-between items-center w-full group/label pr-1">
                  {item.clickable && item.href ? (
                    <Link className="flex items-center gap-1.5" href={item.href}>
                      {item.label}
                      {item.isExternalLink && <ArrowUpRight className="size-3.5 opacity-50 hover:opacity-100" />}
                    </Link>
                  ) : (
                    item.label
                  )}
                </SidebarGroupLabel>
              </SidebarGroup>
            );
          }

          // Check if we are in one of the new sections
          const isNewSection =
            pathname?.startsWith('/mistral-vibe') ||
            pathname?.startsWith('/studio-api') ||
            pathname?.startsWith('/models') ||
            pathname?.startsWith('/admin') ||
            pathname?.startsWith('/getting-started') ||
            pathname?.startsWith('/resources') ||
            pathname?.startsWith('/guides') ||
            pathname?.startsWith('/community');

          if (isNewSection) {
            const isSectionActive = item.clickable && item.href ? pathname === item.href : false;
            return (
              <SidebarGroup key={index}>
                <SidebarGroupLabel className="cursor-pointer">
                  {item.clickable && item.href ? (
                    <Link
                      href={item.href}
                      className={cn(
                        "transition-colors cursor-pointer",
                        isSectionActive ? "text-foreground font-bold" : "hover:text-foreground"
                      )}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    item.label
                  )}
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {item.children.map((child, childIndex) => (
                      <SidebarItem<T>
                        key={childIndex}
                        item={child as T}
                        submenu={true}
                      />
                    ))}
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
          <ChevronDownIcon className="size-4 text-foreground/50" />
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

    const isActive =
      isItemActive(pathname, item.href) ||
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
  forceExpandAll = false,
  children,
}: {
  sidebar: T[];
  expandedCategoriesOptions?: ExpandedCategoriesOptions;
  renderItem?: (props: { item: T; isActive: boolean }) => React.ReactNode;
  hashResponsive?: boolean;
  forceExpandAll?: boolean;
  children?: React.ReactNode;
}) => {
  return (
    <DocsSidebarProvider<T>
      renderItem={renderItem}
      sidebar={sidebar}
      expandedCategoriesOptions={expandedCategoriesOptions}
      hashResponsive={hashResponsive}
      forceExpandAll={forceExpandAll}
    >
      <DocsSidebarContent<T> sidebar={sidebar as T[]} renderItem={renderItem}>
        {children}
      </DocsSidebarContent>
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
