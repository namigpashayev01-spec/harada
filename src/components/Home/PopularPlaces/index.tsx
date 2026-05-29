'use client';

import { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import PlacesCategories from './PlacesCategories';
import { usePopularPlaces } from '@/hooks/usePopularPlaces';
import RestaurantCard from '@/components/shared/RestaurantCard';

interface PopularPlacesProps {
  lang: string;
}

const PopularPlaces = ({ lang }: PopularPlacesProps) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);

  const { data, isLoading } = usePopularPlaces();
  const categories = data?.data ?? [];

  useEffect(() => {
    if (categories.length > 0 && activeCategoryId === null) {
      setActiveCategoryId(categories[0].id);
    }
  }, [categories]);

  const rawRestorans =
    activeCategoryId === null
      ? categories.flatMap((c) => c.restorans)
      : (categories.find((c) => c.id === activeCategoryId)?.restorans ?? []);

  // De-duplicate by id (a restaurant can belong to multiple categories).
  const filteredRestorans = Array.from(
    new Map(rawRestorans.map((r) => [r.id, r])).values(),
  );

  return (
    <section className="section">
      <div className="wrapper">
        <div className="mb-7 flex items-end justify-between">
          <div>
            <h2 className="section-title">Populyar restoranlar</h2>
            <p className="mt-1.5 text-sm md:text-base text-muted-foreground">
              Bakıda insanların rezerv etməyi sevdiyi məkanlar
            </p>
          </div>
          <Link
            href={`/${lang}/places`}
            className="hidden md:inline-flex items-center font-medium text-brand-ink hover:text-brand-ink/80 transition-colors">
            Hamısına bax <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/2] rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <PlacesCategories
                categories={categories}
                activeCategoryId={activeCategoryId}
                setActiveCategoryId={setActiveCategoryId}
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredRestorans.map((place) => (
                <RestaurantCard key={place.id} place={place} lang={lang} />
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Link
                href={`/${lang}/places`}
                className="inline-flex items-center font-medium text-brand-ink hover:text-brand-ink/80 transition-colors">
                Hamısına bax <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PopularPlaces;
