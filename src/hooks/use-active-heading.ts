'use client';

import { useEffect, useState, useRef, useCallback } from 'react';

interface UseActiveHeadingOptions {
  rootMargin?: string;
  threshold?: number;
  debounceMs?: number;
}

export function useActiveHeading(
  headingIds: string[],
  options: UseActiveHeadingOptions = {}
) {
  const {
    rootMargin = '-20% 0px -60% 0px',
    threshold = 0.1,
    debounceMs = 50,
  } = options;

  const [activeId, setActiveId] = useState<string>('');
  const observerRef = useRef<IntersectionObserver | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedSetActiveId = useCallback(
    (id: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => setActiveId(id), debounceMs);
    },
    [debounceMs]
  );

  const updateActiveHeading = useCallback(() => {
    if (headingIds.length === 0) return;

    const allHeadingElements = headingIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
      .sort(
        (a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top
      );

    if (allHeadingElements.length === 0) return;

    const visibleHeadings = allHeadingElements.filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.top >= 0 && rect.top <= window.innerHeight * 0.6;
    });

    if (visibleHeadings.length > 0) {
      debouncedSetActiveId(visibleHeadings[0].id);
      return;
    }

    const aboveViewport = allHeadingElements.filter(
      el => el.getBoundingClientRect().top < 0
    );

    if (aboveViewport.length > 0) {
      const lastAbove = aboveViewport[aboveViewport.length - 1];
      debouncedSetActiveId(lastAbove.id);
    } else if (allHeadingElements.length > 0) {
      debouncedSetActiveId(allHeadingElements[0].id);
    }
  }, [headingIds, debouncedSetActiveId]);

  const findActiveHeading = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      updateActiveHeading();
    },
    [updateActiveHeading]
  );

  useEffect(() => {
    if (headingIds.length === 0) {
      setActiveId('');
      return;
    }

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(findActiveHeading, {
      rootMargin,
      threshold,
    });

    const elementsToObserve: HTMLElement[] = [];
    headingIds.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        observerRef.current!.observe(element);
        elementsToObserve.push(element);
      }
    });

    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      scrollTimeout = setTimeout(updateActiveHeading, 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    updateActiveHeading();

    if (elementsToObserve.length === 0) {
      setActiveId('');
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, [
    headingIds,
    rootMargin,
    threshold,
    findActiveHeading,
    updateActiveHeading,
  ]);

  return activeId;
}
