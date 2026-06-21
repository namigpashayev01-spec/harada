'use client';
import { useState } from 'react';
import { MapPin, Star, ArrowRight, Navigation, UtensilsCrossed } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { NearbyRestaurant } from '@/types/restaurant';
import { usePathname } from 'next/navigation';
import FavoriteButton from '@/components/common/FavoriteButton';

interface RestaurantCardProps {
  restaurant: NearbyRestaurant;
}

export default function RestaurantCard({ restaurant }: RestaurantCardProps) {
  const pathname = usePathname();
  const lang = pathname.split('/')[1] || 'az';
  const [imgError, setImgError] = useState(false);

  const slug =
    restaurant.slug.az ||
    restaurant.slug.en ||
    restaurant.slug.ru ||
    String(restaurant.id);
  const href = `/${lang}/places/${slug}`;

  const categories = restaurant.categories?.slice(0, 2) ?? [];
  const showCover = !restaurant.image || imgError;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-[0_8px_28px_rgba(0,0,0,0.10)] sm:flex-row">
      {/* Image */}
      <div className="relative aspect-[450/200] w-full shrink-0 overflow-hidden sm:aspect-auto sm:min-h-[210px] sm:w-60">
        <Link href={href} className="absolute inset-0 z-0">
          {showCover ? (
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#013a30] via-[#006653] to-[#0a7d54]">
              <UtensilsCrossed className="h-9 w-9 text-[#9fe870]" />
              <span className="mt-2 line-clamp-2 px-4 text-center text-sm font-semibold text-white">
                {restaurant.title || 'Restoran'}
              </span>
            </div>
          ) : (
            <Image
              src={restaurant.image}
              alt={restaurant.title || 'Restaurant'}
              fill
              sizes="(max-width: 640px) 90vw, 240px"
              onError={() => setImgError(true)}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
        </Link>

        {/* Status badges */}
        <div className="absolute left-3 top-3 z-10 flex flex-col gap-1.5">
          {restaurant.is_vip && (
            <span className="rounded-full bg-[#9fe870] px-2.5 py-1 text-[11px] font-bold text-[#14532d] shadow-sm">
              Top 10
            </span>
          )}
          {restaurant.is_special_offer && (
            <span className="rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#006653] shadow-sm">
              Endirimli
            </span>
          )}
        </div>

        <FavoriteButton
          restaurantId={restaurant.id}
          className="absolute right-3 top-3 z-10"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <Link href={href}>
            <h3 className="text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#006653]">
              {restaurant.title}
            </h3>
          </Link>
          {typeof restaurant.rating === 'number' && (
            <span className="flex shrink-0 items-center gap-1 rounded-lg bg-[#eefae1] px-2 py-1 text-sm font-bold text-[#14532d]">
              <Star className="h-3.5 w-3.5 fill-[#006653] text-[#006653]" />
              {restaurant.rating.toFixed(1)}
            </span>
          )}
        </div>

        {categories.length > 0 && (
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {categories.map((cat) => (
              <span
                key={cat.id}
                className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {cat.title}
              </span>
            ))}
            {typeof restaurant.reviews_count === 'number' && (
              <span className="text-xs text-gray-400">
                ({restaurant.reviews_count} rəy)
              </span>
            )}
          </div>
        )}

        {restaurant.address && (
          <div className="mt-2.5 flex items-center gap-1.5 text-sm text-gray-500">
            <MapPin className="h-4 w-4 shrink-0 text-gray-400" />
            <span className="line-clamp-1">{restaurant.address}</span>
          </div>
        )}

        <div className="mt-1.5 flex items-center gap-3 text-sm text-gray-600">
          {restaurant.distance != null && (
            <span className="flex items-center gap-1 text-gray-500">
              <Navigation className="h-3.5 w-3.5 text-gray-400" />
              {restaurant.distance.toFixed(1)} km uzaqda
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="mt-auto pt-4">
          <Link
            href={href}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#006653] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#00543f] sm:w-auto">
            Ətraflı bax
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
