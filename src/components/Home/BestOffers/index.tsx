'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { usePopularPlaces } from '@/hooks/usePopularPlaces';
import RestaurantCard from '@/components/shared/RestaurantCard';

interface BestOffersProps {
  lang: string;
}

const BestOffers = ({ lang }: BestOffersProps) => {
  const { data, isLoading } = usePopularPlaces();
  const categories = data?.data ?? [];

  const offers = Array.from(
    new Map(
      categories
        .flatMap((c) => c.restorans)
        .filter((r) => r.is_special_offer)
        .map((r) => [r.id, r]),
    ).values(),
  ).slice(0, 7);

  if (!isLoading && offers.length === 0) return null;

  return (
    <section className="section">
      <div className="wrapper">
        {/* Designed lime background panel */}
        <div
          className="relative overflow-hidden rounded-[28px] px-5 py-8 md:px-10 md:py-12"
          style={{
            background:
              'linear-gradient(135deg, #9fe870 0%, #b8f08f 55%, #8fdc5c 100%)',
          }}>
          {/* Decorative shapes */}
          <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-white/30" />
          <div className="pointer-events-none absolute right-10 top-28 h-24 w-24 rounded-full bg-white/20" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#006653]/15" />

          <div className="relative">
            <div className="mb-7 flex flex-col gap-1.5">
              <span className="inline-flex w-fit items-center rounded-full bg-[#14532d] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#9fe870]">
                Endirimlər
              </span>
              <h2 className="section-title !text-[#14532d]">
                Ən yaxşı təkliflər
              </h2>
              <p className="text-sm font-medium text-[#14532d]/80 md:text-base">
                Endirimli masalar — qənaət edərək rezerv et
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {/* Promo banner cell */}
              <div className="relative col-span-2 flex flex-col justify-between overflow-hidden rounded-xl bg-discount p-6 text-white lg:col-span-1">
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10" />
                <div className="pointer-events-none absolute -bottom-10 -left-6 h-28 w-28 rounded-full bg-white/10" />
                <div className="relative">
                  <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
                    Endirim
                  </span>
                  <h3 className="mt-4 text-2xl font-bold leading-tight md:text-3xl">
                    30%-ə qədər endirim
                  </h3>
                  <p className="mt-2 text-sm text-white/85">
                    Seçilmiş restoranlarda xüsusi təkliflər
                  </p>
                </div>
                <Link
                  href={`/${lang}/places`}
                  className="relative mt-6 inline-flex w-fit items-center gap-1.5 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-discount transition-colors hover:bg-white/90">
                  Təkliflərə bax <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Offer cards (unchanged white cards) */}
              {isLoading
                ? Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-[3/2] rounded-xl bg-white/40 animate-pulse"
                    />
                  ))
                : offers.map((place) => (
                    <RestaurantCard key={place.id} place={place} lang={lang} />
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestOffers;
