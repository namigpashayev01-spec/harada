'use client';

import type React from 'react';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type Translations = Record<string, string>;

type LanguageContextType = {
  translations: Translations;
  lang: string;
  changeLang: (newLang: string) => void;
  isLoading: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function TranslateProvider({
  children,
  lang,
}: {
  children: React.ReactNode;
  lang: string;
}) {
  const [translations, setTranslations] = useState<Translations>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const changeLang = (newLang: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('NEXT_LOCALE', newLang);
    }

    const currentPath = pathname || '/';
    const segments = currentPath.split('/');
    segments[1] = newLang;
    router.push(segments.join('/'));
  };

  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          'https://evakuasiya.166tech.az/api/translates',
          {
            headers: {
              'Accept-Language': lang,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch translations');
        }

        const data = await response.json();

        setTranslations(data);
      } catch (error) {
        console.error('Error fetching translations:', error);
        setTranslations({});
      } finally {
        setIsLoading(false);
      }
    };

    fetchTranslations();
  }, [lang]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('NEXT_LOCALE', lang);
    }
  }, [lang]);

  return (
    <LanguageContext.Provider
      value={{ translations, lang, changeLang, isLoading }}>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      ) : (
        children
      )}
    </LanguageContext.Provider>
  );
}

export function useTranslate(key: string): string {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useTranslate must be used within a TranslateProvider');
  }

  return context.translations[key] || key;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('useLanguage must be used within a TranslateProvider');
  }

  return context;
}
