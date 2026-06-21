import type { MetadataRoute } from 'next';
import placeService from '@/services/place.service';
import blogService from '@/services/blog.service';
import { NearbyRestaurant } from '@/types/restaurant';
import { BlogItem } from '@/types/blog';
import { SITE_URL } from '@/lib/seo';

// Regenerate the sitemap once a day (dynamic — pulls live restaurants/blogs).
export const revalidate = 86400;

const LANGS = ['az', 'en', 'ru'] as const;

// Public routes (subpath after the language segment). Private pages
// (login/register/dashboard) are intentionally excluded — they are noindex.
const STATIC_PATHS = ['', '/places', '/about', '/contact', '/blog', '/restaurant-register'];

// Wide bounding box covering all of Azerbaijan so the listing endpoint
// returns every restaurant regardless of a user location.
const AZ_BBOX = { ne_lat: 41.95, ne_lng: 50.7, sw_lat: 38.3, sw_lng: 44.7 };

async function fetchAllRestaurants(): Promise<NearbyRestaurant[]> {
  const all: NearbyRestaurant[] = [];
  const perPage = 100;
  const maxPages = 40; // safety cap
  let page = 1;
  let lastPage = 1;
  do {
    try {
      const res = await placeService.getNearbyRestaurants({
        ...AZ_BBOX,
        page,
        per_page: perPage,
      });
      all.push(...(res.data ?? []));
      lastPage = res.meta?.last_page ?? lastPage;
    } catch (e) {
      // A single broken page (e.g. backend 500) shouldn't drop the rest —
      // skip it and keep paging up to the known last page.
      console.error(`[sitemap] restaurants page ${page} skipped:`, (e as Error)?.message);
    }
    page += 1;
  } while (page <= lastPage && page <= maxPages);
  return all;
}

async function fetchAllBlogs(): Promise<BlogItem[]> {
  const all: BlogItem[] = [];
  const maxPages = 50;
  let page = 1;
  let lastPage = 1;
  do {
    const res = await blogService.getBlogs(page);
    all.push(...(res.data ?? []));
    lastPage = res.meta?.last_page ?? page;
    page += 1;
  } while (page <= lastPage && page <= maxPages);
  return all;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  // Static public pages, one entry per language.
  for (const path of STATIC_PATHS) {
    for (const lang of LANGS) {
      entries.push({
        url: `${SITE_URL}/${lang}${path}`,
        lastModified: now,
        changeFrequency: 'daily',
        priority: path === '' ? 1 : 0.8,
      });
    }
  }

  // Dynamic: restaurant detail pages.
  try {
    const restaurants = await fetchAllRestaurants();
    for (const r of restaurants) {
      for (const lang of LANGS) {
        const slug = r.slug?.[lang];
        if (!slug) continue; // skip languages with no slug
        entries.push({
          url: `${SITE_URL}/${lang}/places/${slug}`,
          lastModified: now,
          changeFrequency: 'daily',
          priority: 0.7,
        });
      }
    }
  } catch {
    // If the API is unreachable, still return the static + blog entries.
  }

  // Dynamic: blog article pages.
  try {
    const blogs = await fetchAllBlogs();
    for (const b of blogs) {
      for (const lang of LANGS) {
        const slug = b.slug?.[lang];
        if (!slug) continue;
        entries.push({
          url: `${SITE_URL}/${lang}/blog/${slug}`,
          lastModified: b.date ? new Date(b.date) : now,
          changeFrequency: 'daily',
          priority: 0.6,
        });
      }
    }
  } catch {
    // ignore
  }

  return entries;
}
