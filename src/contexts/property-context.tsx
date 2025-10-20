'use client';

import React, { createContext, useContext, useMemo, useRef } from 'react';
import { DisplayTypeInfo, PropertyAnnotations } from '@/app/(api)/types/shared';

export interface PropertyContextData {
  // Core property information
  headingId?: string;
  slot?: string;
  typeInfo?: DisplayTypeInfo;
  typeAnnotations?: PropertyAnnotations[];

  // Hierarchical information
  depth: number;
  propertyPath: string[];

  // Parent context data (if available)
  parent?: PropertyContextData;
  rootPropertyId?: string;
  rowContainerRef?: React.RefObject<HTMLDivElement | null>;
}

const PropertyContext = createContext<PropertyContextData | null>(null);

export interface PropertyProviderProps {
  children: React.ReactNode;

  // Core property data
  headingId?: string;
  slot?: string;
  typeInfo?: DisplayTypeInfo;
  typeAnnotations?: PropertyAnnotations[];

  // Identifier for this property in the hierarchy
  propertyName?: string;
}

export function PropertyProvider({
  children,
  headingId,
  slot,
  typeInfo,
  typeAnnotations,
  propertyName,
}: PropertyProviderProps) {
  const parentContext = useContext(PropertyContext);
  const rowContainerRef = useRef<HTMLDivElement>(null);

  const contextValue = useMemo<PropertyContextData>(() => {
    const newPropertyPath = headingId
      ? parentContext
        ? [...parentContext.propertyPath, headingId]
        : [headingId]
      : parentContext?.propertyPath || [];

    return {
      headingId,
      slot,
      typeInfo,
      typeAnnotations,
      depth: parentContext ? parentContext.depth + 1 : 0,
      rootPropertyId: parentContext?.rootPropertyId || headingId,
      propertyPath: newPropertyPath,
      parent: parentContext || undefined,
      rowContainerRef,
    };
  }, [parentContext, headingId, slot, typeInfo, typeAnnotations, propertyName]);

  return (
    <PropertyContext.Provider value={contextValue}>
      {children}
    </PropertyContext.Provider>
  );
}

export function usePropertyContext(): PropertyContextData | null {
  return useContext(PropertyContext);
}

export function usePropertyContextRequired(): PropertyContextData {
  const context = useContext(PropertyContext);
  if (!context) {
    throw new Error(
      'usePropertyContextRequired must be used within a PropertyProvider'
    );
  }
  return context;
}

// Utility hooks for common property context operations
export function usePropertyDepth(): number {
  const context = usePropertyContext();
  return context?.depth ?? 0;
}

export function usePropertyPath(): string[] {
  const context = usePropertyContext();
  return context?.propertyPath ?? [];
}

export function useIsNestedProperty(): boolean {
  const context = usePropertyContext();
  return (context?.depth ?? 0) > 0;
}

export function useParentPropertyContext(): PropertyContextData | undefined {
  const context = usePropertyContext();
  return context?.parent;
}

export const PROPERTY_PATH_SEPARATOR = '__';