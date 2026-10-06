import { useQuery } from '@tanstack/react-query';
import placeService from '@/services/place.service';
import type { PopularPlacesResponse } from '@/types/place';

/**
 * Populyar məkanlar.
 *
 * `initialData` server komponentindən gəlir. Onsuz siyahı yalnız brauzerdə
 * yüklənirdi və serverin qaytardığı HTML-də bir dənə də restoran linki
 * olmurdu — yəni ana səhifə axtarış motoruna saytın əsas məzmununu heç
 * göstərmirdi. İlkin məlumat ötürüləndə eyni siyahı serverdə render olunur,
 * brauzerdə isə təkrar sorğu atılmadan işlənir.
 */
export const usePopularPlaces = (initialData?: PopularPlacesResponse) =>
  useQuery({
    queryKey: ['popular-places'],
    queryFn: () => placeService.getPopularPlaces(),
    initialData,
  });
