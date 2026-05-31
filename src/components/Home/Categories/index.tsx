'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import { useCategories } from '@/hooks/useCategories';
import { useParams } from 'next/navigation';
import 'swiper/css';
import 'swiper/css/free-mode';

const Categories = () => {
  const { data } = useCategories();
  const categories = data?.data ?? [];
  const { lang } = useParams<{ lang: string }>();

  return (
    <section className="section">
      <div className="wrapper">
        <h2 className="section-title">Mətbəx üzrə bax</h2>
        <p className="mt-1.5 text-sm md:text-base text-muted-foreground">
          Bu gün nə yemək istəyirsən?
        </p>

        <div className="mt-6 md:mt-8 overflow-hidden py-4">
          <Swiper
            modules={[FreeMode, Mousewheel]}
            slidesPerView="auto"
            spaceBetween={16}
            freeMode={{ enabled: true, sticky: false }}
            mousewheel={{ forceToAxis: true, sensitivity: 1 }}
            grabCursor
            className="!overflow-visible">
            {categories.map((item) => (
              <SwiperSlide key={item.id} className="!w-auto">
                <Link
                  href={`/${lang}/places?category_id=${item.id}`}
                  className="card-hover group flex h-[132px] w-[132px] sm:h-[150px] sm:w-[150px] flex-col items-center justify-center gap-2.5 rounded-2xl bg-white p-3 select-none group-hover:bg-brand hover:bg-brand">
                  <div className="relative h-20 w-20 sm:h-24 sm:w-24 overflow-hidden rounded-full bg-orange-soft ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105 group-hover:ring-2 group-hover:ring-brand">
                    <Image
                      src={item.icon || '/placeholder.svg'}
                      alt={item.title || 'Category'}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-center text-[13px] font-medium leading-tight text-gray-700 line-clamp-2 group-hover:text-brand-ink transition-colors">
                    {item.title}
                  </span>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Categories;
