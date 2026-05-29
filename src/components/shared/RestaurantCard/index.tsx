'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import FavoriteButton from '@/components/common/FavoriteButton';
import { ISlug } from '@/types';
import { Restaurant } from '@/types/restaurant';

interface RestaurantCardProps {
  place: Restaurant;
  lang: string;
  /** Optional override for the top-left badge (e.g. "Top 10 Bakı"). */
  topBadge?: string;
}

const resolveSlug = (slug: ISlug | undefined, lang: string, id: number): string => {
  if (!slug) return String(id);
  return slug[lang as keyof ISlug] || slug.az || slug.en || slug.ru || String(id);
};

const RestaurantCard = ({ place, lang, topBadge }: RestaurantCardProps) => {
  const href = `/${lang}/places/${resolveSlug(place.slug, lang, place.id)}`;

  // Cuisine: light list endpoints expose sub_properties; detail uses categories.
  const cuisine =
    place.sub_properties?.map((s) => s.title).join(', ') ||
    place.categories?.map((c) => c.title).join(', ') ||
    '';

  const district = place.district || place.address || '';

  // Top-left status badge (single, priority-ordered).
  const badge =
    topBadge ||
    (place.is_vip ? 'Top 10 Bakı' : place.is_special_offer ? 'Təklif' : '');

  return (
    <Link
      href={href}
      className="card-hover group flex h-full flex-col overflow-hidden rounded-xl bg-white">
      {/* Photo 3:2 */}
      <div className="relative aspect-[3/2] w-full overflow-hidden">
        <Image
          src={place.image || '/placeholder.svg'}
          alt={place.title || 'Restaurant'}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 23vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {badge && (
          <span className="absolute left-3 top-3 z-10 rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold text-brand-ink shadow-sm">
            {badge}
          </span>
        )}

        <div className="absolute right-3 top-3 z-10">
          <FavoriteButton restaurantId={place.id} variant="card" size={18} />
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[16px] leading-snug text-gray-900 line-clamp-1 group-hover:text-brand-ink transition-colors">
            {place.title}
          </h3>
          {typeof place.rating === 'number' && (
            <span className="flex shrink-0 items-center gap-1 font-bold text-gray-900">
              <Star className="h-4 w-4 fill-orange text-orange" />
              {place.rating.toFixed(1)}
            </span>
          )}
        </div>

        {(typeof place.reviews_count === 'number' || cuisine) && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
            {typeof place.reviews_count === 'number' && (
              <span>({place.reviews_count} rəy) </span>
            )}
            {cuisine}
          </p>
        )}

        <div className="mt-3 flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
          <span className="line-clamp-1">{district}</span>
          {place.average_price && (
            <span className="ml-auto shrink-0 font-medium text-gray-700">
              ~{place.average_price} AZN
            </span>
          )}
        </div>

        {typeof place.discount === 'number' && place.discount > 0 && (
          <span className="mt-3 inline-flex w-fit items-center rounded-md bg-discount-soft px-2.5 py-1 text-xs font-semibold text-discount">
            −{place.discount}% endirim
          </span>
        )}
      </div>
    </Link>
  );
};

export default RestaurantCard;
