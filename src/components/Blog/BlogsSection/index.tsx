import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AllBlogs from '../AllBlogs';
import { BlogItem, BlogsMeta } from '@/types/blog';

interface BlogsSectionProps {
  lang: string;
  blogs: BlogItem[];
  meta?: BlogsMeta;
}

const EMPTY: Record<string, string> = {
  az: 'Hələ dərc olunmuş yazı yoxdur.',
  en: 'No posts published yet.',
  ru: 'Пока нет опубликованных статей.',
};

/**
 * Build the page numbers to show: always first and last, plus a window around
 * the current page, with '…' standing in for the gaps.
 */
const pageNumbers = (current: number, last: number): (number | '…')[] => {
  if (last <= 7) return Array.from({ length: last }, (_, i) => i + 1);

  const pages = new Set<number>([1, last, current]);
  if (current - 1 > 1) pages.add(current - 1);
  if (current + 1 < last) pages.add(current + 1);

  const sorted = [...pages].sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push('…');
    out.push(p);
  });
  return out;
};

/**
 * Blog listing. Pagination uses real links (`?page=2`) rather than client-side
 * state so every page is a crawlable, server-rendered URL.
 */
const BlogsSection = ({ lang, blogs, meta }: BlogsSectionProps) => {
  const current = meta?.current_page ?? 1;
  const last = meta?.last_page ?? 1;
  const href = (p: number) => (p <= 1 ? `/${lang}/blog` : `/${lang}/blog?page=${p}`);

  if (blogs.length === 0) {
    return (
      <section>
        <div className="wrapper py-[38px]">
          <p className="text-center text-gray-500">{EMPTY[lang] ?? EMPTY.en}</p>
        </div>
      </section>
    );
  }

  const linkClass =
    'flex h-10 min-w-10 items-center justify-center rounded-lg border border-gray-200 bg-white px-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50';

  return (
    <section>
      <div className="wrapper">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[24px] py-[38px]">
          <AllBlogs currentItems={blogs} lang={lang} />
        </div>

        {last > 1 && (
          <nav
            aria-label="pagination"
            className="flex items-center justify-end gap-2 pb-[38px]">
            {current > 1 && (
              <Link href={href(current - 1)} rel="prev" className={linkClass}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            )}

            {pageNumbers(current, last).map((p, i) =>
              p === '…' ? (
                <span key={`gap-${i}`} className="px-1 text-gray-400">
                  …
                </span>
              ) : p === current ? (
                <span
                  key={p}
                  aria-current="page"
                  className="flex h-10 min-w-10 items-center justify-center rounded-lg bg-brand px-3 text-sm font-bold text-brand-ink">
                  {p}
                </span>
              ) : (
                <Link key={p} href={href(p)} className={linkClass}>
                  {p}
                </Link>
              ),
            )}

            {current < last && (
              <Link href={href(current + 1)} rel="next" className={linkClass}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </nav>
        )}
      </div>
    </section>
  );
};

export default BlogsSection;
