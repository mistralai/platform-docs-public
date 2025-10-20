'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Bullet } from '@/components/ui/bullet';
import { ArrowUp, ChevronDown } from 'lucide-react';

import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import type { SidebarItem, TocItem } from '@/schema/content/sidebar';
import { usePathname } from 'next/navigation';
import { findItemBySlug } from '@/lib/content/breadcrumb-stuff';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

interface TimelineItem {
  year: string;
  months: { month: string; href: string }[];
}

interface TocData {
  toc: TocItem[];
  headingIds: string[];
  filteredToc: TocItem[];
  shouldShow: boolean;
}

interface TableOfContentsProps {
  className?: string;
  maxDepth?: number;
  showBackToTop?: boolean;
  title?: string;
  tocItems?: TocItem[]; // For static TOC
  timelineData?: TimelineItem[]; // For timeline/changelog mode
  filters?: string[]; // Optional filters for timeline mode
  /** For tocs extracted based in the current slug and receive the sidebar as a prop */
  sidebar?: SidebarItem[];
  scrollToTopClassName?: string;
}

const createTocData = (
  items: TocItem[],
  options: { maxDepth: number; minItems: number }
): TocData => {
  const filteredToc = items.filter(item => item.depth <= options.maxDepth);
  return {
    toc: items,
    headingIds: items.map(item => item.id),
    filteredToc,
    shouldShow: filteredToc.length >= options.minItems,
  };
};

// Active Indicator Component
const TocActiveIndicator = () => (
  <div className="absolute -left-[3px] top-1/2 -translate-y-1/2 size-[7px] bg-primary z-10"></div>
);

