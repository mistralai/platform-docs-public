'use client';

import React, { createContext, useContext } from 'react';

type ExplorerTabsContextValue = {
  parentTabId?: string;
  tabDepth: number;
  rootExplorerId?: string;
  tabPath: string[];
};

const ExplorerTabsContext = createContext<ExplorerTabsContextValue | null>(
  null
);

export function useExplorerTabsContext() {
  return useContext(ExplorerTabsContext);
}

export function ExplorerTabsProvider({
  children,
  parentTabId,
  tabDepth = 0,
  rootExplorerId,
  tabPath = [],
}: {
  children: React.ReactNode;
  parentTabId?: string;
  tabDepth?: number;
  rootExplorerId?: string;
  tabPath?: string[];
}) {
  return (
    <ExplorerTabsContext.Provider
      value={{ parentTabId, tabDepth, rootExplorerId, tabPath }}
    >
      {children}
    </ExplorerTabsContext.Provider>
  );
}
