'use client';

import * as React from 'react';
import {
  fullCookbooks,
  allUseCases,
  allIntegrations,
} from '@/schema/cookbook/data-formatted';
import { useState, Suspense, useEffect, useRef } from 'react';
import { useQueryState, parseAsString } from 'nuqs';
import { Combobox, type ComboboxOption } from '@/components/ui/combobox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import { Cookbook } from '@/schema/cookbook';
import { LinkPrefetch } from '@/components/common/link-prefetch';
import { cn } from '@/lib/utils';
import { SearchIcon } from '@/components/icons/pixel';
import ChevronsUpDown from '@/components/icons/pixel/chevrons-up-down';
import ScrollGradient from '@/components/common/scroll-gradient';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const MAX_TAGS = 2;

interface CookbookTag {
  label: string;
  variant: 'yellow' | 'orange';
}

function FilterTabsUI({
  useCaseFilter,
  integrationFilter,
  setUseCaseFilter,
  setIntegrationFilter,
  searchQuery,
  setSearchQuery,
  totalCount,
}: {
  useCaseFilter: string | null;
  integrationFilter: string | null;
  setUseCaseFilter: (value: string | null) => void;
  setIntegrationFilter: (value: string | null) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  totalCount: number;
}) {
  const resetFilters = () => {
    setUseCaseFilter('');
    setIntegrationFilter('');
    setSearchQuery('');
  };

  // Transform data for combobox
  const integrationOptions: ComboboxOption[] = allIntegrations.map(
    integration => ({
      value: integration,
      label: integration,
    })
  );

  const useCaseOptions: ComboboxOption[] = allUseCases.map(useCase => ({
    value: useCase,
    label: useCase,
  }));

  // Handle filter changes with clearing logic
  const handleIntegrationChange = (value: string | null) => {
    setIntegrationFilter(value || '');
    if (value) setUseCaseFilter('');
  };

  const handleUseCaseChange = (value: string | null) => {
    setUseCaseFilter(value || '');
    if (value) setIntegrationFilter('');
  };

  // Custom tab-styled triggers
  const createTabTrigger = (
    label: string,
    isActive: boolean,
    showChevron = true
  ) => (
    <button
      className={cn(
        'inline-flex items-center whitespace-nowrap justify-center gap-2 rounded-t-md font-semibold font-mono uppercase transition-colors border border-b-0 bg-transparent',
        'border-secondary text-foreground/50 px-2.5 py-1 text-xs 2xl:text-sm',
        isActive ? 'bg-secondary text-foreground/70' : 'hover:bg-secondary/10'
      )}
    >
      {label}
      {showChevron && <ChevronsUpDown className="h-3 w-3 opacity-50" />}
    </button>
  );

  return (
    <div className="w-full group/tabs flex gap-3 justify-start items-end border-b border-secondary">
      {/* All Tab */}
      <ScrollGradient
        direction="x"
        scrollContainerClassName="flex gap-1 shrink min-w-0"
        className="shrink min-w-0"
      >
        <button
          onClick={resetFilters}
          className={cn(
            'inline-flex items-center whitespace-nowrap justify-center gap-2 rounded-t-md font-semibold font-mono uppercase transition-colors border border-b-0 bg-transparent',
            'border-secondary text-foreground/50 px-2.5 py-1 text-xs 2xl:text-sm',
            !useCaseFilter && !integrationFilter && !searchQuery
              ? 'bg-secondary text-foreground/70'
              : 'hover:bg-secondary/10'
          )}
        >
          All ({totalCount})
        </button>

        {/* Integration Combobox Tab */}
        <Combobox
          options={integrationOptions}
          value={integrationFilter || ''}
          onValueChange={handleIntegrationChange}
          placeholder="Integration"
          searchPlaceholder="Search integrations..."
          emptyText="No integration found."
          trigger={createTabTrigger(
            integrationFilter || 'Integration',
            !!integrationFilter
          )}
          matchTriggerWidth={false}
          popoverWidth="w-[220px]"
          width="w-auto"
          align="center"
        />

        {/* Use Case Combobox Tab */}
        <Combobox
          options={useCaseOptions}
          value={useCaseFilter || ''}
          onValueChange={handleUseCaseChange}
          placeholder="Use Case"
          searchPlaceholder="Search use cases..."
          emptyText="No use case found."
          trigger={createTabTrigger(
            useCaseFilter || 'Use Case',
            !!useCaseFilter
          )}
          matchTriggerWidth={false}
          width="w-auto"
          popoverWidth="w-[220px]"
          align="center"
        />
      </ScrollGradient>

      {/* Search Input styled as Tab */}
      <div className="relative ml-auto min-w-[200px]">
        <div
          className={cn(
            'relative flex items-center rounded-t-md border border-b-0 bg-input transition-colors',
            'border-secondary px-2.5 py-1',
            searchQuery && !useCaseFilter && !integrationFilter
              ? 'bg-secondary'
              : ''
          )}
        >
          <SearchIcon className="h-3 w-3 text-muted-foreground mr-2 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={cn(
              'flex-1 bg-transparent border-none outline-none font-mono uppercase text-xs 2xl:text-sm font-semibold text-foreground/70 placeholder:text-foreground/30',
              'focus:ring-0 focus:outline-none h-4'
            )}
          />
        </div>
      </div>
    </div>
  );
}

