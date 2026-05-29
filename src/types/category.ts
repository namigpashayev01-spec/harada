import { ISlug } from './index';
import { Restaurant } from './restaurant';

export interface Category {
  id: number;
  title: string;
  icon: string;
  slug: ISlug;
  restorans: Restaurant[];
}

export interface CategoriesResponse {
  data: Category[];
}
