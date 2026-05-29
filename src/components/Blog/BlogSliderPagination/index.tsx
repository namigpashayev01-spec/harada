'use client';

import { useEffect, useState } from 'react';

interface BlogSliderPaginationProps {
  totalSlides?: number;
  currentSlide?: number;
  onSlideChange?: (slideIndex: number) => void;
  className?: string;
}

export default function BlogSliderPagination({
  totalSlides = 6,
  currentSlide = 0,
  onSlideChange,
  className = '',
}: BlogSliderPaginationProps) {
  const [activeSlide, setActiveSlide] = useState(currentSlide);

  useEffect(() => {
    setActiveSlide(currentSlide)
  }, [currentSlide])

  const handleSlideChange = (slideIndex: number) => {
    setActiveSlide(slideIndex)
    onSlideChange?.(slideIndex)
  }


  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {Array.from({ length: totalSlides }, (_, index) => {
        const slideIndex = index;
        const isActive = slideIndex === activeSlide;

        return (
          <button
            key={slideIndex}
            onClick={() => handleSlideChange(slideIndex)}
            className={`transition-all duration-300 ease-in-out ${
              isActive
                ? 'w-12 h-12 rounded-full border-2 border-white flex items-center justify-center hover:bg-white/10'
                : 'w-3 h-3 rounded-full border border-white/60 hover:border-white hover:bg-white/20'
            }`}
            aria-label={`Go to slide ${slideIndex + 1}`}>
            {isActive && <div className="w-3 h-3 rounded-full bg-white"></div>}
          </button>
        );
      })}
    </div>
  );
}
