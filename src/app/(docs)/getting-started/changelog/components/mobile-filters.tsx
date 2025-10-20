'use client';

import React, { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { parseAsArrayOf, parseAsString, useQueryState } from 'nuqs';
import type { TimelineYear } from '@/lib/timeline-data';
import { ExpandIcon } from '@/components/icons/pixel/expand';
import { ChevronDownIcon } from '@/components/icons/pixel';
import ArrowRightIcon from '@/components/icons/pixel/arrow-right';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

const changelog = ['model', 'api', 'other', 'security'] as const;

interface FilterTriggerProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const FilterTrigger = React.forwardRef<HTMLButtonElement, FilterTriggerProps>(
  ({ children, icon, ...props }, ref) => (
    <button
      ref={ref}
      className="group flex min-w-44 max-md:flex-1 items-center pl-4 pr-2 justify-between text-muted-foreground hover:text-foreground h-8 transition-colors bg-background border border-[#1C19174D] rounded-sm overflow-hidden data-[state=open]:text-foreground"
      {...props}
    >
      <span className="text-xs font-semibold uppercase tracking-wide font-mono group-data-[state=open]:text-foreground">
        {children}
      </span>
      {icon ? (
        icon
      ) : (
        <ExpandIcon className="size-5 group-data-[state=open]:text-foreground" />
      )}
    </button>
  )
);

FilterTrigger.displayName = 'FilterTrigger';

interface FilterContentProps {
  children: React.ReactNode;
}

const FilterContent = ({ children }: FilterContentProps) => (
  <PopoverContent
    className="w-[var(--radix-popover-trigger-width)] p-0 bg-background border border-[#1C19174D]"
    align="start"
    sideOffset={4}
  >
    {children}
  </PopoverContent>
);

interface YearFilterContentProps {
  timelineData: TimelineYear[];
  expandedYear: string | null;
  onToggleYear: (year: string) => void;
  onMonthClick: (href: string) => void;
}

const YearFilterContent = ({
  timelineData,
  expandedYear,
  onToggleYear,
  onMonthClick,
}: YearFilterContentProps) => (
  <div className="p-2 max-h-60 overflow-y-auto">
    {timelineData.map((yearItem, yearIndex) => (
      <div key={yearIndex} className="mb-2 last:mb-0">
        <button
          onClick={() => onToggleYear(yearItem.year)}
          className="w-full flex items-center justify-between px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted/50 rounded-md transition-colors"
        >
          {yearItem.year}
          <ChevronDownIcon
            className={cn(
              'w-3 h-4 transition-transform duration-200 ease-in-out',
              expandedYear === yearItem.year ? 'rotate-180' : 'rotate-0'
            )}
          />
        </button>
        <div
          className={cn(
            'overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out',
            expandedYear === yearItem.year
              ? 'max-h-screen opacity-100'
              : 'max-h-0 opacity-0'
          )}
        >
          <div className="flex flex-col gap-1">
            {yearItem.months.map((monthItem, monthIndex) => (
              <button
                key={monthIndex}
                onClick={() => onMonthClick(monthItem.href)}
                className="w-full flex items-center justify-between text-left px-3 pl-6 py-2 text-sm text-muted-foreground group hover:text-foreground hover:bg-muted/50 rounded-md transition-colors capitalize"
              >
                {monthItem.month}
                <ArrowRightIcon className="size-4 group-hover:translate-x-1 transition-transform duration-200 ease-in-out" />
              </button>
            ))}
          </div>
        </div>
      </div>
    ))}
  </div>
);

interface TagFilterContentProps {
  selectedFilters: string[];
  onFiltersChange: (filters: string[]) => void;
}

const TagFilterContent = ({
  selectedFilters,
  onFiltersChange,
}: TagFilterContentProps) => (
  <div className="p-3">
    <div className="flex flex-col gap-3">
      {changelog.map(type => (
        <div key={type} className="flex items-center space-x-3">
          <Checkbox
            id={type}
            checked={selectedFilters.includes(type)}
            onCheckedChange={checked => {
              onFiltersChange(
                checked
                  ? [...selectedFilters, type]
                  : selectedFilters.filter(filter => filter !== type)
              );
            }}
          />
          <label
            htmlFor={type}
            className={cn(
              'text-sm font-medium capitalize cursor-pointer leading-none text-black/50 hover:text-black/80 peer-disabled:cursor-not-allowed peer-disabled:opacity-70 transition-colors',
              selectedFilters.includes(type) && 'font-bold text-black'
            )}
          >
            {type}
          </label>
        </div>
      ))}
    </div>
  </div>
);

interface MobileFiltersProps {
  timelineData: TimelineYear[];
}

function _MobileFilters({ timelineData }: MobileFiltersProps) {
  const [selectedFilters, setSelectedFilters] = useQueryState(
    'filters',
    parseAsArrayOf(parseAsString).withDefault([])
  );

  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isTagDropdownOpen, setIsTagDropdownOpen] = useState(false);
  const [expandedYear, setExpandedYear] = useState<string | null>(
    timelineData.length > 0 ? timelineData[0].year : null
  );

  const handleMonthClick = (href: string) => {
    const targetId = href.split('#')[1];

    setIsYearDropdownOpen(false);

    window.history.pushState(null, '', href);

    setTimeout(() => {
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        const elementPosition = targetElement.offsetTop;
        const offsetPosition = elementPosition - 100;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  const toggleYear = (year: string) => {
    setExpandedYear(prev => (prev === year ? null : year));
  };

  return (
    <div className="flex flex-row lg:justify-start sm:flex-row gap-2 mb-8 xl:hidden">
      {/* Year Filter */}
      <Popover
        open={isYearDropdownOpen}
        onOpenChange={open => {
          setIsYearDropdownOpen(open);
          if (open) setIsTagDropdownOpen(false);
        }}
      >
        <PopoverTrigger asChild>
          <FilterTrigger>YEAR</FilterTrigger>
        </PopoverTrigger>
        <FilterContent>
          <YearFilterContent
            timelineData={timelineData}
            expandedYear={expandedYear}
            onToggleYear={toggleYear}
            onMonthClick={handleMonthClick}
          />
        </FilterContent>
      </Popover>

      {/* Tag Filter */}
      <Popover
        open={isTagDropdownOpen}
        onOpenChange={open => {
          setIsTagDropdownOpen(open);
          if (open) setIsYearDropdownOpen(false);
        }}
      >
        <PopoverTrigger asChild>
          <FilterTrigger>TAG</FilterTrigger>
        </PopoverTrigger>
        <FilterContent>
          <TagFilterContent
            selectedFilters={selectedFilters}
            onFiltersChange={setSelectedFilters}
          />
        </FilterContent>
      </Popover>
    </div>
  );
}

export const MobileFilters = (props: MobileFiltersProps) => {
  return (
    <NuqsAdapter>
      <_MobileFilters {...props} />
    </NuqsAdapter>
  );
};
