import { useQuery } from '@tanstack/react-query';
import placeService from '@/services/place.service';

export const usePopularPlaces = () =>
  useQuery({
    queryKey: ['popular-places'],
    queryFn: () => placeService.getPopularPlaces(),
  });
