'use client';

import * as React from 'react';
import { Badge, badgeVariants } from '@/components/ui/badge';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { CopyIcon, CheckIcon } from '@/components/icons/pixel';

interface CopyBadgeProps
  extends Omit<React.ComponentProps<'button'>, 'onCopy'>,
    VariantProps<typeof badgeVariants> {
  copyText?: string;
  onCopySuccess?: (text: string) => void;
}

const CopyBadge = React.forwardRef<HTMLButtonElement, CopyBadgeProps>(
  (
    {
      className,
      variant,
      size,
      copyText,
      onCopySuccess,
      children,
      onClick,
      style,
      ...props
    },
    ref
  ) => {
    const [isCopied, setIsCopied] = React.useState(false);
    const textToCopy =
      copyText || (typeof children === 'string' ? children : '');

    const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (textToCopy) {
        try {
          await navigator.clipboard.writeText(textToCopy);
          setIsCopied(true);
          onCopySuccess?.(textToCopy);

          // Reset the copied state after 2 seconds
          setTimeout(() => {
            setIsCopied(false);
          }, 2000);
        } catch (err) {
          console.error('Failed to copy text: ', err);
        }
      }

      onClick?.(e);
    };

    return (
      <Badge variant={variant} size={size} asChild>
        <button
          ref={ref}
          className={cn(
            'cursor-pointer hover:bg-muted focus:outline-none',
            className
          )}
          style={style}
          onClick={handleClick}
          title={`Click to copy: ${textToCopy}`}
          {...props}
        >
          {children}
          <span className="ml-1.5">
            {isCopied ? (
              <CheckIcon className="size-3 text-primary-soft" />
            ) : (
              <CopyIcon className="size-3 opacity-50" />
            )}
          </span>
        </button>
      </Badge>
    );
  }
);

CopyBadge.displayName = 'CopyBadge';

export { CopyBadge };
