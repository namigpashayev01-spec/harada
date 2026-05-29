'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import {
  Beer,
  Briefcase,
  CakeSlice,
  Coffee,
  CupSoda,
  EggFried,
  Fish,
  Leaf,
  Pizza,
  Salad,
  Sandwich,
  Soup,
  Utensils,
  type LucideIcon,
} from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';
import { useParams } from 'next/navigation';
import 'swiper/css';
import 'swiper/css/free-mode';

// Map a category title (az/en) to a matching white line icon.
const getCategoryIcon = (title: string): LucideIcon => {
  const t = title.toLowerCase();
  if (t.includes('pizza')) return Pizza;
  if (t.includes('fast')) return Sandwich;
  if (t.includes('qəhvə') || t.includes('coffee') || t.includes('kofe')) return Coffee;
  if (t.includes('çay') || t.includes('cay') || t.includes('tea')) return CupSoda;
  if (t.includes('pivə') || t.includes('pive') || t.includes('beer')) return Beer;
  if (
    t.includes('şirniyyat') ||
    t.includes('sirniyyat') ||
    t.includes('dessert') ||
    t.includes('sweet')
  )
    return CakeSlice;
  if (t.includes('veget')) return Leaf;
  if (t.includes('salat') || t.includes('salad')) return Salad;
  if (t.includes('business') || t.includes('lunch')) return Briefcase;
  if (t.includes('səhər') || t.includes('seher') || t.includes('breakfast')) return EggFried;
  if (t.includes('xəngəl') || t.includes('xengel') || t.includes('dumpling')) return Soup;
  if (
    t.includes('dəniz') ||
    t.includes('deniz') ||
    t.includes('seafood') ||
    t.includes('fish') ||
    t.includes('balıq')
  )
    return Fish;
  return Utensils;
};

// Left-anchored colored gradients (fade out early so the photo stays visible).
const GRADIENTS = [
  'linear-gradient(90deg, #E8730C 0%, rgba(232,115,12,0.9) 22%, rgba(232,115,12,0.2) 42%, rgba(232,115,12,0) 52%)',
  'linear-gradient(90deg, #1F9D45 0%, rgba(31,157,69,0.9) 22%, rgba(31,157,69,0.2) 42%, rgba(31,157,69,0) 52%)',
];

const Categories = () => {
  const { data } = useCategories();
  const categories = data?.data ?? [];
  const { lang } = useParams<{ lang: string }>();

  return (
    <section className="py-8 md:py-12">
      <div className="wrapper">
        <h2 className="text-black text-[19px] md:text-[24px] lg:text-[38px] font-semibold">
          Categories
        </h2>

        <div className="mt-[16px] md:mt-[24px] overflow-hidden">
          <Swiper
            modules={[FreeMode, Mousewheel]}
            slidesPerView="auto"
            spaceBetween={12}
            freeMode={{
              enabled: true,
              sticky: false,
              momentumRatio: 0.5,
              momentumVelocityRatio: 0.5,
            }}
            mousewheel={{ forceToAxis: true, sensitivity: 1 }}
            grabCursor
            resistance
            resistanceRatio={0.85}
            className="categories-swiper !overflow-visible">
            {categories.map((item, index) => {
              const Icon = getCategoryIcon(item.title || '');
              const gradient = GRADIENTS[index % GRADIENTS.length];

              return (
                <SwiperSlide
                  key={item.id}
                  className="!w-[180px] sm:!w-[200px] md:!w-[220px]">
                  <Link
                    href={`/${lang}/places?category_id=${item.id}`}
                    className="group relative block overflow-hidden rounded-[10px] h-[72px] sm:h-[80px] bg-gray-100 select-none">
                    <Image
                      src={item.icon || '/placeholder.svg'}
                      alt={item.title || 'Category'}
                      fill
                      sizes="220px"
                      className="object-contain object-right transition-transform duration-300 group-hover:scale-105"
                    />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: gradient }}
                    />
                    <div className="relative z-10 flex h-full items-center gap-2 px-3">
                      <Icon
                        className="h-5 w-5 sm:h-6 sm:w-6 text-white shrink-0 drop-shadow"
                        strokeWidth={1.6}
                      />
                      <span className="text-white font-semibold text-[13px] sm:text-sm leading-tight line-clamp-2 drop-shadow">
                        {item.title}
                      </span>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Categories;
