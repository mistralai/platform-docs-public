'use client';

import { useState } from 'react';
declare global {
  interface Window {
    API_SELECTED_LANGUAGE: string;
  }
}

const KEY = 'speakeasy-api-selected-language';
export const useSelectedLang = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(() =>
    typeof document !== 'undefined'
      ? document.documentElement.dataset.selectedLanguage || 'typescript'
      : 'typescript'
  );

  const setSelectedLanguageFunction = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem(KEY, language);
    document.documentElement.dataset.selectedLanguage = language;
    window.API_SELECTED_LANGUAGE = language;
  };

  return { selectedLanguage, setSelectedLanguage: setSelectedLanguageFunction };
};

const isNullOrUndefined = (
  value: any
): value is null | undefined | '' | 'undefined' | 'null' => {
  return (
    value === null ||
    value === undefined ||
    value === '' ||
    value === 'undefined' ||
    value === 'null'
  );
};
