import type React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { VALID_LANGUAGES } from '../../middleware';
import { Poppins, Raleway, Inter } from 'next/font/google';
import settingService from '@/services/setting.service';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const raleway = Raleway({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-raleway',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800'],
});

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await settingService.getSettings();
    const { seo_title, seo_description, favicon } = res.data;
    return {
      title: {
        default: seo_title || 'Diny',
        template: `%s | ${seo_title || 'Diny'}`,
      },
      description: seo_description || undefined,
      icons: { icon: favicon || undefined },
      alternates: {
        canonical: '/',
        languages: { 'en-US': '/en', 'az-AZ': '/az', 'ru-RU': '/ru' },
      },
    };
  } catch {
    return {
      title: { default: 'Diny', template: '%s | Diny' },
      alternates: {
        canonical: '/',
        languages: { 'en-US': '/en', 'az-AZ': '/az', 'ru-RU': '/ru' },
      },
    };
  }
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: Promise<{ lang?: string }>;
}>) {
  const resolvedParams = params ? await params : undefined;
  const paramLang = resolvedParams?.lang;
  const lang =
    paramLang && VALID_LANGUAGES.includes(paramLang) ? paramLang : 'en';

  return (
    <html lang={lang} suppressHydrationWarning>
      <body suppressHydrationWarning className={`${poppins.variable} ${raleway.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}
