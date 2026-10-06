import apiClient from '@/api';
import {
  NearbyRestaurantsResponse,
  RestaurantDetailResponse,
  SitemapRestaurantsResponse,
} from '@/types/restaurant';
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

export interface SuggestCuisine {
  id: number;
  title: string;
  count: number;
}

export interface SuggestRestaurant {
  id: number;
  title: string;
  address: string | null;
  slug: string;
}

export interface SuggestDish {
  name: string;
  count: number;
}

export interface SearchSuggestResponse {
  cuisines: SuggestCuisine[];
  dishes: SuggestDish[];
  restaurants: SuggestRestaurant[];
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

  // `lang` must be passed from server components (generateMetadata): the shared
  // apiClient default set by setLang() only reflects the browser's language, so
  // without it the API falls back to `az` and every locale gets Azerbaijani meta.
  /** Axtarış qutusunun təklifləri: restoran adları + mətbəxlər. */
  searchSuggest: (q: string) =>
    apiClient.get<SearchSuggestResponse>(
      `/search-suggest?q=${encodeURIComponent(q)}`,
    ),

  getRestaurantBySlug: (slug: string, lang?: string) =>
    apiClient.get<RestaurantDetailResponse>(
      `/restoran/${slug}`,
      lang ? { headers: { 'Accept-Language': lang } } : undefined,
    ),

  // Slug-only listing of every published restaurant, used by the sitemap.
  // The paginated /nearby-restaurants endpoint loads menus and working hours
  // per row and takes ~50s per page, which times out during generation.
  getRestaurantSlugs: () =>
    apiClient.get<SitemapRestaurantsResponse>('/sitemap-restaurants'),
};

export default placeService;
