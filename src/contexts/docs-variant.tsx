'use client';

import { createContext, useContext, useMemo } from 'react';

export type DocsVariant = 'docs' | 'api';

export type DocsVariantClasses = (
  variants: Record<DocsVariant, string>
) => string;

export const DocsVariantContext = createContext<
  readonly [DocsVariant, DocsVariantClasses] | null
>(null);

export function DocsVariantProvider({
  children,
  variant,
}: {
  children: React.ReactNode;
  variant: DocsVariant;
}) {
  const value = useMemo(() => {
    const dvc: DocsVariantClasses = (variants: Record<DocsVariant, string>) => {
      switch (variant) {
        case 'docs':
          return variants.docs;
        case 'api':
          return variants.api;
      }
    };
    return [variant, dvc] as const;
  }, [variant]);

  return (
    <DocsVariantContext.Provider value={value}>
      {children}
    </DocsVariantContext.Provider>
  );
}

export function useDocsVariant() {
  const v = useContext(DocsVariantContext);
  if (!v) {
    throw new Error('useDocsVariant must be used within a DocsVariantProvider');
  }
  return v;
}
