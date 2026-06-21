import type { Metadata } from 'next';
import React from 'react';
import { pageAlternates } from '@/lib/seo';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { absolute: 'Restoranlar — Yaxınlıqda yemək yeri | Harada Oturaq' },
    description:
      'Xəritədə yaxınlığındakı restoranları tap; mətbəx, qiymət və xüsusiyyətlərə görə filtrlə, ən uyğun yeməyi seç.',
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
