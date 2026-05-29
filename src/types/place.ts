import { Restaurant } from "./restaurant";

export interface PlaceCategory {
  id: number;
  title: string;
  icon: string;
  restorans: Restaurant[];
}

export interface PopularPlacesResponse {
  data: PlaceCategory[];
}
