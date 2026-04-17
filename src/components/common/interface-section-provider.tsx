'use client';

import React, { createContext, useContext, useCallback, useRef } from 'react';
import { SectionTab } from '@/components/layout/section-tab';

type InterfaceSectionContextType = {
  scrollToSection: (id: string) => void;
  registerSection: (id: string, ref: HTMLDivElement) => void;
};

const InterfaceSectionContext = createContext<InterfaceSectionContextType>({
  scrollToSection: () => {},
  registerSection: () => {},
});

export const useInterfaceSection = () => useContext(InterfaceSectionContext);

export function InterfaceSectionProvider({ children }: { children: React.ReactNode }) {
  const sectionsRef = useRef<Map<string, HTMLDivElement>>(new Map());

  const registerSection = useCallback((id: string, el: HTMLDivElement) => {
    sectionsRef.current.set(id, el);
  }, []);

  const scrollToSection = useCallback((id: string) => {
    const el = sectionsRef.current.get(id);
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <InterfaceSectionContext.Provider value={{ scrollToSection, registerSection }}>
      {children}
    </InterfaceSectionContext.Provider>
  );
}

export function InterfaceSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  const { registerSection } = useInterfaceSection();

  const ref = useCallback(
    (el: HTMLDivElement | null) => {
      if (el) registerSection(id, el);
    },
    [id, registerSection],
  );

  return (
    <div ref={ref}>
      <SectionTab as="h2" sectionId={id}>{title}</SectionTab>
      {children}
    </div>
  );
}
