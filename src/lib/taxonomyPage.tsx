import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import taxonomyService from '@/services/taxonomy.service';
import TaxonomyListing, { segmentFor } from '@/components/Taxonomy/TaxonomyListing';
import { getT } from '@/lib/i18n';
import { buildSocial, pageAlternates } from '@/lib/seo';
import type { TaxonomyTerm, TaxonomyType } from '@/types/taxonomy';
import { termLabel } from '@/types/taxonomy';

/**
 * Shared plumbing for the three taxonomy routes (cuisine / category / district).
 *
 * The routes differ only in which term list they read, so metadata, fetching,
 * pagination and rendering live here once instead of in three near-identical
 * page files.
 */

const PER_PAGE = 24;

export interface TaxonomyPageProps {
  params: Promise<{ lang: string; slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

const parsePage = (value?: string) => {
  const n = Number(value);
  return Number.isInteger(n) && n > 1 ? n : 1;
};

/** Sibling terms of the same type, minus the current one. */
async function siblingsFor(
  type: TaxonomyType,
  slug: string,
  lang: string,
  country?: string | null,
): Promise<TaxonomyTerm[]> {
  try {
    const res = await taxonomyService.getTaxonomies(lang);
    const key = (
      {
        cuisine: 'cuisines',
        category: 'categories',
        district: 'districts',
        city: 'cities',
      } as const
    )[type];
    return (res[key] ?? [])
      .filter((t) => t.slug !== slug)
      // Cities only ever link to cities of the same country: a Toronto page
      // offering Tashkent as "browse other" is a dead end for the reader and
      // pushes link equity across an unrelated section.
      .filter((t) => type !== 'city' || t.country === country)
      .slice(0, 20);
  } catch {
    return [];
  }
}

export async function buildTaxonomyMetadata(
  type: TaxonomyType,
  { params, searchParams }: TaxonomyPageProps,
): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = parsePage((await searchParams).page);
  const t = getT(lang);
  // A city's segment depends on its country, which only the fetched term
  // knows — so the canonical path is finalised after the request.
  let subpath = `/${segmentFor(type)}/${slug}`;
  let alternates = pageAlternates(lang, subpath);

  try {
    const res = await taxonomyService.browse({ type, slug, page, per_page: PER_PAGE, lang });
    subpath = `/${segmentFor(type, res.term)}/${slug}`;
    alternates = pageAlternates(lang, subpath);
    const label = termLabel(res.term, lang);
    const base = t(`tax.${type}.title`, { name: label });
    // Page 2+ says so in the title, otherwise every page of a term competes
    // for the same query with an identical snippet.
    const title = page > 1 ? `${base} — ${t('tax.page', { n: page })}` : base;
    const description = t(`tax.${type}.lead`, {
      name: label,
      count: res.meta?.total ?? res.term.count,
    });

    return {
      title: { absolute: title },
      description,
      alternates,
      // Deep pages carry no unique content of their own; keeping them out of
      // the index while still following the links preserves the crawl path to
      // every restaurant without filling the index with near-duplicates.
      robots: page > 1 ? { index: false, follow: true } : { index: true, follow: true },
      ...buildSocial({ lang, title, description, path: `/${lang}${subpath}` }),
    };
  } catch {
    return { title: { absolute: t('tax.allPlaces') }, alternates };
  }
}

export async function renderTaxonomyPage(
  type: TaxonomyType,
  { params, searchParams }: TaxonomyPageProps,
) {
  const { lang, slug } = await params;
  const page = parsePage((await searchParams).page);

  let res;
  try {
    res = await taxonomyService.browse({ type, slug, page, per_page: PER_PAGE, lang });
  } catch {
    notFound();
  }
  if (!res?.term) notFound();

  const siblings = await siblingsFor(type, slug, lang, res.term.country);

  return (
    <TaxonomyListing
      lang={lang}
      type={type}
      term={res.term}
      places={res.data ?? []}
      page={res.meta?.current_page ?? page}
      lastPage={res.meta?.last_page ?? 1}
      total={res.meta?.total ?? res.term.count}
      siblings={siblings}
    />
  );
}
