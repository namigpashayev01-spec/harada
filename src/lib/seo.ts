import type { Metadata } from 'next';
import { HREFLANG, langsForPath } from './locales';

export const SITE_URL = 'https://harada-oturaq.az';
export const SITE_NAME = 'Harada Oturaq';

// Site-wide fallback share image (1200x630). Resolved against metadataBase.
// Regenerate with `node scripts/make-og.mjs`.
export const DEFAULT_OG_IMAGE = '/og-default.png';

// Map our route language segment to an OpenGraph locale code.
const OG_LOCALE: Record<string, string> = {
  az: 'az_AZ',
  en: 'en_US',
  ru: 'ru_RU',
  sr: 'sr_RS',
  nl: 'nl_NL',
  uz: 'uz_UZ',
  fr: 'fr_CA',
  lv: 'lv_LV',
};

/**
 * Build self-referencing canonical + hreflang alternates for a page.
 *
 * @param lang    current language segment (az | en | ru)
 * @param subpath path after the language segment, e.g. '/about' or '' for home
 *
 * Canonical points to the exact current URL (e.g. /az/about), while
 * `languages` lists the same page in every supported language so search
 * engines can index each localized version correctly. Relative paths are
 * resolved against `metadataBase` (set in the root layout) to absolute URLs.
 */
export function pageAlternates(
  lang: string,
  subpath = '',
): NonNullable<Metadata['alternates']> {
  // Only the languages this page actually exists in: a Serbian restaurant is
  // sr/en/ru, a Baku one az/en/ru (src/lib/locales.ts).
  return {
    canonical: `/${lang}${subpath}`,
    languages: Object.fromEntries(
      langsForPath(subpath).map((l) => [HREFLANG[l] ?? l, `/${l}${subpath}`]),
    ),
  };
}

interface SocialInput {
  lang: string;
  title: string;
  description?: string;
  /** Path after the domain (e.g. '/az/places/foo') — resolved via metadataBase.
   *  Omit for the site-wide default so no misleading og:url is emitted. */
  path?: string;
  /** Absolute image URL (restaurant/blog photo). Falls back to DEFAULT_OG_IMAGE. */
  image?: string;
  type?: 'website' | 'article';
}

/**
 * Build OpenGraph + Twitter tags so shared links (WhatsApp, Facebook, X,
 * Telegram, LinkedIn) render a rich card with an image, title and description.
 *
 * Spread the result into a page's Metadata alongside `alternates`. Pages that
 * have a real photo (restaurants, blog posts) pass `image`; everything else
 * falls back to the branded default card.
 */
export function buildSocial({
  lang,
  title,
  description,
  path,
  image,
  type = 'website',
}: SocialInput): Pick<Metadata, 'openGraph' | 'twitter'> {
  // og:locale:alternate — the page's other languages (path is '/{lang}/…').
  const pageLangs = path ? langsForPath(path.replace(/^\/[a-z]{2}(?=\/|$)/, '')) : ['az', 'en', 'ru'];
  const alternateLocale = pageLangs
    .filter((l) => l !== lang)
    .map((l) => OG_LOCALE[l]);

  // Known-good dimensions only for our own default card; API photos vary.
  const images = image
    ? [{ url: image, alt: title }]
    : [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }];

  return {
    openGraph: {
      title,
      description,
      ...(path ? { url: path } : {}),
      siteName: SITE_NAME,
      type,
      locale: OG_LOCALE[lang] ?? 'az_AZ',
      alternateLocale,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: image ? [image] : [DEFAULT_OG_IMAGE],
    },
  };
}

/* ---------------------------------------------------------------------------
   Structured data (JSON-LD)

   Blog posts are the one place on the site where rich results are realistically
   reachable, so articles ship an Article + BreadcrumbList graph. Emit the
   result inside a <script type="application/ld+json"> in a server component so
   it lands in the initial HTML.
--------------------------------------------------------------------------- */

interface ArticleSchemaInput {
  lang: string;
  headline: string;
  description: string;
  slug: string;
  image?: string;
  /** ISO 8601 date; falls back to omitting the field when unknown. */
  published?: string;
}

export function articleJsonLd({
  lang,
  headline,
  description,
  slug,
  image,
  published,
}: ArticleSchemaInput) {
  const url = `${SITE_URL}/${lang}/blog/${slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: headline.slice(0, 110),
    description,
    inLanguage: lang,
    url,
    ...(image ? { image: [image] } : {}),
    ...(published ? { datePublished: published } : {}),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
      },
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}
