'use client';

import type React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TranslateProvider } from '@/context/TranlateContext';
import { AuthProvider } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { ValidLanguage } from '../../middleware';
import apiClient from '@/api';

type ProvidersProps = {
  children: React.ReactNode;
  lang: ValidLanguage;
};

export function Providers({ children, lang }: ProvidersProps) {
  useEffect(() => {
    apiClient.setLang(lang);
  }, [lang]);

  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 2,
            staleTime: 5000,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: 2,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TranslateProvider lang={lang}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </TranslateProvider>
    </QueryClientProvider>
  );
}
