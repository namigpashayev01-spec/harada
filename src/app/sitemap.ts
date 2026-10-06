import type { MetadataRoute } from 'next';
import placeService from '@/services/place.service';
import blogService from '@/services/blog.service';
import taxonomyService from '@/services/taxonomy.service';
import { SitemapRestaurant } from '@/types/restaurant';
import { BlogItem } from '@/types/blog';
import { SITE_URL } from '@/lib/seo';
import { langsFor, langsForPath } from '@/lib/locales';

// Regenerate the sitemap once a day (dynamic — pulls live restaurants/blogs).
export const revalidate = 86400;

// Azerbaijani-section pages (= HOME_LANGS). Foreign sections use their own set (langsFor).
const LANGS = ['az', 'en', 'ru'] as const;

// [country code, URL segment] — mirrors COUNTRY_SEGMENT in src/lib/geo.ts.
// Restaurants outside Azerbaijan live under their own country hub.
const FOREIGN_COUNTRIES = [
  ['UZ', 'uzbekistan'],
  ['CA', 'canada'],
  ['NL', 'netherlands'],
  ['RS', 'serbia'],
  ['LV', 'latvia'],
] as const;

// Public routes (subpath after the language segment). Private pages
// (login/register/dashboard) are intentionally excluded — they are noindex.
const STATIC_PATHS = [
  '',
  '/places',
  '/about',
  '/contact',
  '/blog',
  '/restaurant-register',
  // Taxonomy hubs — the pages that link on to every cuisine/category/district.
  '/cuisine',
  '/category',
  '/district',
];

async function fetchAllRestaurants(): Promise<SitemapRestaurant[]> {
  const res = await placeService.getRestaurantSlugs();
  return res.data ?? [];
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
      // Noindexed pages (fact-thin imports) don't belong in a sitemap — listing
      // them sends Google two contradicting signals.
      if (r.indexable === false) continue;
      // A Belgrade restaurant exists in sr/en/ru, a Baku one in az/en/ru.
      const anySlug = r.slug?.en || r.slug?.az || '';
      for (const lang of langsForPath(`/places/${anySlug}`)) {
        const slug = r.slug?.[lang as keyof typeof r.slug];
        if (!slug) continue; // skip languages with no slug
        entries.push({
          url: `${SITE_URL}/${lang}/places/${slug}`,
          lastModified: now,
          changeFrequency: 'daily',
          priority: 0.7,
        });

        // Menu pages answer their own search intent ("<restaurant> menyu",
        // "<ресторан> меню цены") and were previously reachable only through
        // an in-page link. Listed only where there is a menu to show.
        if (r.has_menu) {
          entries.push({
            url: `${SITE_URL}/${lang}/places/${slug}/menu`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.6,
          });
        }
      }
    }
  } catch (e) {
    // If the API is unreachable, still return the static + blog entries — but
    // log it, otherwise the sitemap silently ships with no restaurants at all.
    console.error('[sitemap] restaurants unavailable:', (e as Error)?.message);
  }

  // Dynamic: blog article pages.
  try {
    const blogs = await fetchAllBlogs();
    for (const b of blogs) {
      for (const lang of LANGS) {
        const slug = b.slug?.[lang];
        if (!slug) continue;
        // `date` is a localized display string ("Dərc olunub: 15 Mart 2026");
        // only `date_iso` is safe to hand to Date().
        const published = b.date_iso ? new Date(b.date_iso) : null;
        entries.push({
          url: `${SITE_URL}/${lang}/blog/${slug}`,
          lastModified:
            published && !Number.isNaN(published.getTime()) ? published : now,
          changeFrequency: 'daily',
          priority: 0.6,
        });
      }
    }
  } catch {
    // ignore
  }

  // Dynamic: cuisine / category / district landing pages. These carry the only
  // server-rendered links to restaurant pages on the whole site, so keeping
  // them out of the sitemap would waste the crawl path they exist to provide.
  try {
    const tax = await taxonomyService.getTaxonomies();

    const groups: [string, { slug: string }[]][] = [
      ['cuisine', tax.cuisines ?? []],
      ['category', tax.categories ?? []],
      ['district', tax.districts ?? []],
      // Foreign city pages (/uzbekistan/tashkent, /canada/toronto). A country
      // hub itself is noindex while it has a single city, so it is listed only
      // once it holds more than one.
      ...FOREIGN_COUNTRIES.map(
        ([country, segment]) =>
          [segment, (tax.cities ?? []).filter((c) => c.country === country)] as [
            string,
            { slug: string }[],
          ],
      ),
    ];
    for (const [country, segment] of FOREIGN_COUNTRIES) {
      const cities = (tax.cities ?? []).filter((c) => c.country === country);
      if (cities.length > 1) {
        for (const lang of langsFor(country)) {
          entries.push({
            url: `${SITE_URL}/${lang}/${segment}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      }
    }
    for (const [segment, terms] of groups) {
      for (const term of terms) {
        const country = (term as { country?: string }).country;
        for (const lang of langsFor(country)) {
          entries.push({
            url: `${SITE_URL}/${lang}/${segment}/${term.slug}`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 0.7,
          });
        }
      }
    }
  } catch (e) {
    console.error('[sitemap] taxonomies unavailable:', (e as Error)?.message);
  }

  return entries;
}