// Cookbook table row component with full state persistence
function CookbookTableRow({
  cookbook,
  useCaseFilter,
  integrationFilter,
}: {
  cookbook: Cookbook;
  useCaseFilter?: string | null;
  integrationFilter?: string | null;
}) {
  const allTags = [
    ...cookbook.useCases.map(tag => ({
      label: tag,
      variant: 'yellow' as const,
    })),
    ...cookbook.integrations.map(tag => ({
      label: tag,
      variant: 'orange' as const,
    })),
  ];

  return (
    <TableRow
      data-cookbook-slug={cookbook.slug}
      className={cn('transition-colors duration-200 hover:bg-accent/50')}
    >
      {/* Title */}
      <TableCell className="font-medium p-3 max-w-80">
        <div className="truncate text-foreground hover:text-primary-soft transition-colors">
          <LinkPrefetch
            prefetch="onHover"
            onClick={() => {
              // Save all filter states before navigation
              if (typeof window !== 'undefined') {
                // Save scroll position
                const container = document.querySelector(
                  '#cookbook-table-container'
                ) as HTMLDivElement | null;
                if (container) {
                  sessionStorage.setItem(
                    'cookbookScrollPosition',
                    container.scrollTop.toString()
                  );
                }

                // Save search query (already handled by useEffect in _CookbookAllSection)
                // Save filter states
                sessionStorage.setItem(
                  'cookbookUseCaseFilter',
                  useCaseFilter || ''
                );
                sessionStorage.setItem(
                  'cookbookIntegrationFilter',
                  integrationFilter || ''
                );
              }
            }}
            href={cookbook.link}
            className="relative after:absolute after:-inset-2 focus-visible:underline focus-visible:ring-0"
          >
            {cookbook.title} <span className="font-mono">↗</span>
          </LinkPrefetch>
        </div>
      </TableCell>

      {/* Date (Optional) */}
      {/*<TableCell className="p-3 text-center">
        {cookbook.displayDate && cookbook.date ? (
          <span className="text-xs text-muted-foreground font-mono">
            {cookbook.date}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground font-mono">-</span>
        )}
      </TableCell>*/}

      {/* Tags */}
      <TableCell className="p-3 max-w-64">
        <CookbookTags
          tags={allTags}
          useCaseFilter={useCaseFilter}
          integrationFilter={integrationFilter}
        />
      </TableCell>
    </TableRow>
  );
}
// Cookbook table component with scroll container
function CookbookTable({
  data,
  className,
  useCaseFilter,
  integrationFilter,
}: {
  data: Cookbook[];
  className?: string;
  useCaseFilter?: string | null;
  integrationFilter?: string | null;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll position within the container
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Restore scroll position
    const savedPosition = sessionStorage.getItem('cookbookScrollPosition');
    if (savedPosition) {
      container.scrollTop = parseFloat(savedPosition);
    }

    // Save scroll position on scroll
    const handleScroll = () => {
      sessionStorage.setItem(
        'cookbookScrollPosition',
        container.scrollTop.toString()
      );
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Fixed height container with internal scrolling */}
      <div
        ref={containerRef}
        className="max-h-[calc(100vh-200px)] overflow-y-auto border rounded-md relative"
        style={{
          // Add scrollbar styling
          scrollbarWidth: 'thin',
          scrollbarColor: 'var(--scrollbar-thumb) var(--scrollbar-track)',
        }}
      >
        <div className="relative">
          <div className="overflow-x-auto min-w-full">
            <Table className="border-spacing-x-2 group/cookbook-table min-w-full">
              <TableBody>
                {data.map((cookbook, index) => (
                  <CookbookTableRow
                    key={`${cookbook.slug}-${index}`}
                    cookbook={cookbook}
                    useCaseFilter={useCaseFilter}
                    integrationFilter={integrationFilter}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}

// Cookbook tags component
function CookbookTags({
  tags,
  useCaseFilter,
  integrationFilter,
}: {
  tags: CookbookTag[];
  useCaseFilter?: string | null;
  integrationFilter?: string | null;
}) {
  const [showAllTags, setShowAllTags] = useState(false);

  // Sort tags to prioritize matched filters
  const sortedTags = [...tags].sort((a, b) => {
    const aIsMatching =
      (useCaseFilter && a.label === useCaseFilter) ||
      (integrationFilter && a.label === integrationFilter);
    const bIsMatching =
      (useCaseFilter && b.label === useCaseFilter) ||
      (integrationFilter && b.label === integrationFilter);

    // Matching tags come first
    if (aIsMatching && !bIsMatching) return -1;
    if (!aIsMatching && bIsMatching) return 1;

    // If both or neither are matching, maintain original order
    return 0;
  });

  const displayTags = sortedTags.slice(0, MAX_TAGS);
  const remainingCount = sortedTags.length - MAX_TAGS;

  // Function to determine badge variant based on active filters
  const getBadgeVariant = (
    label: string,
    defaultVariant: 'yellow' | 'orange'
  ) => {
    const hasActiveFilter = useCaseFilter || integrationFilter;
    if (!hasActiveFilter) return defaultVariant;

    // If there's an active filter, show outline for non-matching tags
    const isMatching =
      (useCaseFilter && label === useCaseFilter) ||
      (integrationFilter && label === integrationFilter);

    return isMatching ? defaultVariant : 'outline';
  };

  return (
    <div className="flex justify-end flex-wrap gap-1 lg:max-w-lg">
      {(showAllTags ? sortedTags : displayTags).map(({ label, variant }) => (
        <Badge
          size="sm"
          key={label}
          variant={getBadgeVariant(label, variant)}
          className="font-mono uppercase"
        >
          {label}
        </Badge>
      ))}
      {remainingCount > 0 && (
        <Badge
          size="sm"
          variant={showAllTags ? 'secondary' : 'outline'}
          className="font-mono uppercase cursor-pointer w-8"
          asChild
        >
          <button onClick={() => setShowAllTags(!showAllTags)}>
            {showAllTags ? 'X' : `+${remainingCount}`}
          </button>
        </Badge>
      )}
    </div>
  );
}

// Cookbook all section component with search persistence
function _CookbookAllSection() {
  // Initialize search query from sessionStorage if available
  const [searchQuery, setSearchQuery] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedQuery = sessionStorage.getItem('cookbookSearchQuery');
      return savedQuery || '';
    }
    return '';
  });

  // Query state for filtering from topics
  const [useCaseFilter, setUseCaseFilter] = useQueryState(
    'useCase',
    parseAsString.withDefault('')
  );
  const [integrationFilter, setIntegrationFilter] = useQueryState(
    'integration',
    parseAsString.withDefault('')
  );

  // Save search query to sessionStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('cookbookSearchQuery', searchQuery);
    }
  }, [searchQuery]);

  // Filter and sort cookbooks based on search query and filters
  const filteredCookbooks = filterAndSortCookbooks(
    fullCookbooks,
    useCaseFilter || null,
    integrationFilter || null,
    searchQuery
  );

  // Handle back navigation to restore state
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        const savedQuery = sessionStorage.getItem('cookbookSearchQuery');
        if (savedQuery) {
          setSearchQuery(savedQuery);
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <section id="all-cookbooks" className="space-y-8">
      {/* Custom Tabs UI with search persistence */}
      <FilterTabsUI
        useCaseFilter={useCaseFilter || null}
        integrationFilter={integrationFilter || null}
        setUseCaseFilter={setUseCaseFilter}
        setIntegrationFilter={setIntegrationFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalCount={fullCookbooks.filter(c => c.displayed).length} // Update total count
      />

      {/* Table with scroll persistence */}
      <RenderedFilteredCookbookTable
        data={filteredCookbooks}
        className="mt-6"
        useCaseFilter={useCaseFilter || null}
        integrationFilter={integrationFilter || null}
      />
    </section>
  );
}
const RenderedFilteredCookbookTable = (
  props: React.ComponentProps<typeof CookbookTable>
) => {
  return props.data.length > 0 ? (
    <CookbookTable {...props} />
  ) : (
    <div className="text-center py-12 text-muted-foreground">
      <p>No cookbooks found. Try adjusting your filters or search terms.</p>
    </div>
  );
};

