'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { CopyIcon, CheckIcon, PageIcon } from '@/components/icons/pixel';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/use-media-query';

const sectionTabContainerVariants = cva(
  'w-full group/section-tab flex items-end not-prose section-tab-container mt-6 mb-2 justify-between gap-1',
  {
    variants: {
      variant: {
        default: 'border-b border-primary-soft',
        secondary: 'border-b border-secondary',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export const sectionTabVariants = cva(
  'inline-flex items-center -mb-px gap-2 px-2.5 py-1 rounded-t-md font-semibold text-xs 2xl:text-sm font-mono uppercase not-prose [&_p]:m-0',
  {
    variants: {
      variant: {
        default: 'bg-primary-soft text-primary-soft-foreground',
        secondary: 'bg-secondary text-secondary-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface SectionTabProps
  extends Omit<React.ComponentProps<'div'>, 'id'>,
    VariantProps<typeof sectionTabVariants> {
  children: React.ReactNode;
  sectionId?: string;
  showIcon?: boolean;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  onSectionCopy?: (sectionId: string) => void;
}

export function SectionTab({
  className,
  variant,
  children,
  sectionId,
  onSectionCopy,
  showIcon = true,
  as = 'h2',
  ...props
}: SectionTabProps) {
  const [copyState, setCopyState] = React.useState<
    'idle' | 'copied' | 'disappearing'
  >('idle');
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const Comp = as as React.ElementType;
  const handleCopy = async () => {
    if (!sectionId) return;

    try {
      const url = `${window.location.origin}${window.location.pathname}#${sectionId}`;
      await navigator.clipboard.writeText(url);
      setCopyState('copied');
      onSectionCopy?.(sectionId);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setCopyState('disappearing');
      await new Promise(resolve => setTimeout(resolve, 200));
      setCopyState('idle');
    } catch (error) {
      console.error('Failed to copy section URL:', error);
    }
  };

  const isCopied = copyState === 'copied';
  const copyText = isMobile ? 'Copy' : 'Copy section link';
  return (
    <div
      id={sectionId}
      data-slot="section-tab"
      data-type="section-tab"
      className={cn(sectionTabContainerVariants({ variant }), className)}
      {...props}
    >
      <div className={cn(sectionTabVariants({ variant }))}>
        {showIcon && (
          <div className="size-[1em] flex-shrink-0 mt-[0.20em] self-start">
            <PageIcon width="100%" height="100%" />
          </div>
        )}
        <div className="min-w-0">{children}</div>
      </div>
      {sectionId && (
        <Button
          size="xs"
          variant="ghost"
          onClick={handleCopy}
          className={cn(
            'mb-1 cursor-pointer font-mono uppercase opacity-0 group-hover/section-tab:opacity-100 transition-opacity flex-shrink-0 self-end',
            isMobile && 'opacity-100',
            isCopied && 'opacity-100 text-foreground',
            copyState === 'disappearing' &&
              'opacity-0 group-hover/section-tab:opacity-0 pointer-events-none'
          )}
          aria-label={`Copy link to ${children} section`}
        >
          {copyState !== 'idle' ? 'Copied!' : copyText}
          {copyState !== 'idle' ? (
            <CheckIcon className="size-3 text-primary-soft" />
          ) : (
            <CopyIcon className="size-3 text-current" />
          )}
        </Button>
      )}
      {as && <Comp className="sr-only">{children}</Comp>}
    </div>
  );
}
