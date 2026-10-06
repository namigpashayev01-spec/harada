import type React from 'react';
import { notFound } from 'next/navigation';
import { VALID_LANGUAGES, type ValidLanguage } from '../../../middleware';
import { Providers } from '@/providers';
import { getDictionary } from '@/lib/i18n';
import { siteSchema } from '@/lib/schema';
import JsonLd from '@/components/JsonLd';

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
    <Providers lang={lang as ValidLanguage} dictionary={getDictionary(lang)}>
      {/* Organization + WebSite identity, emitted once per page in every
          language so the brand panel and sitelinks search box can appear. */}
      <JsonLd data={siteSchema(lang)} />
      {children}
    </Providers>
  );
}