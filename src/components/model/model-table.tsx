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
    (isDeprecated || isRetired || isDeprecationSoon) && 'opacity-60'
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
  const [internalShowAll, setInternalShowAll] = React.useState(showAll);
  const shouldShowAll = onToggleShowAll ? showAll : internalShowAll;
  const visibleData = shouldShowAll ? data : data.slice(0, defaultVisible);
  const hasMore = data.length > defaultVisible;

  const handleToggle = () => {
    if (onToggleShowAll) {
      onToggleShowAll();
    } else {
      setInternalShowAll(!internalShowAll);
    }
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className="relative">
        <div className="overflow-x-auto">
          <Table className="border-spacing-x-2">
            <TableHeader>
              <TableRow className="ga">
                <TableHead className="min-w-[180px] sm:w-[200px] font-bold text-foreground/50 text-xs 2xl:text-sm">
                  Model
                </TableHead>
                <TableHead className="min-w-[60px] sm:w-[80px] font-bold text-foreground/50 text-xs 2xl:text-sm text-end">
                  Version
                </TableHead>
                <TableHead className="min-w-[140px] sm:w-[180px] font-bold text-foreground/50 text-xs 2xl:text-sm">
                  API
                </TableHead>
                <TableHead className="min-w-[180px] sm:w-[220px] hidden sm:table-cell font-bold text-foreground/50 text-xs 2xl:text-sm">
                  <div className="flex items-center justify-between gap-2">
                    Deprecation
                    <svg
                      className="w-8 h-4 text-foreground/20"
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
                <TableHead className="hidden lg:table-cell min-w-[140px] sm:min-w-[180px] font-bold text-foreground/50 text-xs 2xl:text-sm text-end">
                  Alternative
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visibleData.map((item, index) => {
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

        {hasMore && (
          <div className="flex justify-center pt-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggle}
              className="gap-2 text-muted-foreground hover:text-foreground text-xs 2xl:text-sm flex items-center justify-center"
            >
              {shouldShowAll ? (
                <>
                  <ChevronUpIcon className="h-4 w-4" />
                  <span className="block">Show less</span>
                </>
              ) : (
                <>
                  <span className="block">See all</span>
                  <ChevronsUpDownIcon className="h-4 w-4 rotate-180" />
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
