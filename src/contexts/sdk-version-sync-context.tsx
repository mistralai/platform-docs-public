'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SDKVersionSyncContextType {
  selectedSDKVersion: string;
  setSelectedSDKVersion: (version: string) => void;
}

const SDKVersionSyncContext = createContext<
  SDKVersionSyncContextType | undefined
>(undefined);

const SDK_VERSIONS = ['v1', 'v2'];

const STORAGE_KEY = 'mistral-docs-selected-sdk-version';

export function SDKVersionSyncProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedSDKVersion, setSelectedSDKVersionState] =
    useState<string>('v2');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SDK_VERSIONS.includes(stored)) {
      setSelectedSDKVersionState(stored);
    }
  }, []);

  const setSelectedSDKVersion = (version: string) => {
    const normalized = version.toLowerCase();
    if (SDK_VERSIONS.includes(normalized)) {
      setSelectedSDKVersionState(normalized);
      localStorage.setItem(STORAGE_KEY, normalized);
    }
  };

  return (
    <SDKVersionSyncContext.Provider
      value={{ selectedSDKVersion, setSelectedSDKVersion }}
    >
      {children}
    </SDKVersionSyncContext.Provider>
  );
}

export function useSDKVersionSync() {
  const context = useContext(SDKVersionSyncContext);
  if (context === undefined) {
    throw new Error(
      'useSDKVersionSync must be used within a SDKVersionSyncProvider'
    );
  }
  return context;
}

export function isSDKVersion(value: string): boolean {
  return SDK_VERSIONS.includes(value.toLowerCase());
}
