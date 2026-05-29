'use client';
import { useRef } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useParams } from 'next/navigation';
import 'swiper/css';
import 'swiper/css/pagination';
import { useBlogs } from '@/hooks/useBlogs';
import BlogCard from '@/components/shared/BlogCard';

const BlogList = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const params = useParams();
  const lang = (params?.lang as string) || 'az';

  const { data } = useBlogs();

  const blogData = data?.data ?? [];

  return (
    <section className="section">
      <div className="wrapper">
        <div className="flex flex-col gap-1.5">
          <h2 className="section-title">Bloqumuzdan</h2>
          <p className="text-sm md:text-base text-muted-foreground">
            Süfrədən məsləhətlər, bələdçilər və hekayələr
          </p>
        </div>
        <div className="relative pt-7">
          <Swiper
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            slidesPerView={1.2}
            spaceBetween={16}
            modules={[Navigation, Pagination]}
            pagination={{
              el: '.blog-swiper-pagination',
              clickable: true,
              renderBullet: (index, className) =>
                `<span class="${className}"></span>`,
            }}
            breakpoints={{
              640: { slidesPerView: 2 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="blog-swiper !py-[45x]">
            {blogData.map((blog) => (
              <SwiperSlide key={blog.id}>
                <BlogCard
                  id={blog.id}
                  title={blog.title}
                  image={blog.image}
                  date={blog.date}
                  view={blog.view}
                  slug={blog.slug}
                  lang={lang}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flex items-center justify-center md:justify-end mt-8 gap-4">
            <button
              onClick={() => swiperRef.current?.slidePrev()}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100">
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="blog-swiper-pagination flex items-center gap-1"></div>

            <button
              onClick={() => swiperRef.current?.slideNext()}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full text-gray-600 hover:bg-gray-100">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlogList;
