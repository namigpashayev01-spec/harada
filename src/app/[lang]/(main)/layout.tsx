import Footer from '@/components/layout/Footer';
import Navbar from '@/components/layout/Navbar';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import settingService from '@/services/setting.service';
import type React from 'react';
import Script from 'next/script';

export default async function MainLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  let logo = '';
  let footerLogo = '';
  try {
    const res = await settingService.getSettings();
    logo = res.data.logo;
    footerLogo = res.data.footer_logo;
  } catch {}

  return (
    <>
      <Script
        src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
        strategy="afterInteractive"
      />
      <main className="min-h-screen pt-0 md:pt-[76px] pb-[60px] md:pb-0">
        <Navbar logo={logo} />
        {children}
        <Footer lang={lang} footerLogo={footerLogo} />
        <MobileBottomNav />
      </main>
    </>
  );
}
