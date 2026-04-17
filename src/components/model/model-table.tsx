'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ChevronUpIcon, ChevronsUpDownIcon } from '@/components/icons/pixel';
import Link from 'next/link';
import { getModelUrl, Model } from '@/schema';

interface ModelTableProps {
  data: Model[];
  className?: string;
  showAll?: boolean;
  onToggleShowAll?: () => void;
  forceDeprecated?: boolean;
  defaultVisible?: number;
}

interface ModelRowProps {
  data: Model;
  isDeprecated?: boolean;
}

function ModelRowResponsive({ data, isDeprecated }: ModelRowProps) {
  const isRetired =
    data.metadata?.retirementDate &&
    new Date(data.metadata.retirementDate) < new Date();
  const isDeprecationSoon =
    data.metadata?.deprecationDate &&
    new Date(data.metadata.deprecationDate) < new Date();
  const apiName = data.identifiers.apiNames[0];

  const rowClassName = cn(
    'transition-opacity duration-200',
    (isDeprecated || isRetired || isDeprecationSoon) && 'opacity-85'
  );

  const badgeClassName = cn(
    'font-mono text-xs w-fit',
    (isDeprecated || isRetired) &&
      'text-muted-foreground font-semibold uppercase'
  );

  const modelUrl = getModelUrl(data);

  if (!modelUrl) return null;

  return (
    <TableRow className={rowClassName}>
      <TableCell className="font-medium p-2">
        <Link
          href={modelUrl}
          target="_blank"
          className="relative font-semibold text-foreground after:absolute after:-inset-2 hover:text-primary-soft transition-colors"
        >
          {data.name} <span className="font-mono">↗</span>
        </Link>
      </TableCell>
      <TableCell className="p-2 text-end">
        <code className={cn('text-xs 2xl:text-sm font-mono')}>
          {data.version}
        </code>
      </TableCell>
      <TableCell className="p-2">
        {apiName ? (
          <Badge variant="outline" className={badgeClassName}>
            {apiName}
          </Badge>
        ) : null}
      </TableCell>
      <TableCell
        className={cn(
          'text-xs 2xl:text-sm p-2 text-foreground/70 hidden lg:table-cell'
        )}
      >
        <div className="flex items-center justify-between gap-2">
          <span className="text-foreground/70">
            {data.metadata?.deprecationDate}
          </span>
          <span className="text-foreground/70">
            {data.metadata?.retirementDate}
          </span>
        </div>
      </TableCell>
      <TableCell
        className={cn(
          'text-xs 2xl:text-sm p-2 text-foreground/70 hidden lg:table-cell text-end'
        )}
      >
        {data.metadata?.replacement ? (
          <Badge
            variant="outline"
            className={badgeClassName}
          >
            {data.metadata?.replacement}
          </Badge>
        ) : null}
      </TableCell>
    </TableRow>
  );
}

/**
 * ModelTable - A professional table component for displaying model information
 *
 * Features:
 * - Responsive design with mobile-friendly layout
 * - Automatic styling for deprecated/retired models
 * - Show/hide functionality with customizable row limits
 * - Professional typography and badge styling
 * - Color-coded status indicators
 *
 * @param data - Array of model table data
 * @param className - Additional CSS classes
 * @param showAll - Whether to show all rows (controlled)
 * @param onToggleShowAll - Callback for external show/hide control
 * @param defaultVisible - Number of rows to show initially (default: 6)
 */
export function ModelTable({
  data,
  className,
  showAll = false,
  onToggleShowAll,
  forceDeprecated = false,
  defaultVisible = 6,
}: ModelTableProps) {
  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className="relative">
        {/* Fixed header */}
        <div className="bg-background rounded-t-md">
          <Table className="border-spacing-x-2">
            <TableHeader>
              <TableRow className="border-none">
                <TableHead className="min-w-[180px] sm:w-[190px] font-bold text-foreground text-xs 2xl:text-sm border-none">
                  Model
                </TableHead>
                <TableHead className="min-w-[60px] sm:w-[80px] font-bold text-foreground text-xs 2xl:text-sm border-none">
                  Version
                </TableHead>
                <TableHead className="min-w-[140px] sm:w-[190px] font-bold text-foreground text-xs 2xl:text-sm border-none text-center">
                  API
                </TableHead>
                <TableHead className="min-w-[180px] sm:w-[220px] hidden sm:table-cell font-bold text-foreground text-xs 2xl:text-sm border-none">
                  <div className="flex items-center justify-between gap-2">
                    Deprecation
                    <svg
                      className="w-8 h-4 text-foreground"
                      viewBox="0 0 32 6"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M32 3L27 0.113249V5.88675L32 3ZM0 3V3.5H2V3V2.5H0V3ZM6 3V3.5H10V3V2.5H6V3ZM14 3V3.5H18V3V2.5H14V3ZM22 3V3.5H26V3V2.5H22V3Z"
                        fill="currentColor"
                      />
                    </svg>
                    Retirement
                  </div>
                </TableHead>
                <TableHead className="hidden lg:table-cell min-w-[140px] sm:min-w-[180px] font-bold text-foreground text-xs 2xl:text-sm text-end border-none">
                  Alternative
                </TableHead>
              </TableRow>
            </TableHeader>
          </Table>
        </div>

        {/* Scrollable container wrapper */}
        <div className="relative rounded-b-md group">
          {/* Scroll hint - appears on hover, disappears at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 h-6 flex items-end justify-center pb-1 pointer-events-none opacity-0 transition-opacity z-10"
            style={{ display: 'none' }} // Will be controlled by JavaScript
            id="scroll-hint"
          >
            <div className="flex items-center gap-1 text-xs text-muted-foreground bg-background/90 px-2 py-0.5 rounded-t-sm">
              <span>Scroll for more</span>
              <ChevronUpIcon className="w-3 h-3 rotate-180" />
            </div>
          </div>
          
          {/* Actual scrollable content */}
          <div
            className="max-h-[400px] overflow-y-auto scrollable-container relative z-0"
            onScroll={(e) => {
              const target = e.target as HTMLElement;
              const scrollHint = document.getElementById('scroll-hint');
              if (scrollHint) {
                if (target.scrollTop + target.clientHeight >= target.scrollHeight - 1) {
                  scrollHint.style.opacity = '0';
                  setTimeout(() => scrollHint.style.display = 'none', 300);
                } else {
                  scrollHint.style.display = 'flex';
                  scrollHint.style.opacity = '1';
                }
              }
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLElement;
              const scrollHint = document.getElementById('scroll-hint');
              if (scrollHint && target.scrollTop + target.clientHeight < target.scrollHeight - 1) {
                scrollHint.style.display = 'flex';
                scrollHint.style.opacity = '1';
              }
            }}
            onMouseLeave={(e) => {
              const target = e.currentTarget as HTMLElement;
              const scrollHint = document.getElementById('scroll-hint');
              if (scrollHint) {
                scrollHint.style.opacity = '0';
                setTimeout(() => scrollHint.style.display = 'none', 300);
              }
            }}
          >
            <Table className="border-spacing-x-2 group/model-table min-w-full">
              <TableBody>
                {data.map((item, index) => {
                  const isDeprecated =
                    !!item.metadata?.deprecationDate &&
                    new Date(item.metadata.deprecationDate) < new Date();

                  return (
                    <ModelRowResponsive
                      key={`${item.name}-${index}`}
                      data={item}
                      isDeprecated={forceDeprecated || isDeprecated}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
