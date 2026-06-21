import apiClient from '@/api';
import { NearbyRestaurantsResponse, RestaurantDetailResponse } from '@/types/restaurant';
import { PopularPlacesResponse } from '@/types/place';

interface NearbyRestaurantsParams {
  latitude?: number;
  longitude?: number;
  ne_lat?: number;
  ne_lng?: number;
  sw_lat?: number;
  sw_lng?: number;
  search?: string;
  category_id?: number[];
  properties?: number[];
  subproperties?: number[];
  is_special_offer?: boolean;
  page?: number;
  per_page?: number;
}

const placeService = {
  getPopularPlaces: () =>
    apiClient.get<PopularPlacesResponse>('/popular-places'),

  getNearbyRestaurants: (params: NearbyRestaurantsParams) => {
    const body = new URLSearchParams();
    if (params.ne_lat != null && params.ne_lng != null && params.sw_lat != null && params.sw_lng != null) {
      body.append('ne_lat', String(params.ne_lat));
      body.append('ne_lng', String(params.ne_lng));
      body.append('sw_lat', String(params.sw_lat));
      body.append('sw_lng', String(params.sw_lng));
    } else {
      if (params.latitude != null) body.append('latitude', String(params.latitude));
      if (params.longitude != null) body.append('longitude', String(params.longitude));
    }
    if (params.search) body.append('search', params.search);
    params.category_id?.forEach((id) =>
      body.append('category_id[]', String(id)),
    );
    params.properties?.forEach((id) =>
      body.append('properties[]', String(id)),
    );
    params.subproperties?.forEach((id) =>
      body.append('subproperties[]', String(id)),
    );
    if (params.is_special_offer) body.append('is_special_offer', '1');
    if (params.page != null) body.append('page', String(params.page));
    if (params.per_page != null) body.append('per_page', String(params.per_page));

    console.log('[SearchArea] 🌐 POST /nearby-restaurants — body:', body.toString());

    return apiClient.post<NearbyRestaurantsResponse, URLSearchParams>(
      '/nearby-restaurants',
      body,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } },
    );
  },

  getRestaurantBySlug: (slug: string) =>
    apiClient.get<RestaurantDetailResponse>(`/restoran/${slug}`),
};

export default placeService;
