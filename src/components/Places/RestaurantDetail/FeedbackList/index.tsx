'use client';

import { useEffect, useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import feedbackService, { FeedbackListResponse } from '@/services/feedback.service';

interface FeedbackListProps {
  slug: string;
  refreshKey?: number;
}

const RATE_ORDER = [5, 4, 3, 2, 1];

const initials = (name: string, surname: string) =>
  `${(name?.[0] || '').toUpperCase()}${(surname?.[0] || '').toUpperCase()}`;

const Stars = ({ value, size = 16 }: { value: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        style={{ width: size, height: size }}
        className={s <= value ? 'fill-orange-400 text-orange-400' : 'fill-gray-200 text-gray-200'}
      />
    ))}
  </div>
);

const PAGE_SIZE = 5;

export default function FeedbackList({ slug, refreshKey = 0 }: FeedbackListProps) {
  const [data, setData] = useState<FeedbackListResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setVisible(PAGE_SIZE);
    feedbackService
      .getFeedbackList(slug)
      .then((res) => { if (!cancelled) setData(res); })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug, refreshKey]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6">
        <div className="h-6 w-40 bg-gray-100 rounded animate-pulse mb-4" />
        <div className="h-24 bg-gray-100 rounded animate-pulse" />
      </div>
    );
  }

  if (!data || data.statistics.total_feedbacks === 0) {
    return (
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">Reviews</h2>
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <MessageSquare className="h-10 w-10 mb-2 text-gray-300" />
          <p className="text-sm">No reviews yet. Be the first to leave feedback.</p>
        </div>
      </div>
    );
  }

  const { statistics, feedbacks } = data;
  const distMap = new Map(statistics.rating_distribution.map((d) => [d.rate, d]));
  const shownFeedbacks = feedbacks.slice(0, visible);
  const hasMore = visible < feedbacks.length;

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Reviews</h2>

      <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 pb-6 border-b border-gray-100">
        <div className="flex flex-col items-center justify-center sm:pr-6 sm:border-r sm:border-gray-100">
          <span className="text-5xl font-bold text-gray-900 leading-none">
            {statistics.average_rate.toFixed(1)}
          </span>
          <div className="mt-2">
            <Stars value={Math.round(statistics.average_rate)} size={18} />
          </div>
          <span className="mt-2 text-xs text-gray-500">
            Based on {statistics.total_feedbacks} {statistics.total_feedbacks === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        <div className="space-y-2">
          {RATE_ORDER.map((rate) => {
            const item = distMap.get(rate);
            const percent = item?.percentage ?? 0;
            const count = item?.count ?? 0;
            return (
              <div key={rate} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-10 shrink-0">
                  <span className="text-sm font-medium text-gray-700">{rate}</span>
                  <Star className="h-3.5 w-3.5 fill-orange-400 text-orange-400" />
                </div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#F57D0D] rounded-full transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-12 text-right shrink-0">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {shownFeedbacks.map((fb) => (
          <div key={fb.id} className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 text-[#F57D0D] flex items-center justify-center text-sm font-semibold shrink-0 overflow-hidden">
              {fb.profile && fb.profile.includes('/storage/') ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fb.profile} alt={fb.name} className="w-full h-full object-cover" />
              ) : (
                initials(fb.name, fb.surname) || '?'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-sm font-semibold text-gray-900">
                  {fb.name} {fb.surname}
                </span>
                <Stars value={Number(fb.rate) || 0} size={14} />
              </div>
              {fb.comment && (
                <p className="mt-1 text-sm text-gray-700 whitespace-pre-line [overflow-wrap:anywhere]">
                  {fb.comment}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="px-6 py-2 rounded-full border border-[#F57D0D] text-[#F57D0D] text-sm font-medium hover:bg-[#F57D0D] hover:text-white transition-colors">
            Load more ({feedbacks.length - visible} remaining)
          </button>
        </div>
      )}
    </div>
  );
}
