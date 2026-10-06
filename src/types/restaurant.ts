import { Gallery, ISlug, SubProperty } from '.';
import { Category } from './category';

export interface Menu {
  id: number;
  title: string;
  images: string[];
}

export interface MenuDish {
  id: number;
  name: string;
  description: string | null;
  price: number | null;
}

export interface MenuCategory {
  id: number;
  name: string;
  dishes: MenuDish[];
}

export interface Meal {
  type: string;
  name: string;
  start_time: string;
  end_time: string;
  hours: string[];
}

export interface WorkingDay {
  day: string;
  day_name: string;
  is_open: boolean;
  meals: Meal[];
}

export interface Property {
  id: number;
  title: string;
  icon: string;
  sub_properties: SubProperty[];
}

export interface PropertyResponse {
  data: Property[];
}

export interface Restaurant {
  id: number;
  title: string;
  slug: ISlug;
  address: string;
  description: string;
  seo_title: string;
  seo_description: string;
  image: string;
  /** Author of a Google Places photo — must be shown next to the image. */
  image_credit?: string | null;
  categories: Category[];
  properties: Property[];
  // Lightweight list endpoints (e.g. /popular-places) return cuisine tags
  // directly as sub_properties instead of nested under properties.
  sub_properties?: SubProperty[];
  menus: Menu[];
  menu_categories?: MenuCategory[];
  galleries: Gallery[];
  latitude: string;
  longitude: string;
  average_price: string;
  is_vip: boolean;
  is_special_offer: boolean;
  // Optional fields surfaced on cards when the API provides them.
  rating?: number;
  reviews_count?: number;
  discount?: number; // percentage, e.g. 30
  district?: string;
  working_hours?: WorkingDay[];
  map_link?: string;
  open_from?: string;
  /** Detail endpoint only; used for the Restaurant JSON-LD `telephone`. */
  phone?: string | null;
  /**
   * Detail endpoint only. Where this restaurant's bookings should land. Unset
   * for most places — the reservation form then falls back to the site's own
   * WhatsApp line.
   */
  whatsapp?: string | null;
  /**
   * ISO country code. 'AZ' is the home market; restaurants from elsewhere
   * (Tashkent, imported from Restaurant Guru) live in their own section,
   * have no reservation flow and use their own city in breadcrumbs/schema.
   */
  country?: string;
  /** City key, also the URL segment: /uzbekistan/tashkent. Null for AZ. */
  city?: string | null;
  country_name?: string | null;
  city_name?: string | null;
  website?: string | null;
  /** 'osm' → the page must credit OpenStreetMap (ODbL). */
  source?: string | null;
  /** 1–4, rendered as $–$$$$ in schema.org `priceRange`. */
  price_level?: number | null;
  /** False for fact-thin imported pages → noindex, left out of the sitemap. */
  indexable?: boolean;
}

/**
 * A row from a LIST endpoint (/nearby-restaurants).
 *
 * Deliberately NOT `extends Restaurant`. The list endpoint returns a slim
 * payload — no `menus`, `galleries`, `properties`, `working_hours` or the SEO
 * fields — because sending a full menu per card cost 188 KB and 2.5 s per
 * page. Extending `Restaurant` would let a card read a field the API never
 * sends and crash at runtime, so the narrow shape is spelled out here.
 *
 * Need one of the heavy fields? Fetch the detail endpoint
 * (`getRestaurantBySlug`), which still returns the full `Restaurant`.
 */
export interface NearbyRestaurant {
  id: number;
  title: string;
  slug: ISlug;
  address: string;
  image: string;
  image_credit?: string | null;
  categories: Category[];
  sub_properties?: SubProperty[];
  latitude: string;
  longitude: string;
  average_price: string;
  is_vip: boolean;
  is_special_offer: boolean;
  /** Only sent when the query was sorted by distance from a point. */
  distance?: number;
  // Not produced by the API yet; cards already handle their absence.
  rating?: number;
  reviews_count?: number;
  discount?: number;
  district?: string;
}

export interface RestaurantDetailResponse {
  data: Restaurant;
}

export interface SitemapRestaurant {
  id: number;
  slug: Partial<Record<'az' | 'en' | 'ru' | 'sr' | 'nl' | 'uz' | 'fr' | 'lv', string>>;
  /** True when the restaurant has at least one dish — menu pages for the rest
   *  are empty and stay out of both the sitemap and the index. */
  has_menu?: boolean;
  country?: string;
  /** False for fact-thin imported pages — noindexed, so kept out of the sitemap. */
  indexable?: boolean;
}

export interface SitemapRestaurantsResponse {
  data: SitemapRestaurant[];
  total: number;
}

export interface NearbyRestaurantsMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface NearbyRestaurantsResponse {
  data: NearbyRestaurant[];
  meta: NearbyRestaurantsMeta;
}
