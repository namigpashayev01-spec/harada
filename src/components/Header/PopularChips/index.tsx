'use client';

import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';

const LABELS: Record<string, string> = {
  az: 'Populyar:',
  en: 'Popular:',
  ru: 'Популярное:',
};

// Real cuisine categories so the chips map to a working `category_id` filter
// on the Places page (free-text search by cuisine name returns nothing).
const PopularChips = ({ lang }: { lang: string }) => {
  const { data } = useCategories();
  const categories = (data?.data ?? []).slice(0, 6);

  if (categories.length === 0) return null;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2.5">
      <span className="text-sm text-white/75">{LABELS[lang] ?? LABELS.az}</span>
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/${lang}/places?category_id=${category.id}`}
          className="rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 text-sm text-white backdrop-blur-sm transition-colors hover:bg-white/20">
          {category.title}
        </Link>
      ))}
    </div>
  );
};

export default PopularChips;
