import type React from 'react';
import { notFound } from 'next/navigation';
import { VALID_LANGUAGES, type ValidLanguage } from '../../../middleware';
import { Providers } from '@/providers';

type LangLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function LangLayout({
  children,
  params,
}: LangLayoutProps) {
  const { lang } = await params;

  if (!VALID_LANGUAGES.includes(lang as ValidLanguage)) {
    notFound();
  }

  return (
    <Providers lang={lang as ValidLanguage}>
      {children}
    </Providers>
  );
}