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
          className="relative overflow-hidden rounded-[28px] px-5 py-8 ring-1 ring-inset ring-white/40 md:px-10 md:py-12"
          style={{
            background:
              'radial-gradient(125% 125% at 100% 0%, #c6f3a1 0%, #9fe870 48%, #84d653 100%)',
          }}>
          {/* Soft decorative blobs */}
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-white/45 blur-3xl" />
          <div className="pointer-events-none absolute right-1/3 top-1/2 h-44 w-44 rounded-full bg-white/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-[#006653]/20 blur-3xl" />
          {/* Subtle dotted texture */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage: 'radial-gradient(#14532d 1px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />

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
              <div
                className="relative col-span-2 flex flex-col justify-between overflow-hidden rounded-2xl p-6 text-white lg:col-span-1"
                style={{
                  background:
                    'linear-gradient(150deg, #006653 0%, #00513f 100%)',
                }}>
                <div className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[#9fe870]/20 blur-2xl" />
                <div className="pointer-events-none absolute -bottom-12 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="relative">
                  <span className="inline-flex items-center rounded-full bg-[#9fe870] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#14532d]">
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
                  className="relative mt-6 inline-flex w-fit items-center gap-1.5 rounded-lg bg-[#9fe870] px-4 py-2.5 text-sm font-semibold text-[#14532d] transition-colors hover:bg-[#8fdc5c]">
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
