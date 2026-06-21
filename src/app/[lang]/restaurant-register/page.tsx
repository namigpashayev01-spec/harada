import type { Metadata } from 'next';
import { Check, Phone, Mail } from 'lucide-react';
import RegisterHeader from '@/components/RestaurantRegister/RegisterHeader';
import RestaurantRegisterForm from '@/components/RestaurantRegister/RestaurantRegisterForm';
import {
  getRestaurantRegisterDict,
  SUPPORT_PHONE,
  SUPPORT_EMAIL,
} from '@/components/RestaurantRegister/translations';
import settingService from '@/services/setting.service';
import { pageAlternates } from '@/lib/seo';

interface PageProps {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  return {
    title: { absolute: 'Restoranını qeydiyyatdan keçir | Harada Oturaq' },
    description:
      'Restoranını Harada Oturaq platformasına əlavə et, yeni müştərilərə çat və onlayn rezervasiya qəbul etməyə başla.',
    alternates: pageAlternates(lang, '/restaurant-register'),
  };
}

export default async function RestaurantRegisterPage({ params }: PageProps) {
  const { lang } = await params;
  const t = getRestaurantRegisterDict(lang);

  let logo = '';
  try {
    const res = await settingService.getSettings();
    logo = res.data.logo;
  } catch {}

  return (
    <div className="min-h-screen bg-gray-50">
      <RegisterHeader lang={lang} logo={logo} t={t} />

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
        <div className="grid gap-8 lg:grid-cols-[360px_1fr] lg:items-start">
          {/* Branded info panel */}
          <aside className="overflow-hidden rounded-3xl bg-gradient-to-br from-[#013a30] via-[#006653] to-[#0a7d54] p-8 text-white lg:sticky lg:top-24">
            <span className="inline-block rounded-full bg-[#9fe870]/25 px-4 py-1.5 text-sm font-semibold text-[#9fe870]">
              {t.badge}
            </span>
            <h1 className="mt-5 text-2xl font-bold leading-tight md:text-3xl">
              {t.heading}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/85">
              {t.subtitle}
            </p>

            <ul className="mt-7 space-y-3">
              {t.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-white/90">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#9fe870]">
                    <Check className="h-3 w-3 text-[#14532d]" />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            {/* Help / contact card */}
            <div
              id="help"
              className="mt-8 scroll-mt-24 rounded-2xl bg-white/10 p-5 ring-1 ring-white/15">
              <p className="font-semibold text-white">{t.helpTitle}</p>
              <p className="mt-1 text-sm leading-relaxed text-white/80">
                {t.helpText}
              </p>
              <div className="mt-4 space-y-2">
                <a
                  href={`tel:${SUPPORT_PHONE.replace(/\s/g, '')}`}
                  className="flex items-center gap-2.5 text-sm font-medium text-white transition-colors hover:text-[#9fe870]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Phone className="h-4 w-4" />
                  </span>
                  {SUPPORT_PHONE}
                </a>
                <a
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="flex items-center gap-2.5 text-sm font-medium text-white transition-colors hover:text-[#9fe870]">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10">
                    <Mail className="h-4 w-4" />
                  </span>
                  {SUPPORT_EMAIL}
                </a>
              </div>
            </div>
          </aside>

          {/* Form */}
          <div>
            <RestaurantRegisterForm t={t} />
          </div>
        </div>
      </div>
    </div>
  );
}
