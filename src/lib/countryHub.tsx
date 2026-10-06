import type { Metadata } from 'next';
import taxonomyService from '@/services/taxonomy.service';
import TaxonomyIndex, { cityHubKey } from '@/components/Taxonomy/TaxonomyIndex';
import { getT } from '@/lib/i18n';
import { buildSocial, pageAlternates } from '@/lib/seo';
import { COUNTRY_SEGMENT } from '@/lib/geo';

/**
 * Shared plumbing for the foreign-country hubs (/uzbekistan, /canada).
 *
 * Each hub lists the cities of one country and is the only crawl path into
 * that section — /places lists Azerbaijani restaurants only. The two routes
 * differ solely in the country code, so metadata and rendering live here.
 */
export interface CountryHubProps {
  params: Promise<{ lang: string }>;
}

const citiesOf = (lang: string, country: string) =>
  taxonomyService
    .getTaxonomies(lang)
    .then((res) => (res.cities ?? []).filter((c) => c.country === country))
    .catch(() => []);

export async function buildCountryHubMetadata(
  country: string,
  { params }: CountryHubProps,
): Promise<Metadata> {
  const { lang } = await params;
  const t = getT(lang);
  const key = cityHubKey(country);
  const title = t(key);
  const description = t(`${key}.lead`);
  const cities = await citiesOf(lang, country);
  const path = `/${COUNTRY_SEGMENT[country]}`;

  return {
    title: { absolute: `${title} | Harada Oturaq` },
    description,
    alternates: pageAlternates(lang, path),
    // With a single city this hub only repeats the city page's search intent,
    // so it stays crawlable but out of the index until a second city arrives.
    robots: cities.length > 1 ? { index: true, follow: true } : { index: false, follow: true },
    ...buildSocial({ lang, title, description, path: `/${lang}${path}` }),
  };
}

export async function renderCountryHub(country: string, { params }: CountryHubProps) {
  const { lang } = await params;
  const terms = await citiesOf(lang, country);

  return <TaxonomyIndex lang={lang} type="city" terms={terms} />;
}
