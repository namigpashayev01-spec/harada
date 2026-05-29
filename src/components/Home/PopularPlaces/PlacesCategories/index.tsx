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
    <div className="mb-8 overflow-hidden">
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
              className={`whitespace-nowrap px-6 py-2.5 flex items-center gap-2 rounded-full font-semibold text-sm md:text-base transition-colors select-none ${
                activeCategoryId === category.id
                  ? 'bg-[#F57D0D] text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}>
              {category.icon && (category.icon.startsWith('http') || category.icon.startsWith('/')) && (
                <Image
                  src={category.icon}
                  alt={category.title || 'Category'}
                  width={16}
                  height={16}
                  className="object-contain pointer-events-none"
                />
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
