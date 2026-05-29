import { Gallery, ISlug, SubProperty } from '.';
import { Category } from './category';

export interface Menu {
  id: number;
  title: string;
  images: string[];
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
  menus: Menu[];
  galleries: Gallery[];
  latitude: string;
  longitude: string;
  average_price: string;
  is_vip: boolean;
  is_special_offer: boolean;
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

export interface NearbyRestaurantsResponse {
  data: NearbyRestaurant[];
}
