'use client';

import { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import Image from 'next/image';
import 'swiper/css';
import 'swiper/css/free-mode';
import { PlaceCategory } from '@/types/place';

interface PlacesCategoriesProps {
  categories: PlaceCategory[];
  activeCategoryId: number | null;
  setActiveCategoryId: (id: number | null) => void;
}

const PlacesCategories = ({
  categories,
  activeCategoryId,
  setActiveCategoryId,
}: PlacesCategoriesProps) => {
  const swiperRef = useRef<SwiperType | null>(null);

  const handleCategoryClick = (
    e: React.MouseEvent,
    categoryId: number | null,
  ) => {
    if (swiperRef.current && swiperRef.current.touches.diff !== undefined) {
      const diff = Math.abs(swiperRef.current.touches.diff);
      if (diff > 5) {
        e.preventDefault();
        return;
      }
    }
    setActiveCategoryId(categoryId);
  };

  return (
    <div className="overflow-hidden py-2">
      <Swiper
        onBeforeInit={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[FreeMode, Mousewheel]}
        slidesPerView="auto"
        spaceBetween={10}
        freeMode={{
          enabled: true,
          sticky: false,
          momentumRatio: 0.5,
          momentumVelocityRatio: 0.5,
        }}
        mousewheel={{
          forceToAxis: true,
          sensitivity: 1,
        }}
        grabCursor={true}
        resistance={true}
        resistanceRatio={0.85}
        className="categories-swiper !overflow-visible">
        {categories.map((category) => (
          <SwiperSlide key={category.id} className="!w-auto">
            <button
              onClick={(e) => handleCategoryClick(e, category.id)}
              className={`group flex items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-all select-none sm:px-5 sm:py-2.5 ${
                activeCategoryId === category.id
                  ? 'border-[#006653] bg-[#006653] text-white shadow-[0_4px_14px_rgba(0,102,83,0.25)]'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-[#006653]/50 hover:text-[#006653]'
              }`}>
              {category.icon && (category.icon.startsWith('http') || category.icon.startsWith('/')) && (
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center overflow-hidden rounded-full transition-colors ${
                    activeCategoryId === category.id ? 'bg-white/20' : 'bg-gray-50'
                  }`}>
                  <Image
                    src={category.icon}
                    alt={category.title || 'Category'}
                    width={14}
                    height={14}
                    className="object-contain pointer-events-none"
                  />
                </span>
              )}
              {category.title}
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PlacesCategories;
