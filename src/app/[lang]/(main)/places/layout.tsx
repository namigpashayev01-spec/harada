import type { Metadata } from 'next';
import React from 'react';
import { pageAlternates } from '@/lib/seo';
import { t } from '@/lib/i18n';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { absolute: t(lang, 'seo.places.title') },
    description: t(lang, 'seo.places.description'),
    alternates: pageAlternates(lang, '/places'),
  };
}

export default function PlacesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
