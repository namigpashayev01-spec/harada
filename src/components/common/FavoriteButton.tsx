'use client';

import { Heart } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useIsFavorite, useToggleFavorite } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  restaurantId: number;
  className?: string;
  size?: number;
  variant?: 'card' | 'detail';
}

export default function FavoriteButton({
  restaurantId,
  className,
  size = 18,
  variant = 'card',
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { lang } = useParams<{ lang: string }>();
  const isFav = useIsFavorite(restaurantId);
  const toggle = useToggleFavorite();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      router.push(`/${lang || 'en'}/login`);
      return;
    }
    if (toggle.isPending) return;
    toggle.mutate({ restaurantId, isCurrentlyFavorite: isFav });
  };

  const base =
    variant === 'detail'
      ? 'h-10 w-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors'
      : 'h-8 w-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-sm hover:bg-white transition-colors';

  return (
    <button
      type="button"
      aria-pressed={isFav}
      aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
      onClick={handleClick}
      disabled={toggle.isPending}
      className={cn(base, className)}
    >
      <Heart
        style={{ width: size, height: size }}
        className={cn(
          'transition-colors',
          isFav ? 'fill-red-500 text-red-500' : 'text-gray-500',
        )}
      />
    </button>
  );
}
