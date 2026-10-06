import { homeLang } from '@/lib/locales';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import RestaurantCard from '@/components/shared/RestaurantCard';
import JsonLd from '@/components/JsonLd';
import { getT } from '@/lib/i18n';
import { SITE_URL } from '@/lib/seo';
import { breadcrumbSchema, placeListSchema } from '@/lib/schema';
import type { NearbyRestaurant, Restaurant } from '@/types/restaurant';
import type { TaxonomyTerm, TaxonomyType } from '@/types/taxonomy';
import { termLabel } from '@/types/taxonomy';
import { citySegment } from '@/lib/geo';

/** Route segment per taxonomy — kept identical across locales, like /places. */
export const SEGMENT: Record<TaxonomyType, string> = {
  cuisine: 'cuisine',
  category: 'category',
  district: 'district',
  // Cities live under their country: /uzbekistan/tashkent, /canada/toronto.
  // Unlike the other three, this one is a fallback only — use segmentFor(),
  // which reads the segment off the term's country.
  city: 'uzbekistan',
};

/** Route segment for one term. Cities differ per country; the rest are fixed. */
export const segmentFor = (
  type: TaxonomyType,
  term?: { country?: string | null },
) => (type === 'city' ? citySegment(term?.country) : SEGMENT[type]);

interface TaxonomyListingProps {
  lang: string;
  type: TaxonomyType;
  term: TaxonomyTerm;
  places: NearbyRestaurant[];
  page: number;
  lastPage: number;
  total: number;
  /** Sibling terms, rendered as internal links under the list. */
  siblings: TaxonomyTerm[];
}

const resolveSlug = (p: NearbyRestaurant, lang: string) =>
  p.slug?.[lang as 'az' | 'en' | 'ru'] ||
  p.slug?.az ||
  p.slug?.en ||
  p.slug?.ru ||
  String(p.id);

/**
 * A cuisine / category / district listing.
 *
 * Deliberately a SERVER component. The existing `/places` page fetches its
 * restaurants in the browser, so the HTML a crawler receives contains zero
 * restaurant links — all ~840 detail pages are orphans reachable only through
 * the sitemap. Rendering the list on the server is the whole point of these
 * pages: each one ships real <a> links to 24 restaurants, so link equity and
 * crawl paths finally reach them.
 */
export default function TaxonomyListing({
  lang,
  type,
  term,
  places,
  page,
  lastPage,
  total,
  siblings,
}: TaxonomyListingProps) {
  const t = getT(lang);
  const label = termLabel(term, lang);
  const base = `/${lang}/${segmentFor(type, term)}/${term.slug}`;

  const heading = t(`tax.${type}.heading`, { name: label });
  const lead = t(`tax.${type}.lead`, { name: label, count: total });

  // Foreign cities hang off their country hub, not off /places (which only
  // ever lists Azerbaijani restaurants).
  const parent =
    type === 'city'
      ? {
          name: term.country_title?.[lang] || term.country_title?.az || '',
          path: `/${lang}/${segmentFor('city', term)}`,
        }
      : { name: t('nav.places'), path: `/${homeLang(lang)}/places` };

  const schema = [
    breadcrumbSchema([
      { name: t('nav.home'), path: `/${homeLang(lang)}` },
      parent,
      { name: label },
    ]),
    // Only the first page carries the ItemList: deeper pages are the same list
    // continued, and repeating the markup would claim several competing lists
    // for one term.
    page === 1
      ? placeListSchema(
          lang,
          places.map((p) => ({
            title: p.title,
            slug: resolveSlug(p, lang),
            image: p.image || undefined,
          })),
          heading,
        )
      : null,
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd data={schema} />

      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav
            aria-label="breadcrumb"
            className="flex items-center gap-2 text-sm text-gray-600">
            <Link href={`/${homeLang(lang)}`} aria-label={t('nav.home')}>
              <Home className="h-4 w-4 hover:text-[#006653]" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={parent.path}
              className="hover:text-[#006653] transition-colors">
              {parent.name}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{label}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          {heading}
        </h1>
        <p className="mt-2 text-gray-600 max-w-3xl">{lead}</p>

        {places.length === 0 ? (
          <p className="mt-10 text-gray-500">{t('tax.empty')}</p>
        ) : (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {places.map((place) => (
              <RestaurantCard
                key={place.id}
                // The card reads a handful of fields that the list endpoint
                // does send; the wider `Restaurant` type is what it declares.
                place={place as unknown as Restaurant}
                lang={lang}
              />
            ))}
          </div>
        )}

        {lastPage > 1 && (
          <nav
            aria-label="pagination"
            className="mt-10 flex items-center justify-center gap-3 text-sm">
            {page > 1 && (
              <Link
                href={page === 2 ? base : `${base}?page=${page - 1}`}
                className="px-4 py-2 rounded-lg bg-white border hover:border-[#006653] transition-colors">
                {t('tax.prev')}
              </Link>
            )}
            <span className="text-gray-500">{t('tax.page', { n: page })}</span>
            {page < lastPage && (
              <Link
                href={`${base}?page=${page + 1}`}
                className="px-4 py-2 rounded-lg bg-white border hover:border-[#006653] transition-colors">
                {t('tax.next')}
              </Link>
            )}
          </nav>
        )}

        {siblings.length > 0 && (
          <section className="mt-14 pt-8 border-t">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('tax.browseOther')}
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {siblings.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/${lang}/${segmentFor(type, s)}/${s.slug}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border text-sm text-gray-700 hover:border-[#006653] hover:text-[#006653] transition-colors">
                    {termLabel(s, lang)}
                    <span className="text-gray-400">{s.count}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`/${homeLang(lang)}/places`}
              className="inline-block mt-6 text-sm text-[#006653] hover:underline underline-offset-2">
              {t('tax.allPlaces')} →
            </Link>
          </section>
        )}

        {/* Foreign listings (Uzbekistan, Canada, Netherlands, Serbia) come partly from
            OpenStreetMap (ODbL), which asks every page showing its data to
            credit it. */}
        {type === 'city' && (
          <p className="mt-10 text-xs text-gray-400">
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="hover:text-[#006653] transition-colors">
              © OpenStreetMap contributors
            </a>
          </p>
        )}
      </div>
    </div>
  );
}

/** Canonical URL for a term page, used by generateMetadata. */
export function termUrl(
  lang: string,
  type: TaxonomyType,
  slug: string,
  country?: string | null,
) {
  return `${SITE_URL}/${lang}/${segmentFor(type, { country })}/${slug}`;
}
