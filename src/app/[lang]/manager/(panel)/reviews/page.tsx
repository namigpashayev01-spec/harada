'use client';

import { useQuery } from '@tanstack/react-query';
import { Loader2, Star } from 'lucide-react';
import ownerService from '@/services/owner.service';
import { useManager } from '@/components/Manager/ManagerShell';

const L: Record<string, Record<string, string>> = {
  az: { title: 'Rəylər', empty: 'Hələ rəy yoxdur.', average: 'Orta bal', total: 'Rəy sayı',
        hidden: 'Dərc edilməyib' },
  en: { title: 'Reviews', empty: 'No reviews yet.', average: 'Average', total: 'Reviews',
        hidden: 'Not published' },
  ru: { title: 'Отзывы', empty: 'Отзывов пока нет.', average: 'Средний балл', total: 'Отзывов',
        hidden: 'Не опубликован' },
};

export default function ManagerReviewsPage() {
  const { restaurant, lang } = useManager();
  const l = L[lang] ?? L.az;

  const { data, isLoading } = useQuery({
    queryKey: ['owner', 'reviews', restaurant.id],
    queryFn: () => ownerService.getReviews(restaurant.id),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  const reviews = data?.data ?? [];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-xl font-semibold text-gray-900">{l.title}</h1>
        {reviews.length > 0 && (
          <div className="flex gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1.5">
              <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
              <strong>{data!.average}</strong> {l.average}
            </span>
            <span>
              <strong>{data!.total}</strong> {l.total}
            </span>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <p className="rounded-xl border border-dashed border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
          {l.empty}
        </p>
      ) : (
        <ul className="space-y-3">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-xl border border-gray-100 bg-white p-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-gray-900">{r.name || '—'}</span>
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < r.rate ? 'fill-amber-400 text-amber-400' : 'text-gray-200'
                      }`}
                    />
                  ))}
                </span>
                <span className="text-xs text-gray-400">{r.created_at}</span>
                {!r.published && (
                  <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">
                    {l.hidden}
                  </span>
                )}
              </div>
              {r.comment && <p className="mt-2 text-sm text-gray-700">{r.comment}</p>}
              {r.impressions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {r.impressions.map((imp) => (
                    <span
                      key={imp}
                      className="rounded-full bg-[#eefae1] px-2 py-0.5 text-[11px] text-[#006653]">
                      {imp}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