export default function CookbookAllSection() {
  return (
    <Suspense
      fallback={
        <section id="all-cookbooks" className="space-y-8">
          {/* Custom Tabs UI */}
          <FilterTabsUI
            useCaseFilter={null}
            integrationFilter={null}
            setUseCaseFilter={() => {}}
            setIntegrationFilter={() => {}}
            searchQuery={''}
            setSearchQuery={() => {}}
            totalCount={fullCookbooks.filter(c => c.displayed).length} // Update total count
          />
          <RenderedFilteredCookbookTable
            data={filterAndSortCookbooks(fullCookbooks, null, null, '')}
            className="mt-6"
            useCaseFilter={null}
            integrationFilter={null}
          />
        </section>
      }
    >
      <NuqsAdapter>
        <_CookbookAllSection />
      </NuqsAdapter>
    </Suspense>
  );
}

//--------------------------------
// Helper functions
//--------------------------------

/**
 * Parse date string to a date object.
 */

const parseDate = (dateString: string) => {
  const [month, year] = dateString.split(' ');
  const monthIndex = new Date(Date.parse(month + ' 1, 2000')).getMonth();
  return new Date(parseInt(year), monthIndex);
};

/**
 * Filter and sort cookbooks.
 */

const filterAndSortCookbooks = (
  cookbooks: Cookbook[],
  useCaseFilter: string | null,
  integrationFilter: string | null,
  searchQuery: string
) => {
  return cookbooks
    .filter(cookbook => {
      // First check if the cookbook should be displayed
      if (!cookbook.displayed) {
        return false;
      }

      // Text search filter
      const matchesSearch =
        !searchQuery ||
        cookbook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cookbook.useCases.some(useCase =>
          useCase.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        cookbook.integrations.some(integration =>
          integration.toLowerCase().includes(searchQuery.toLowerCase())
        );

      // Use case filter
      const matchesUseCase =
        !useCaseFilter || cookbook.useCases.includes(useCaseFilter);

      // Integration filter
      const matchesIntegration =
        !integrationFilter || cookbook.integrations.includes(integrationFilter);

      return matchesSearch && matchesUseCase && matchesIntegration;
    })
    .sort((a, b) => {
      if (a.date && b.date) {
        return parseDate(b.date).getTime() - parseDate(a.date).getTime();
      }
      return 0;
    });
};
/**
 * Manager for the cookbook show all state.
 */
const COOKBOOK_SHOW_ALL_STORAGE_KEY = 'cookbook-showAll';
