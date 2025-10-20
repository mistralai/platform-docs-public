'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ScrollGradientProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'x' | 'y';
  gradientSize?: number;
  scrollContainerClassName?: string;
}

export function ScrollGradient({
  children,
  direction = 'y',
  className,
  scrollContainerClassName,
  gradientSize = 32,
  ...props
}: ScrollGradientProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [scrollState, setScrollState] = React.useState({
    canScrollStart: false,
    canScrollEnd: false,
  });

  const checkScrollability = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (direction === 'y') {
      const scrollTop = Math.round(container.scrollTop);
      const maxScrollTop = Math.round(
        container.scrollHeight - container.clientHeight
      );

      const canScrollStart = scrollTop > 0;
      const canScrollEnd = scrollTop < maxScrollTop;

      setScrollState({ canScrollStart, canScrollEnd });
    } else {
      const scrollLeft = Math.round(container.scrollLeft);
      const maxScrollLeft = Math.round(
        container.scrollWidth - container.clientWidth
      );

      const canScrollStart = scrollLeft > 0;
      const canScrollEnd = scrollLeft < maxScrollLeft;

      setScrollState({ canScrollStart, canScrollEnd });
    }
  }, [direction]);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial check
    checkScrollability();

    // Add scroll listener
    container.addEventListener('scroll', checkScrollability, { passive: true });

    // Add resize observer to handle dynamic content changes
    const resizeObserver = new ResizeObserver(checkScrollability);
    resizeObserver.observe(container);

    // Also observe children for content changes
    const mutationObserver = new MutationObserver(checkScrollability);
    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      container.removeEventListener('scroll', checkScrollability);
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, [checkScrollability]);

  return (
    <div className={cn('relative', className)} {...props}>
      {/* Start gradient (top for y, left for x) */}
      <div
        className={cn(
          'pointer-events-none absolute z-10 transition-opacity duration-150',
          direction === 'y'
            ? 'left-0 right-0 top-0 bg-gradient-to-b from-background to-transparent'
            : 'top-0 bottom-0 left-0 bg-gradient-to-r from-background to-transparent',
          scrollState.canScrollStart ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          [direction === 'y' ? 'height' : 'width']: `${gradientSize}px`,
        }}
      />

      {/* End gradient (bottom for y, right for x) */}
      <div
        className={cn(
          'pointer-events-none absolute z-10 transition-opacity duration-150',
          direction === 'y'
            ? 'left-0 right-0 bottom-0 bg-gradient-to-t from-background to-transparent'
            : 'top-0 bottom-0 right-0 bg-gradient-to-l from-background to-transparent',
          scrollState.canScrollEnd ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          [direction === 'y' ? 'height' : 'width']: `${gradientSize}px`,
        }}
      />

      {/* Scrollable content */}
      <div
        ref={containerRef}
        className={cn(
          'h-full w-full',
          direction === 'y'
            ? 'overflow-y-auto overflow-x-hidden'
            : 'overflow-x-auto overflow-y-hidden',
          scrollContainerClassName
        )}
      >
        {children}
      </div>
    </div>
  );
}

export default ScrollGradient;
