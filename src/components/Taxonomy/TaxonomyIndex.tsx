import { homeLang } from '@/lib/locales';
import Link from 'next/link';
import Image from 'next/image';
import BannerImg from '@/assets/images/banner.jpg';
import { ChevronRight, Home } from 'lucide-react';
import JsonLd from '@/components/JsonLd';
import { getT } from '@/lib/i18n';
import { breadcrumbSchema } from '@/lib/schema';
import { segmentFor } from '@/components/Taxonomy/TaxonomyListing';
import type { TaxonomyTerm, TaxonomyType } from '@/types/taxonomy';
import { termLabel } from '@/types/taxonomy';

interface TaxonomyIndexProps {
  lang: string;
  type: TaxonomyType;
  terms: TaxonomyTerm[];
}

const PLURAL: Record<TaxonomyType, string> = {
  cuisine: 'tax.index.cuisines',
  category: 'tax.index.categories',
  district: 'tax.index.districts',
  city: 'tax.index.cities',
};

/**
 * Heading key for a city hub. Each foreign country gets its own string because
 * the country name is declined differently per language (ru: "Рестораны
 * Узбекистана"), so a placeholder would produce broken grammar.
 */
const CITY_HUB_KEYS: Record<string, string> = {
  UZ: 'tax.index.cities.uz',
  CA: 'tax.index.cities.ca',
  NL: 'tax.index.cities.nl',
  RS: 'tax.index.cities.rs',
  LV: 'tax.index.cities.lv',
};

export const cityHubKey = (country?: string | null) =>
  CITY_HUB_KEYS[country ?? ''] ?? 'tax.index.cities';

/**
 * Hub page listing every term of one taxonomy.
 *
 * Its job is link distribution: three hub pages point at ~35 term pages, and
 * each term page points at up to 24 restaurants. That is the crawl path the
 * site was missing entirely — before this, no page on the site linked to a
 * single restaurant.
 */
export default function TaxonomyIndex({ lang, type, terms }: TaxonomyIndexProps) {
  const t = getT(lang);
  const key = type === 'city' ? cityHubKey(terms[0]?.country) : PLURAL[type];
  const heading = t(key);
  const lead = t(`${key}.lead`);
  // A country hub (/uzbekistan, /canada) sits directly under home: /places
  // lists only Azerbaijani restaurants, so it isn't this page's parent.
  const underPlaces = type !== 'city';
  // Country hubs open with the same green hero as the home page, worded for
  // that country (hub.<cc>.* keys); the home page itself stays about Baku.
  const country = type === 'city' ? terms[0]?.country?.toLowerCase() : undefined;
  const hero = country && CITY_HUB_KEYS[country.toUpperCase()] ? country : undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <JsonLd
        data={breadcrumbSchema([
          { name: t('nav.home'), path: `/${homeLang(lang)}` },
          ...(underPlaces ? [{ name: t('nav.places'), path: `/${homeLang(lang)}/places` }] : []),
          { name: heading },
        ])}
      />

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
              href={`/${homeLang(lang)}/places`}
              className="hover:text-[#006653] transition-colors">
              {t('nav.places')}
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">{heading}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-8 pb-16">
        {hero ? (
          <div
            className="relative overflow-hidden rounded-[20px] px-6 py-10 sm:px-10 md:px-14 md:py-14"
            style={{
              background:
                'linear-gradient(135deg, #013a30 0%, #006653 55%, #0a7d54 100%)',
            }}>
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-black/10" />
            <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="text-white">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-sm font-medium backdrop-blur-sm">
                  🍽️ {t(`hub.${hero}.badge`)}
                </span>
                <h1 className="mt-5 text-3xl font-bold leading-[1.1] tracking-tight sm:text-4xl lg:text-[48px]">
                  {t(`hub.${hero}.line1`)} <br className="hidden sm:block" />
                  {t(`hub.${hero}.line2`)}
                </h1>
                <p className="mt-4 max-w-xl text-base text-white/85 md:text-lg">{lead}</p>
              </div>
              <div className="relative hidden lg:block">
                <div className="relative ml-auto aspect-[4/3] w-full max-w-[420px] overflow-hidden rounded-2xl shadow-2xl rotate-2">
                  <Image
                    src={BannerImg}
                    alt={heading}
                    fill
                    priority
                    sizes="420px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{heading}</h1>
            <p className="mt-2 text-gray-600 max-w-3xl">{lead}</p>
          </>
        )}

        {terms.length === 0 ? (
          <p className="mt-10 text-gray-500">{t('tax.empty')}</p>
        ) : (
          <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {terms.map((term) => (
              <li key={term.slug}>
                <Link
                  href={`/${lang}/${segmentFor(type, term)}/${term.slug}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-white border hover:border-[#006653] transition-colors">
                  <span className="font-medium text-gray-900">
                    {termLabel(term, lang)}
                  </span>
                  <span className="text-sm text-gray-500 whitespace-nowrap">
                    {t('tax.count', { n: term.count })}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}

        <Link
          href={`/${homeLang(lang)}/places`}
          className="inline-block mt-10 text-sm text-[#006653] hover:underline underline-offset-2">
          {t('tax.allPlaces')} →
        </Link>
      </div>
    </div>
  );
}
