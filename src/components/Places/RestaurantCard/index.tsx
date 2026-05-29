'use client';
import { MapPin, Star, DollarSign } from 'lucide-react';
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
  const lang = pathname.split('/')[1] || 'en';

  const slug =
    restaurant.slug.az ||
    restaurant.slug.en ||
    restaurant.slug.ru ||
    String(restaurant.id);
  const href = `/${lang}/places/${slug}`;

  const categories = restaurant.categories?.slice(0, 2) ?? [];

  return (
    <div className="flex gap-4 p-4 bg-white rounded-lg hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative w-44 h-44 flex-shrink-0 rounded-lg overflow-hidden group">
        <Link href={href} className="absolute inset-0 z-0">
          <Image
            src={restaurant.image || '/placeholder.svg'}
            alt={restaurant.title || 'Restaurant'}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        {restaurant.is_vip && (
          <span className="absolute top-2 left-2 bg-[#F57D0D] text-white text-[10px] font-semibold px-2 py-0.5 rounded-full z-10">
            VIP
          </span>
        )}
        <FavoriteButton
          restaurantId={restaurant.id}
          className="absolute top-2 right-2 z-10"
        />
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col justify-between py-1">
        <div>
          <div className="flex items-start justify-between mb-1">
            <div>
              <Link href={href}>
                <h3 className="text-xl font-semibold text-gray-900 hover:text-[#CD7F4E] transition-colors">
                  {restaurant.title}
                </h3>
              </Link>
              {categories.length > 0 && (
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {categories.map((cat) => (
                    <span
                      key={cat.id}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {cat.title}
                    </span>
                  ))}
                </div>
              )}
            </div>
            {/* <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-red-500 flex-shrink-0"
              onClick={(e) => {
                e.preventDefault();
                setIsFavorite(!isFavorite);
              }}>
              <Heart
                className={cn(
                  'h-5 w-5',
                  isFavorite && 'fill-red-500 text-red-500',
                )}
              />
            </Button> */}
          </div>

          <div className="flex items-center gap-3 mt-2 text-sm text-gray-600">
            {restaurant.address && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="truncate max-w-[180px]">
                  {restaurant.address}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1 text-sm">
            {restaurant.average_price && (
              <div className="flex items-center gap-1 text-gray-600">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span>{restaurant.average_price} AZN</span>
              </div>
            )}
            {restaurant.distance != null && (
              <span className="text-gray-500">
                {restaurant.distance.toFixed(1)} km away
              </span>
            )}
          </div>
        </div>

        <div className="mt-3">
          <Link
            href={href}
            className="inline-flex items-center gap-1 bg-[#2F4F4F] hover:bg-[#1e3535] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Star className="h-4 w-4" />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
