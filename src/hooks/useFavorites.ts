import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import userService, { FavoriteRestaurant } from '@/services/user.service';
import { useAuth } from '@/context/AuthContext';

export const FAVORITES_QUERY_KEY = ['user', 'favorites'] as const;

export function useFavorites() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: FAVORITES_QUERY_KEY,
    queryFn: () => userService.getFavorites(),
    enabled: isAuthenticated,
    staleTime: 60_000,
  });
}

export function useIsFavorite(restaurantId: number | null | undefined) {
  const { data } = useFavorites();
  if (!restaurantId) return false;
  const list: FavoriteRestaurant[] = data?.data ?? data?.favorites ?? [];
  return list.some((r) => r.id === restaurantId);
}

export function useToggleFavorite() {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: async (vars: { restaurantId: number; isCurrentlyFavorite: boolean }) => {
      if (!isAuthenticated) throw new Error('Not authenticated');
      if (vars.isCurrentlyFavorite) {
        return userService.removeFavorite(vars.restaurantId);
      }
      return userService.addFavorite(vars.restaurantId);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: FAVORITES_QUERY_KEY });
    },
  });
}
