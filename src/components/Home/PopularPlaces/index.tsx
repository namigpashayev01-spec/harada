'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import Link from 'next/link';
import Image from 'next/image';
import PlacesCategories from './PlacesCategories';
import { usePopularPlaces } from '@/hooks/usePopularPlaces';
import { ISlug } from '@/types';
import FavoriteButton from '@/components/common/FavoriteButton';

interface PopularPlacesProps {
  lang: string;
}

const getSlug = (place: { slug?: ISlug; id: number }, lang: string): string => {
  const s = place.slug;
  if (!s) return String(place.id);
  return s[lang as keyof ISlug] || s.az || s.en || s.ru || String(place.id);
};

const PopularPlaces = ({ lang }: PopularPlacesProps) => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

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

  // A restaurant can belong to multiple categories, so de-duplicate by id
  // to avoid duplicate React keys when showing all categories.
  const filteredRestorans = Array.from(
    new Map(rawRestorans.map((r) => [r.id, r])).values(),
  );


  return (
    <section className="py-8 md:py-12">
      <div className="wrapper">
        <div className="mb-6 flex items-start justify-between">
          <h2 className="text-black text-[19px] md:text-[24px] lg:text-[38px] font-semibold">
            Popular Places
          </h2>
          <Link
            href={`/${lang}/places`}
            className="hidden md:flex items-center text-orange-500 hover:text-orange-600 transition-colors">
            View all <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {isLoading ? (
          <div className="h-[300px] rounded-[8px] bg-gray-100 animate-pulse" />
        ) : (
          <>
            <PlacesCategories
              categories={categories}
              activeCategoryId={activeCategoryId}
              setActiveCategoryId={setActiveCategoryId}
            />

            <div className="relative">
              <Swiper
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper;
                }}
                onProgress={(swiper, p) => setProgress(p)}
                slidesPerView={1.2}
                spaceBetween={16}
                modules={[Navigation]}
                breakpoints={{
                  640: { slidesPerView: 2 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3.5, spaceBetween: 20 },
                  1280: { slidesPerView: 4, spaceBetween: 24 },
                  1536: { slidesPerView: 4.5, spaceBetween: 24 },
                  1920: { slidesPerView: 5, spaceBetween: 24 },
                }}
                className="places-swiper">
                {filteredRestorans.map((place) => (
                  <SwiperSlide key={place.id} className="h-auto">
                    <Link
                      href={`/${lang}/places/${getSlug(place, lang)}`}
                      className="block h-full">
                      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                        <div className="relative h-48 flex-shrink-0">
                          <Image
                            src={place.image}
                            alt={place.title || 'Restaurant'}
                            fill
                            className="object-cover"
                          />
                          {place.is_vip && (
                            <span className="absolute top-3 left-3 bg-[#F57D0D] text-white text-xs font-semibold px-2 py-0.5 rounded-full z-10">
                              VIP
                            </span>
                          )}
                          <div className="absolute top-3 right-3 z-10">
                            <FavoriteButton restaurantId={place.id} variant="card" size={18} />
                          </div>
                          <div className="absolute bottom-0 left-0 w-full h-1/4 bg-gradient-to-t from-black/30 to-transparent" />
                        </div>

                        <div className="p-4 flex-grow flex flex-col">
                          <h3 className="font-medium text-lg text-gray-900 line-clamp-2">
                            {place.title}
                          </h3>
                          {place.address && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {place.address}
                            </p>
                          )}
                          {place.properties?.flatMap((p) => p.sub_properties)
                            .length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {place.properties
                                .flatMap((p) => p.sub_properties)
                                .slice(0, 3)
                                .map((prop) => (
                                  <span
                                    key={prop.id}
                                    className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                    {prop.title}
                                  </span>
                                ))}
                              {place.properties.flatMap((p) => p.sub_properties)
                                .length > 3 && (
                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +
                                  {place.properties.flatMap(
                                    (p) => p.sub_properties,
                                  ).length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  </SwiperSlide>
                ))}
              </Swiper>
              <div className="flex items-center justify-center md:justify-end mt-8 gap-3">
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <div className="w-24 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F57D0D] rounded-full transition-all duration-300"
                    style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%` }}
                  />
                </div>
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-6 text-center md:hidden">
              <Link
                href={`/${lang}/places`}
                className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default PopularPlaces;
