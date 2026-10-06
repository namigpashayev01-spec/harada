import type { Metadata } from 'next';
import { Suspense } from 'react';
import ThankYou from '@/components/Places/ReservationThankYou';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const titles: Record<string, string> = {
    az: 'Rezervasiyanız göndərildi | Harada Oturaq',
    en: 'Your reservation has been sent | Harada Oturaq',
    ru: 'Ваша бронь отправлена | Harada Oturaq',
  };

  return {
    title: { absolute: titles[lang] ?? titles.az },
    // Şəxsi əməliyyat səhifəsidir — axtarışda görünməməlidir
    robots: { index: false, follow: false },
  };
}

export default async function ReservationThankYouPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <Suspense fallback={<div className="min-h-[60vh]" />}>
      <ThankYou lang={lang} />
    </Suspense>
  );
}
