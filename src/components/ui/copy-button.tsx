'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { CheckIcon, CopyIcon as CopyIconIcon } from '@/components/icons/pixel';
import { cn } from '@/lib/utils';

export type CopyButtonProps = React.ComponentProps<'button'> & {
  asChild?: boolean;
  className?: string;
  CopyIcon?: (props: {
    copyState: 'idle' | 'copied' | 'disappearing';
    className?: string;
    disabled?: boolean;
    isHovered?: boolean;
  }) => React.ReactNode;
  buttonClassName?: string;
  groupClassName?: string;
  hoverDelayEnter?: number;
  hoverDelayLeave?: number;
} & (
    | ({
        value: string;
        onCopySuccess?: (value: string) => void;
        onCopyError?: (error: Error) => void;
        copiedAnimationDuration?: number;
        disappearingAnimationDuration?: number;
        preventDefault?: boolean;
        stopPropagation?: boolean;
      } & {
        handleCopy?: never;
      })
    | {
        handleCopy: (
          e: React.MouseEvent<HTMLElement> | React.MouseEvent<HTMLButtonElement>
        ) => void;
        value?: never;
        onCopySuccess?: never;
        onCopyError?: never;
        copiedAnimationDuration?: never;
        disappearingAnimationDuration?: never;
        preventDefault?: never;
        stopPropagation?: never;
      }
  );

export const CopyButton = ({
  children,
  asChild = false,
  className,
  value,
  onCopySuccess,
  onCopyError,
  copiedAnimationDuration,
  disappearingAnimationDuration,
  preventDefault,
  stopPropagation,
  CopyIcon: PropsCopyIcon,
  disabled,
  buttonClassName,
  groupClassName = 'group',
  hoverDelayEnter = 300,
  hoverDelayLeave = 150,
  handleCopy,
  ...props
}: CopyButtonProps) => {
  const [fallbackCopyState, setFallbackCopyState] = React.useState<
    'idle' | 'copied' | 'disappearing'
  >('idle');
  const [isHovered, setIsHovered] = React.useState(false);
  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const useCopyButtonResult = useCopyButton({
    value: value ?? '',
    onCopySuccess,
    onCopyError,
    copiedAnimationDuration,
    disappearingAnimationDuration,
    preventDefault,
    stopPropagation,
    handleCopy,
  });

  const copyState = useCopyButtonResult?.copyState ?? fallbackCopyState;
  const setCopyState =
    useCopyButtonResult?.setCopyState ?? setFallbackCopyState;

  React.useEffect(() => {
    setCopyState('idle');
  }, [value, setCopyState]);

  React.useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const handleMouseEnter = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(true);
      }, hoverDelayEnter);
    };

    const handleMouseLeave = () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, hoverDelayLeave);
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [hoverDelayEnter, hoverDelayLeave]);

  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={buttonRef}
      {...props}
      className={cn(
        'inline-flex items-center gap-1 focus-ring',
        groupClassName,
        className
      )}
      onClick={e => {
        useCopyButtonResult.handleCopy(e);
      }}
      disabled={disabled}
    >
      {children}
      {(PropsCopyIcon ?? DefaultCopyIcon)({
        copyState,
        disabled,
        isHovered,
        className: buttonClassName,
      })}
    </Comp>
  );
};

type UseCopyButtonProps = {
  value: string;
  onCopySuccess?: (value: string) => void;
  onCopyError?: (error: Error) => void;
  copiedAnimationDuration?: number;
  disappearingAnimationDuration?: number;
  preventDefault?: boolean;
  stopPropagation?: boolean;
  handleCopy?: (
    e: React.MouseEvent<HTMLElement> | React.MouseEvent<HTMLButtonElement>
  ) => void;
};

const DefaultCopyIcon = ({
  copyState,
  className,
  disabled,
  isHovered,
}: {
  className?: string;
  copyState: 'idle' | 'copied' | 'disappearing';
  disabled?: boolean;
  isHovered?: boolean;
}) => {
  const Icon = copyState === 'copied' ? CheckIcon : CopyIconIcon;
  return (
    <Icon
      className={cn(
        'size-3 transition-opacity duration-200',
        copyState === 'copied'
          ? 'text-primary-soft opacity-100'
          : 'text-current',
        copyState === 'disappearing' && 'opacity-100',
        disabled && 'opacity-50 cursor-not-allowed',
        isHovered || copyState === 'copied' || copyState === 'disappearing'
          ? 'opacity-100'
          : 'opacity-0',
        className
      )}
    />
  );
};

export const useCopyButton = ({
  value,
  onCopySuccess,
  onCopyError,
  copiedAnimationDuration = 2000,
  disappearingAnimationDuration = 200,
  preventDefault = true,
  stopPropagation = true,
  handleCopy: _handleCopy,
}: UseCopyButtonProps) => {
  const [copyState, setCopyState] = React.useState<
    'idle' | 'copied' | 'disappearing'
  >('idle');

  const handleCopy = async (
    e: React.MouseEvent<HTMLElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    if (preventDefault) e.preventDefault();
    if (stopPropagation) e.stopPropagation();
    try {
      if (_handleCopy) {
        _handleCopy(e);
      } else {
        if (!value) return;
        await navigator.clipboard.writeText(value);
      }
      setCopyState('copied');
      onCopySuccess?.(value);
      await new Promise(r => setTimeout(r, copiedAnimationDuration));
      setCopyState('disappearing');
      await new Promise(r => setTimeout(r, disappearingAnimationDuration));
      setCopyState('idle');
    } catch (e) {
      onCopyError?.(e as Error);
    }
  };
  return { copyState, setCopyState, handleCopy };
};
