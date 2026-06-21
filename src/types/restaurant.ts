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
}

export interface NearbyRestaurant extends Restaurant {
  distance?: number;
}

export interface RestaurantDetailResponse {
  data: Restaurant;
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
