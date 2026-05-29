import apiClient from '@/api';
import Image from 'next/image';
import Link from 'next/link';
import {
  CalendarCheck,
  Zap,
  Star,
  UtensilsCrossed,
  Search,
  MousePointerClick,
  ArrowRight,
} from 'lucide-react';
import { getAboutDict } from '@/components/About/translations';

interface AboutData {
  id: number;
  title: string;
  description: string;
  monthly_members: number;
  seo_title: string;
  seo_description: string;
  image: string[] | string;
}

interface AboutResponse {
  data: AboutData;
}

const getAbout = async (): Promise<AboutResponse | null> => {
  try {
    return await apiClient.get<AboutResponse>('/about');
  } catch (error) {
    console.error('Error fetching about data:', error);
    return null;
  }
};

export default async function AboutContent({ lang }: { lang: string }) {
  const t = getAboutDict(lang);
  const response = await getAbout();
  const aboutData = response?.data;

  const monthlyMembers = aboutData?.monthly_members || 5000;
  const rawImage = Array.isArray(aboutData?.image)
    ? aboutData?.image?.[0]
    : aboutData?.image;
  // Only accept absolute URLs or root-relative paths; otherwise fall back.
  const image =
    rawImage && /^(https?:\/\/|\/)/.test(rawImage)
      ? rawImage
      : '/images/about.png';

  const stats = [
    { value: '500+', label: t.statRestaurants },
    { value: '50 000+', label: t.statReservations },
    { value: `${monthlyMembers.toLocaleString()}+`, label: t.statMembers },
    { value: '8 000+', label: t.statReviews },
  ];

  const featureIcons = [CalendarCheck, Zap, Star, UtensilsCrossed];
  const stepIcons = [Search, MousePointerClick, CalendarCheck];

  return (
    <div className="pb-20">
      {/* ---- Hero ---- */}
      <section className="pt-6 md:pt-10">
        <div className="wrapper">
          <div
            className="relative overflow-hidden rounded-[24px] px-6 py-14 text-white sm:px-12 md:py-20"
            style={{
              background:
                'linear-gradient(135deg, #013a30 0%, #006653 55%, #0a7d54 100%)',
            }}>
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-black/10" />
            <div className="relative z-10 max-w-3xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                ✦ {t.badge}
              </span>
              <h1 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[52px]">
                {t.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base text-white/85 md:text-lg">
                {t.subtitle}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href={`/${lang}/places`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#9fe870] px-6 py-3 text-sm font-semibold text-[#14532d] transition-colors hover:bg-[#8fdc5c]">
                  {t.ctaPrimary}
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={`/${lang}/contact`}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20">
                  {t.ctaSecondary}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Stats ---- */}
      <section className="mt-10 md:mt-14">
        <div className="wrapper">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:grid-cols-4 md:p-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-[#006653] md:text-4xl">
                  {s.value}
                </p>
                <p className="mt-1 text-sm text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- Story ---- */}
      <section className="mt-16 md:mt-24">
        <div className="wrapper">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl">
                <Image
                  src={image}
                  alt={t.storyTitle}
                  className="h-full w-full object-cover"
                  width={589}
                  height={500}
                />
              </div>
              {/* Floating stat cards */}
              <div className="absolute -right-4 top-10 hidden rounded-2xl bg-white px-5 py-3 shadow-lg md:block">
                <p className="text-xs text-gray-500">{t.monthlyMembersLabel}</p>
                <p className="text-3xl font-bold text-[#006653]">
                  {monthlyMembers.toLocaleString()}+
                </p>
              </div>
              <div className="absolute -bottom-4 left-6 hidden items-center gap-2 rounded-2xl bg-white px-5 py-3 shadow-lg md:flex">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <p className="text-base font-bold text-gray-900">
                  8 000+ {t.reviewsLabel}
                </p>
              </div>
            </div>

            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-[#006653]">
                {t.badge}
              </span>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
                {t.storyTitle}
              </h2>
              <div className="mt-5 space-y-4 text-base leading-relaxed text-gray-600 md:text-lg">
                {t.storyParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Features ---- */}
      <section className="mt-20 md:mt-28">
        <div className="wrapper">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {t.featuresTitle}
            </h2>
            <p className="mt-3 text-gray-600">{t.featuresSubtitle}</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {t.features.map((f, i) => {
              const Icon = featureIcons[i] ?? Star;
              return (
                <div
                  key={f.title}
                  className="rounded-2xl border border-gray-100 bg-white p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eefae1]">
                    <Icon className="h-6 w-6 text-[#006653]" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-gray-900">
                    {f.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- How it works ---- */}
      <section className="mt-20 md:mt-28">
        <div className="wrapper">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              {t.stepsTitle}
            </h2>
            <p className="mt-3 text-gray-600">{t.stepsSubtitle}</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            {t.steps.map((s, i) => {
              const Icon = stepIcons[i] ?? Search;
              return (
                <div key={s.title} className="relative text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#006653] text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="mt-4 inline-block text-sm font-bold text-[#9fe870]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-1 text-lg font-semibold text-gray-900">
                    {s.title}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-gray-600">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="mt-20 md:mt-28">
        <div className="wrapper">
          <div
            className="relative overflow-hidden rounded-[24px] px-6 py-12 text-center text-white sm:px-12 md:py-16"
            style={{
              background:
                'linear-gradient(135deg, #013a30 0%, #006653 60%, #0a7d54 100%)',
            }}>
            <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-white/5" />
            <div className="relative z-10 mx-auto max-w-2xl">
              <h2 className="text-2xl font-bold md:text-3xl">{t.ctaTitle}</h2>
              <p className="mt-3 text-white/85">{t.ctaText}</p>
              <Link
                href={`/${lang}/contact`}
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-[#9fe870] px-7 py-3.5 text-sm font-semibold text-[#14532d] transition-colors hover:bg-[#8fdc5c]">
                {t.ctaButton}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
