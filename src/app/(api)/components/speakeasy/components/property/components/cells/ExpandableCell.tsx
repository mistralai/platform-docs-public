'use client';

import { ChevronRightIcon } from '@/components/icons/pixel';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import type { FC } from 'react';
import { ExpandableCellIconProps } from '@speakeasy-api/docs-md-react';

export type ExpandableCellProps = {
  /**
   * Whether the cell is currently open or not.
   */
  isOpen: boolean;

  /**
   * A callback to set the open state of the cell
   */
  setIsOpen: (isOpen: boolean) => void;
  /**
   * The variant of the cell
   */
  variant: 'breakout' | 'property';
  /**
   * The component to use for rendering the expandable cell icon
   */
  ExpandableCellIcon?: FC<ExpandableCellIconProps>;
};

export function ExpandableCell({
  isOpen,
  setIsOpen
}: ExpandableCellProps) {
  return (
    <div className="flex flex-col" data-type="expandable-cell">
      <Button variant="ghost" className='hover:bg-foreground/10 border border-transparent focus-ring' size="icon" onClick={() => setIsOpen(!isOpen)}>
        <ChevronRightIcon
          className={cn(
            'size-4 transition-transform text-foreground',
            isOpen && 'rotate-90'
          )}
        />
      </Button>

      <div className={'flex flex-row w-full grow'}>
        <div className={'min-w-[var(--speakeasy-expandable-cell-size)]'} />
      </div>
    </div>
  );
}
