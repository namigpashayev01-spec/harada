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
    <section>
      <div className="wrapper">
        <h2 className="text-black text-[19px] md:text-[24px] lg:text-[38px] font-semibold">
          Categories
        </h2>
        <div className="mt-[20px] md:mt-[32px] overflow-hidden">
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
            breakpoints={{
              640: { spaceBetween: 16 },
              768: { spaceBetween: 24 },
            }}>
            {categories.map((item) => (
              <SwiperSlide key={item.id} className="!w-auto">
                <Link href={`/${lang}/places?category_id=${item.id}`}>
                  <div
                    style={{ backgroundColor: '#F6F9D4' }}
                    className="cursor-pointer flex flex-col items-center py-[16px] px-[24px] sm:py-[20px] sm:px-[40px] md:py-[24px] md:px-[60px] rounded-[12px] select-none">
                    <div className="h-[36px] w-[36px] sm:h-[44px] sm:w-[44px] md:h-[52px] md:w-[52px] flex items-center justify-center">
                      <Image
                        src={item.icon || '/placeholder.svg'}
                        alt={item.title || 'Category'}
                        width={52}
                        height={52}
                        className="object-cover h-[36px] w-[36px]"
                        priority
                      />
                    </div>
                    <span className="font-medium text-[16px] sm:text-[20px] md:text-[24px] pt-[8px] md:pt-[11px] text-[#68681E] whitespace-nowrap">
                      {item.title}
                    </span>
                  </div>
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
