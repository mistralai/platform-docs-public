'use client';

import { ChevronRightIcon } from '@/components/icons/pixel';
import { cn } from '@/lib/utils';
import {
  SectionContentProps,
  SectionProps,
  SectionTitleProps,
  useChildren,
  useUniqueChild,
} from '@speakeasy-api/docs-md-react';
import { useState } from 'react';

export function Section({ children, ...props }: SectionProps) {
  const titleChild = useUniqueChild<SectionTitleProps>(children, 'title');
  const contentChildren = useChildren(children, 'content');

  const [isOpen, setIsOpen] = useState(true);
  return (
    <div
      data-type="section"
      className="group/collapsible relative"
      data-state={isOpen ? 'open' : 'closed'}
      {...props}
    >
      <div className={cn('flex flex-col')}>
        <button
          data-state={isOpen ? 'open' : 'closed'}
          className="flex items-center justify-between group/collapsible-trigger py-2 border-b border-border w-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="flex items-center gap-2">
            <ChevronRightIcon className="size-5 -mt-1 relative transition-transform group-data-[state=open]/collapsible-trigger:rotate-90" />
            {titleChild}
          </div>
          <p className="text-xs font-mono text-foreground/50 font-semibold">
            application/json
          </p>
        </button>
        <div
          className="group-data-[state=open]/collapsible:block hidden"
          data-type="section-content"
        >
          {contentChildren}
        </div>
      </div>
    </div>
  );
}

export function SectionTitle({ children, slot, id }: SectionTitleProps) {
  return (
    <div className='font-semibold text-lg' id={id} slot={slot}>
      {children}
    </div>
  );
}

export function SectionContent({ slot, children, id }: SectionContentProps) {
  return (
    <div id={id} slot={slot}>
      {children}
    </div>
  );
}
