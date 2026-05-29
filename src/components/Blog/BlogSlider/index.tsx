'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Eye,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ISlug } from '@/types';
import { getStaticBlogs } from '@/data/staticBlogs';

interface BlogSliderProps {
  lang: string;
}

const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '');

const getSlug = (slug: ISlug, lang: string) =>
  slug[lang as keyof ISlug] || slug.az || slug.en;

const LABELS: Record<string, { latest: string; readMore: string; tag: string }> =
  {
    az: { latest: 'Son bloqlar', readMore: 'Ətraflı oxu', tag: 'Seçilmiş' },
    en: { latest: 'Latest Blog', readMore: 'Read More', tag: 'Featured' },
    ru: { latest: 'Последние блоги', readMore: 'Читать далее', tag: 'Избранное' },
  };

const BlogSlider = ({ lang }: BlogSliderProps) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const t = LABELS[lang] ?? LABELS.az;

  const slides = useMemo(() => getStaticBlogs(lang).slice(0, 4), [lang]);
  const current = slides[currentSlide] ?? slides[0];

  const goTo = (i: number) =>
    setCurrentSlide(((i % slides.length) + slides.length) % slides.length);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused || slides.length === 0) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, isPaused, slides.length]);

  if (!current) {
    return (
      <section className="pt-6">
        <div className="wrapper">
          <div className="h-[440px] md:h-[520px] rounded-[24px] bg-gray-100 animate-pulse" />
        </div>
      </section>
    );
  }

  const href = `/${lang}/blog/${getSlug(current.slug, lang)}`;

  return (
    <section className="pt-6">
      <div className="wrapper">
        {/* Heading row */}
        <div className="mb-5 flex items-end justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-wide text-[#006653]">
              {t.tag}
            </span>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-gray-900 md:text-[38px]">
              {t.latest}
            </h2>
          </div>
          <div className="hidden gap-2 sm:flex">
            <button
              aria-label="prev"
              onClick={() => goTo(currentSlide - 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              aria-label="next"
              onClick={() => goTo(currentSlide + 1)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition-colors hover:bg-gray-50">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Hero card */}
        <div
          className="relative h-[440px] overflow-hidden rounded-[24px] md:h-[520px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}>
          {/* Crossfading images */}
          {slides.map((slide, i) => (
            <Image
              key={slide.id}
              src={slide.image}
              alt={slide.title ?? ''}
              fill
              priority={i === 0}
              sizes="100vw"
              className={`object-cover transition-opacity duration-700 ease-out ${
                i === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10" />

          {/* Content */}
          <div className="absolute inset-0 flex items-end">
            <div className="w-full max-w-3xl p-6 md:p-12">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-[#9fe870] px-3 py-1 text-xs font-bold text-[#14532d]">
                  {t.tag}
                </span>
                <span className="text-sm text-white/80">{current.date}</span>
                <span className="flex items-center gap-1 text-sm text-white/80">
                  <Eye className="h-4 w-4" />
                  {current.view}
                </span>
              </div>

              <Link href={href}>
                <h3 className="mt-4 text-2xl font-bold leading-tight text-white transition-colors hover:text-[#9fe870] md:text-[40px] md:leading-[1.1] line-clamp-2">
                  {current.title}
                </h3>
              </Link>

              {current.description && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/85 md:text-base line-clamp-2">
                  {stripHtml(current.description)}
                </p>
              )}

              <Link
                href={href}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#9fe870] px-6 py-3 text-sm font-semibold text-[#14532d] transition-colors hover:bg-[#8fdc5c]">
                {t.readMore}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* Progress dots */}
          <div className="absolute bottom-5 right-6 flex items-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                aria-label={`slide ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentSlide
                    ? 'w-8 bg-[#9fe870]'
                    : 'w-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Thumbnail strip */}
        <div className="mt-4 hidden grid-cols-4 gap-3 md:grid">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              onClick={() => goTo(i)}
              className={`group relative h-20 overflow-hidden rounded-xl text-left transition-all ${
                i === currentSlide
                  ? 'ring-2 ring-[#006653] ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              }`}>
              <Image
                src={slide.image}
                alt={slide.title ?? ''}
                fill
                sizes="25vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <span className="absolute inset-x-0 bottom-0 line-clamp-2 p-2 text-xs font-medium text-white">
                {slide.title}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSlider;
