// src/hooks/use-scroll-restoration.ts
'use client';

import { useLayoutEffect, useEffect, useRef } from 'react';

export function useScrollRestoration<T extends HTMLElement>(
  storageKey: string
) {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const saved = sessionStorage.getItem(storageKey);
    if (saved != null) el.scrollTo({ top: Number(saved), behavior: 'smooth' });
  }, [storageKey]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        sessionStorage.setItem(storageKey, String(el.scrollTop));
      });
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(raf);
      sessionStorage.setItem(storageKey, String(el.scrollTop));
    };
  }, [storageKey]);

  return ref;
}