// TOC Item Component
interface TocItemProps {
  item: TocItem;
  index: number;
  isActive: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

const TocItem = ({ item, index, isActive, onClick }: TocItemProps) => (
  <li key={`${item.id}-${index}`} className="m-0 overflow-visible relative">
    <a
      href={`#${item.id}`}
      onClick={e => onClick(e, item.id)}
      className={cn(
        'overflow-visible text-sm block py-1 text-balance transition-colors hover:text-foreground border-l border-muted line-clamp-2',
        isActive ? 'text-foreground font-medium' : 'text-muted-foreground',
        item.depth === 1 && 'font-medium'
      )}
      style={{ paddingLeft: `${4 + item.depth * 8}px` }}
    >
      {item.value}
      {isActive && <TocActiveIndicator />}
    </a>
  </li>
);

// Timeline Year Item Component
interface TimelineYearItemProps {
  yearItem: TimelineItem;
  isExpanded: boolean;
  onToggle: () => void;
}

const TimelineYearItem = ({
  yearItem,
  isExpanded,
  onToggle,
}: TimelineYearItemProps) => (
  <li>
    <div
      className="font-medium text-foreground text-sm relative cursor-pointer transition-colors flex items-center gap-1 w-fit px-2.5 py-0.5 rounded-md hover:bg-muted-foreground/5"
      onClick={onToggle}
    >
      <Bullet
        size="default"
        variant="primary"
        className="z-10 absolute -left-5 top-1"
      />
      {yearItem.year}
      <ChevronDown
        className={`w-3 h-3 transition-transform duration-200 ease-in-out ${
          isExpanded ? 'rotate-180' : 'rotate-0'
        }`}
      />
    </div>
    <div
      className={`overflow-hidden transition-opacity duration-300 ease-in-out ${
        isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <ul className="ml-2.5 space-y-1 pt-1">
        {yearItem.months.map((monthItem, monthIndex) => (
          <TimelineMonthItem key={monthIndex} monthItem={monthItem} />
        ))}
      </ul>
    </div>
  </li>
);

// Timeline Month Item Component
interface TimelineMonthItemProps {
  monthItem: { month: string; href: string };
}

const TimelineMonthItem = ({ monthItem }: TimelineMonthItemProps) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const targetId = monthItem.href.split('#')[1];
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const elementPosition = targetElement.offsetTop;
      const offsetPosition = elementPosition - 50;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      window.history.pushState(null, '', monthItem.href);
    }
  };

  return (
    <li>
      <a href={monthItem.href} onClick={handleClick}>
        <div className="text-sm capitalize text-muted-foreground hover:text-foreground transition-colors cursor-pointer py-1">
          {monthItem.month}
        </div>
      </a>
    </li>
  );
};

// Main Component
export function TableOfContents({
  className,
  maxDepth = 3,
  showBackToTop = true,
  title = 'Contents',
  tocItems,
  timelineData,
  filters,
  sidebar,
  scrollToTopClassName,
}: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | undefined>();
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [expandedYear, setExpandedYear] = useState<string | null>(
    timelineData && timelineData.length > 0 ? timelineData[0].year : null
  );

  const pathname = usePathname();

  const tocData = useMemo(() => {
    if (tocItems) {
      const data = createTocData(tocItems, { maxDepth, minItems: 1 });
      setActiveId(data.filteredToc[0]?.id);
      return data;
    } else if (sidebar) {
      const slug = pathname === '/' ? [] : pathname.slice(1).split('/');
      const currentItem = findItemBySlug(sidebar, slug);
      const toc = currentItem?.type === 'file' ? currentItem.toc : [];
      const data = createTocData(toc || [], { maxDepth, minItems: 1 });
      setActiveId(data.filteredToc[0]?.id);
      return data;
    } else
      return {
        toc: [],
        headingIds: [],
        filteredToc: [],
        shouldShow: false,
      };
  }, [tocItems, sidebar, pathname]);

  // Track active heading and scroll position
  useEffect(() => {
    if (!timelineData && tocData.headingIds.length === 0) return;

    // get the --header variable from the document defined in globals.css
    const root = document.documentElement;

    // Get computed styles for :root
    const styles = getComputedStyle(root);

    // Read the variable
    const header = styles.getPropertyValue('--header').trim(); // 4.5rem

    const headerHeight = parseInt(header.replace('rem', ''));
    // get the font-size of the body
    const bodyFontSize = getComputedStyle(document.body).getPropertyValue(
      'font-size'
    );

    const bodyFontSizeInPixels = parseInt(bodyFontSize.replace('px', ''));
    const headerHeightInPixels = headerHeight * bodyFontSizeInPixels + 64;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (showBackToTop) {
        setShowScrollToTop(scrollY > headerHeightInPixels);
      }

      let activeHeading = '';

      // Handle timeline mode
      if (timelineData) {
        for (const yearItem of timelineData) {
          for (const monthItem of yearItem.months) {
            const targetId = monthItem.href.split('#')[1];

            const element = document.getElementById(targetId);
            if (element) {
              if (checkIfHigherThanMaxDepth(element, maxDepth)) {
                continue;
              }
              const rect = element.getBoundingClientRect();
              if (rect.top <= headerHeightInPixels) {
                activeHeading = targetId;
              }
            }
          }
        }
        // Set first timeline item as active if at top
        if (
          !activeHeading &&
          timelineData.length > 0 &&
          timelineData[0].months.length > 0
        ) {
          activeHeading = timelineData[0].months[0].href.split('#')[1];
        }
      }

      // Handle standard TOC mode (unchanged)
      if (!activeHeading && tocData.headingIds.length > 0) {
        for (const id of tocData.headingIds) {
          const element = document.getElementById(id);
          if (element) {
            if (checkIfHigherThanMaxDepth(element, maxDepth)) {
              continue;
            }
            const rect = element.getBoundingClientRect();
            if (rect.top <= headerHeightInPixels) {
              activeHeading = id;
            }
          }
        }
        if (!activeHeading) {
          activeHeading = tocData.headingIds[0];
        }
      }

      setActiveId(activeHeading);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocData.headingIds, showBackToTop, timelineData]);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTocClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -80;
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      window.history.pushState(null, '', `#${id}`);
    }
  };

  if (!tocData.shouldShow && !timelineData) {
    return null;
  }

