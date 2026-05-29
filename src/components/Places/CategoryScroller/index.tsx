'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Category } from '@/types/category';

interface CategoryScrollerProps {
  categories: Category[];
  activeCategoryId: number | null;
  onSelect: (id: number | null) => void;
}

export default function CategoryScroller({
  categories,
  activeCategoryId,
  onSelect,
}: CategoryScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 4);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollRef.current;
    if (!el) return;
    const onResize = () => updateArrows();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [updateArrows, categories.length]);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.max(240, el.clientWidth * 0.7), behavior: 'smooth' });
  };

  const pill = (active: boolean) =>
    `flex shrink-0 items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium transition-colors border ${
      active
        ? 'bg-[#006653] text-white border-[#006653]'
        : 'border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-[#006653]/40'
    }`;

  return (
    <div className="relative">
      {/* Left fade + arrow */}
      <div
        className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-white to-transparent transition-opacity ${
          canLeft ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <button
        type="button"
        aria-label="Geri sürüşdür"
        onClick={() => scrollBy(-1)}
        className={`absolute left-1 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition-all hover:bg-gray-50 ${
          canLeft ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}>
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Scroll row */}
      <div
        ref={scrollRef}
        onScroll={updateArrows}
        className="no-scrollbar flex items-center gap-2 overflow-x-auto scroll-smooth py-1">
        <button onClick={() => onSelect(null)} className={pill(activeCategoryId === null)}>
          Hamısı
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelect(cat.id)}
            className={pill(activeCategoryId === cat.id)}>
            {cat.icon && (
              <Image
                src={cat.icon}
                alt={cat.title || 'Category'}
                width={16}
                height={16}
                className="h-4 w-4 object-contain"
              />
            )}
            {cat.title}
          </button>
        ))}
      </div>

      {/* Right fade + arrow */}
      <div
        className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-white to-transparent transition-opacity ${
          canRight ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <button
        type="button"
        aria-label="İrəli sürüşdür"
        onClick={() => scrollBy(1)}
        className={`absolute right-1 top-1/2 z-20 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition-all hover:bg-gray-50 ${
          canRight ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
}
