import apiClient from '@/api';
import {
  BrowseResponse,
  TaxonomiesResponse,
  TaxonomyType,
} from '@/types/taxonomy';

interface BrowseParams {
  type: TaxonomyType;
  slug: string;
  page?: number;
  per_page?: number;
  lang?: string;
}

/**
 * Cuisine / category / district listings.
 *
 * These endpoints are called from server components, so `lang` is passed
 * explicitly — the shared apiClient's default language is set in the browser
 * and is not available during server rendering; without it the API answers in
 * Azerbaijani for every locale.
 */
const taxonomyService = {
  getTaxonomies: (lang?: string) =>
    apiClient.get<TaxonomiesResponse>(
      '/taxonomies',
      lang ? { headers: { 'Accept-Language': lang } } : undefined,
    ),

  browse: ({ type, slug, page, per_page, lang }: BrowseParams) => {
    const query = new URLSearchParams({ type, slug });
    if (page != null) query.set('page', String(page));
    if (per_page != null) query.set('per_page', String(per_page));

    return apiClient.get<BrowseResponse>(
      `/browse?${query.toString()}`,
      lang ? { headers: { 'Accept-Language': lang } } : undefined,
    );
  },
};

export default taxonomyService;
