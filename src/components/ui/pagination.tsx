'use client';

import * as React from 'react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from 'lucide-react';
import { useLingo } from '@lingo.dev/react';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';

function Pagination({ className, ...props }: React.ComponentProps<'nav'>) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn('mx-auto flex w-full justify-center', className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<'ul'>) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn(
        'flex flex-row items-center gap-1 justify-between w-full',
        className
      )}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<'li'>) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, 'size'> &
  React.ComponentProps<'a'>;

function PaginationLink({
  className,
  isActive,
  size = 'icon',
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? 'page' : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? 'outline' : 'ghost',
          size,
        }),
        className
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { label?: string }) {
  const l = useLingo();
  return (
    <Button
      asChild
      variant="ghost"
      className="text-primary hover:text-primary/80"
    >
      <PaginationLink
        aria-label={l.text('Go to previous page', { context: 'Screen-reader label on the previous-page arrow button in the docs pagination footer' })}
        size="default"
        className={cn('gap-1 px-2.5 sm:pl-2.5', className)}
        {...props}
      >
        <ChevronLeftIcon />
        <span className="hidden min-[320px]:block first-letter:capitalize">
          {props.label || l.text('Previous', { context: 'Fallback label on the previous-page button in the docs pagination footer when no page title is available' })}
        </span>
      </PaginationLink>
    </Button>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink> & { label?: string }) {
  const l = useLingo();
  return (
    <Button
      asChild
      variant="ghost"
      className="text-primary hover:text-primary/80"
    >
      <PaginationLink
        aria-label={l.text('Go to next page', { context: 'Screen-reader label on the next-page arrow button in the docs pagination footer' })}
        size="default"
        className={cn('gap-1 px-2.5 sm:pr-2.5', className)}
        {...props}
      >
        <span className="hidden min-[320px]:block first-letter:capitalize">
          {props.label || l.text('Next', { context: 'Fallback label on the next-page button in the docs pagination footer when no page title is available' })}
        </span>
        <ChevronRightIcon />
      </PaginationLink>
    </Button>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<'span'>) {
  const l = useLingo();
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn('flex size-9 items-center justify-center', className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">{l.text('More pages', { context: 'Screen-reader-only label on the "..." ellipsis in the pagination UI indicating more pages exist between shown page numbers' })}</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};
