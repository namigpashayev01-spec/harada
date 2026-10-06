import type React from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';
import { headers } from 'next/headers';
import './globals.css';
import { VALID_LANGUAGES } from '../../middleware';
import { HTML_LANG } from '@/lib/locales';
import { Poppins, Raleway, Inter } from 'next/font/google';
import settingService from '@/services/setting.service';
import { SITE_URL, buildSocial } from '@/lib/seo';

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
  // Same request-header fallback the layout uses, so the default social card
  // gets the right locale (og:locale) for the visitor's language.
  const headerLang = (await headers()).get('x-next-locale') ?? undefined;
  const lang =
    headerLang && VALID_LANGUAGES.includes(headerLang) ? headerLang : 'az';

  try {
    const res = await settingService.getSettings();
    const { seo_title, seo_description, favicon } = res.data;
    const brand = seo_title || 'Harada Oturaq';
    return {
      title: {
        default: brand,
        template: `%s | ${brand}`,
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
      ...buildSocial({
        lang,
        title: brand,
        description: seo_description || undefined,
      }),
    };
  } catch {
    return {
      metadataBase: new URL(SITE_URL),
      title: { default: 'Harada Oturaq', template: '%s | Harada Oturaq' },
      robots: { index: true, follow: true },
      verification: {
        google: 'EllxZxZ68GlUGwLx8AKxr9p1yITlOnBZMBrXVRXNDCk',
      },
      ...buildSocial({ lang, title: 'Harada Oturaq' }),
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
    <html lang={HTML_LANG[lang] ?? lang} suppressHydrationWarning>
      <body suppressHydrationWarning className={`${poppins.variable} ${raleway.variable} ${inter.variable}`}>
        {/* Daxil olmuş istifadəçinin nömrəsini GTM yüklənməzdən ƏVVƏL dataLayer-ə
            qoyur — belə olmasa ilk səhifə baxışı user_id-siz gedərdi. */}
        <Script id="user-id-bootstrap" strategy="beforeInteractive">
          {`(function(){try{var u=window.localStorage.getItem('diny_user_id');
window.dataLayer=window.dataLayer||[];if(u){window.dataLayer.push({user_id:u});}}catch(e){}})();`}
        </Script>
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
        {/* GA4 (G-C8JSE9HW9K) artıq GTM konteynerindən idarə olunur —
            burada ayrıca gtag.js saxlamaq baxışları ikiqat sayardı. */}
        {children}
      </body>
    </html>
  );
}
