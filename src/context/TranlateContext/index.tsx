'use client';

import type React from 'react';

import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { interpolate } from '@/lib/i18n/types';
import type { Dictionary, TranslateVars } from '@/lib/i18n/types';

type LanguageContextType = {
  translations: Dictionary;
  lang: string;
  changeLang: (newLang: string) => void;
  /** Kept for backwards compatibility — dictionaries are local now, so nothing
   *  is ever loading. Consumers that branched on it stay correct. */
  isLoading: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

/**
 * Holds the active language's UI strings for client components.
 *
 * The dictionary is handed down from the `[lang]` server layout rather than
 * fetched: it is present on the very first (server) render, so crawlers and
 * users both see real text instead of raw keys, and only one language's strings
 * are shipped to the browser.
 *
 * (This used to fetch `evakuasiya.166tech.az/api/translates` — a different
 * project's tow-truck dictionary that had none of this site's keys.)
 */
export function TranslateProvider({
  children,
  lang,
  dictionary,
}: {
  children: React.ReactNode;
  lang: string;
  dictionary: Dictionary;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const changeLang = useCallback(
    (newLang: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('NEXT_LOCALE', newLang);
        // The middleware reads the language from this cookie when a visitor
        // lands on a path without a language prefix.
        document.cookie = `NEXT_LOCALE=${newLang};path=/;max-age=31536000;samesite=lax`;
      }

      const currentPath = pathname || '/';
      const segments = currentPath.split('/');
      segments[1] = newLang;
      router.push(segments.join('/'));
    },
    [pathname, router]
  );

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('NEXT_LOCALE', lang);
      document.cookie = `NEXT_LOCALE=${lang};path=/;max-age=31536000;samesite=lax`;
    }
  }, [lang]);

  const value = useMemo(
    () => ({ translations: dictionary, lang, changeLang, isLoading: false }),
    [dictionary, lang, changeLang]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

function useLanguageContext(hook: string) {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error(`${hook} must be used within a TranslateProvider`);
  }

  return context;
}

/** Translate one key: `useTranslate('nav.home')`. */
export function useTranslate(key: string, vars?: TranslateVars): string {
  const { translations } = useLanguageContext('useTranslate');

  return interpolate(translations[key] ?? key, vars);
}

/**
 * Translate many keys from one component:
 * `const t = useT(); t('nav.home')`
 */
export function useT() {
  const { translations } = useLanguageContext('useT');

  return useCallback(
    (key: string, vars?: TranslateVars): string =>
      interpolate(translations[key] ?? key, vars),
    [translations]
  );
}

export function useLanguage() {
  return useLanguageContext('useLanguage');
}
