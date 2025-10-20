'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface TabSyncContextType {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
}

const TabSyncContext = createContext<TabSyncContextType | undefined>(undefined);

const CODING_LANGUAGES = [
  'python',
  'javascript',
  'typescript',
  'curl',
  'bash',
  'json',
  'java',
  'go',
  'rust',
  'php',
  'ruby',
  'swift',
  'kotlin',
  'dart',
  'r',
  'scala',
  'clojure',
  'elixir',
  'haskell',
  'julia',
  'matlab',
  'perl',
  'powershell',
  'sql',
  'shell',
];

const STORAGE_KEY = 'mistral-docs-selected-language';

export function TabSyncProvider({ children }: { children: React.ReactNode }) {
  const [selectedLanguage, setSelectedLanguageState] =
    useState<string>('python');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && CODING_LANGUAGES.includes(stored)) {
      setSelectedLanguageState(stored);
    }
  }, []);

  const setSelectedLanguage = (language: string) => {
    if (CODING_LANGUAGES.includes(language.toLowerCase())) {
      const normalizedLanguage = language.toLowerCase();
      setSelectedLanguageState(normalizedLanguage);
      localStorage.setItem(STORAGE_KEY, normalizedLanguage);
    }
  };

  return (
    <TabSyncContext.Provider value={{ selectedLanguage, setSelectedLanguage }}>
      {children}
    </TabSyncContext.Provider>
  );
}

export function useTabSync() {
  const context = useContext(TabSyncContext);
  if (context === undefined) {
    throw new Error('useTabSync must be used within a TabSyncProvider');
  }
  return context;
}

export function isCodingLanguage(language: string): boolean {
  return CODING_LANGUAGES.includes(language.toLowerCase());
}
