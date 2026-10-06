import { NearbyRestaurant, NearbyRestaurantsMeta } from './restaurant';

/**
 * The ways a visitor can slice the restaurant list. `city` is for restaurants
 * outside Azerbaijan (e.g. /uzbekistan/tashkent); the other three only ever
 * list Azerbaijani restaurants.
 */
export type TaxonomyType = 'cuisine' | 'category' | 'district' | 'city';

/**
 * One taxonomy term (a cuisine, a category or a Baku district).
 *
 * `slug` is derived from the Azerbaijani title on the API side and is the same
 * in all three languages, so `/az/cuisine/italyan-metbexi` and
 * `/en/cuisine/italyan-metbexi` are the same page in different languages and
 * hreflang can pair them without a per-locale slug map.
 */
export interface TaxonomyTerm {
  /** Absent for districts — they are matched by name, not by a joined row. */
  id?: number;
  slug: string;
  /** Cuisines and categories are translated; districts carry `name` instead. */
  title?: Record<string, string>;
  /** Districts only: the administrative name, identical in every language. */
  name?: string;
  count: number;
  type?: TaxonomyType;
  /** Cities only: ISO country code, its URL segment and localized name. */
  country?: string;
  segment?: string;
  country_title?: Record<string, string>;
}

export interface TaxonomiesResponse {
  cuisines: TaxonomyTerm[];
  categories: TaxonomyTerm[];
  districts: TaxonomyTerm[];
  /** Cities outside Azerbaijan that have restaurants (e.g. Tashkent). */
  cities?: TaxonomyTerm[];
}

export interface BrowseResponse {
  data: NearbyRestaurant[];
  meta: NearbyRestaurantsMeta;
  term: TaxonomyTerm;
}

/** The visible label for a term in the given language. */
export function termLabel(term: TaxonomyTerm, lang: string): string {
  return term.title?.[lang] || term.title?.az || term.name || term.slug;
}
