import type React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { headers } from 'next/headers';
import './globals.css';
import { VALID_LANGUAGES } from '../../middleware';
import { Poppins, Raleway, Inter } from 'next/font/google';
import settingService from '@/services/setting.service';
import { SITE_URL } from '@/lib/seo';

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
      metadataBase: new URL(SITE_URL),
      description: seo_description || undefined,
      icons: {
        icon: favicon || undefined,
        apple: '/apple-touch-icon.png',
      },
      robots: { index: true, follow: true },
      verification: {
        google: 'EllxZxZ68GlUGwLx8AKxr9p1yITlOnBZMBrXVRXNDCk',
      },
    };
  } catch {
    return {
      metadataBase: new URL(SITE_URL),
      title: { default: 'Diny', template: '%s | Diny' },
      robots: { index: true, follow: true },
      verification: {
        google: 'EllxZxZ68GlUGwLx8AKxr9p1yITlOnBZMBrXVRXNDCk',
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
  // The root layout sits above the [lang] segment, so it can't read the route
  // param — fall back to the locale the middleware put on the request header.
  const headerLang = (await headers()).get('x-next-locale') ?? undefined;
  const candidate = paramLang || headerLang;
  const lang =
    candidate && VALID_LANGUAGES.includes(candidate) ? candidate : 'en';

  return (
    <html lang={lang} suppressHydrationWarning>
      <body suppressHydrationWarning className={`${poppins.variable} ${raleway.variable} ${inter.variable}`}>
        {/* Google Tag Manager */}
        <Script id="gtm" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TF5ZPC2B');`}
        </Script>
        {/* End Google Tag Manager */}
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TF5ZPC2B"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        {/* End Google Tag Manager (noscript) */}
        {/* Google tag (gtag.js) — GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-C8JSE9HW9K"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-C8JSE9HW9K');`}
        </Script>
        {/* End Google tag (gtag.js) */}
        {children}
      </body>
    </html>
  );
}