  return (
    <aside className={cn('flex flex-col h-full justify-between', className)}>
      <nav className="space-y-4 pb-40 sticky top-[calc(var(--header)+3rem)]">
        <h4 className="text-xs 2xl:text-sm font-semibold mb-3 font-mono uppercase text-foreground/70">
          {title}
        </h4>

        {/* Standard TOC Mode */}
        {tocData.filteredToc.length > 0 && (
          <ul className="flex flex-col space-y-1">
            {tocData.filteredToc.map((item, index) => (
              <TocItem
                key={`${item.id}-${index}`}
                item={item}
                index={index}
                isActive={activeId === item.id}
                onClick={handleTocClick}
              />
            ))}
          </ul>
        )}

        {/* Timeline Mode */}
        {timelineData && (
          <div className="flex">
            <div className="w-4">
              <div className="w-px h-[calc(100%-1rem)] translate-y-1 bg-muted" />
            </div>
            <ul className="flex flex-col space-y-3">
              {timelineData.map((yearItem, yearIndex) => (
                <TimelineYearItem
                  key={yearIndex}
                  yearItem={yearItem}
                  isExpanded={expandedYear === yearItem.year}
                  onToggle={() =>
                    setExpandedYear(prev =>
                      prev === yearItem.year ? null : yearItem.year
                    )
                  }
                />
              ))}
            </ul>
          </div>
        )}

        {/* Filters for Timeline Mode */}
        <Filters filters={filters} />
      </nav>
      {/* Scroll to Top Button */}
      {showBackToTop && (
        <div
          className={cn(
            'pt-10 pb-8 transition-[transform,opacity] sticky bottom-0 max-w-max duration-150 ease-in-out',
            showScrollToTop
              ? 'opacity-100 scale-100 blur-0 pointer-events-auto'
              : 'opacity-0 scale-90 blur-sm pointer-events-none',
            scrollToTopClassName
          )}
        >
          <Button
            size="sm"
            variant="outline"
            className="self-end font-mono uppercase !text-sm flex gap-2.5 items-center"
            onClick={handleScrollToTop}
          >
            <Bullet size="default" />
            Go to Top
            <ArrowUp className="w-4 h-4" />
          </Button>
        </div>
      )}
    </aside>
  );
}

const checkIfHigherThanMaxDepth = (element: HTMLElement, maxDepth: number) => {
  const tagName = element.tagName.toLowerCase();
  const depth = parseInt(tagName.replace('h', ''));
  return depth > maxDepth;
};

const _Filters = (props: TableOfContentsProps) => {
  const { filters } = props;
  const [selectedFilters, setSelectedFilters] = useQueryState(
    'filters',
    parseAsArrayOf(parseAsString).withDefault([])
  );
  const hasFiltersApplied = selectedFilters.length > 0;
  return (
    <>
      {filters && filters.length > 0 && (
        <div className="flex flex-col gap-1.5 pt-2">
          <div className="flex gap-1.5 items-center">
            <h4 className="text-xs 2xl:text-sm font-semibold font-mono uppercase text-foreground/70">
              Filters
            </h4>
            <Button
              className={cn(
                'text-xs font-semibold transition-[transform,opacity] duration-100 font-mono uppercase text-foreground/70 cursor-pointer py-1 h-fit',
                {
                  'opacity-100 pointer-events-auto scale-100':
                    hasFiltersApplied,
                  'opacity-0 pointer-events-none scale-90': !hasFiltersApplied,
                }
              )}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedFilters([])}
            >
              Clear
            </Button>
          </div>
          {filters.map(type => (
            <div key={type}>
              <Button
                className="uppercase cursor-pointer font-mono text-xs"
                variant={selectedFilters.includes(type) ? 'default' : 'outline'}
                size="sm"
                onClick={() =>
                  setSelectedFilters(prev =>
                    prev.includes(type)
                      ? prev.filter(filter => filter !== type)
                      : [...prev, type]
                  )
                }
              >
                {type}
              </Button>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

const Filters = (props: TableOfContentsProps) => {
  return (
    <Suspense fallback={<div className="flex flex-col gap-1.5 pt-2"></div>}>
      <NuqsAdapter>
        <_Filters {...props} />
      </NuqsAdapter>
    </Suspense>
  );
};
