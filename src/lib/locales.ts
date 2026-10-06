import { COUNTRY_SEGMENT, HOME_COUNTRY } from './geo';

/**
 * Which languages a page exists in — mirrors App\Support\Geo on the API.
 *
 * The Azerbaijani part of the site (home, /places, Baku restaurants, blog…) is
 * az/en/ru. Each foreign section has its own set: the country's language +
 * English + Russian. Azerbaijani is deliberately absent there — /az/serbia was
 * an Azerbaijani page about Belgrade nobody searches for. A page requested in
 * a language it doesn't have is redirected to English (see src/middleware.ts).
 *
 * The first language of a set is the local one; English is in every set, so it
 * is the safe fallback for links that cross sections.
 */
export const ALL_LANGS = ['az', 'en', 'ru', 'sr', 'nl', 'uz', 'fr', 'lv'] as const;
export type SiteLang = (typeof ALL_LANGS)[number];

export const HOME_LANGS: readonly string[] = ['az', 'en', 'ru'];

export const COUNTRY_LANGS: Record<string, readonly string[]> = {
  AZ: HOME_LANGS,
  UZ: ['uz', 'en', 'ru'],
  CA: ['en', 'fr', 'ru'],
  NL: ['nl', 'en', 'ru'],
  RS: ['sr', 'en', 'ru'],
  LV: ['lv', 'en', 'ru'],
};

/** City key → country. Keys match App\Support\Geo::CITIES and slug suffixes. */
export const CITY_COUNTRY: Record<string, string> = {
  tashkent: 'UZ', samarkand: 'UZ', bukhara: 'UZ', andijan: 'UZ', fergana: 'UZ', namangan: 'UZ',
  toronto: 'CA', montreal: 'CA', vancouver: 'CA', calgary: 'CA', ottawa: 'CA',
  amsterdam: 'NL', rotterdam: 'NL', 'the-hague': 'NL', utrecht: 'NL', eindhoven: 'NL',
  belgrade: 'RS', 'novi-sad': 'RS', nis: 'RS', kragujevac: 'RS', subotica: 'RS',
  riga: 'LV', daugavpils: 'LV', liepaja: 'LV', jelgava: 'LV', jurmala: 'LV',
};

/** hreflang / og:locale per language. Serbian pages are written in Latin script. */
export const HREFLANG: Record<string, string> = {
  az: 'az-AZ',
  en: 'en-US',
  ru: 'ru-RU',
  sr: 'sr-Latn',
  nl: 'nl-NL',
  uz: 'uz',
  fr: 'fr-CA',
  lv: 'lv-LV',
};

/** Value for <html lang>. */
export const HTML_LANG: Record<string, string> = { sr: 'sr-Latn' };

const SEGMENT_COUNTRY: Record<string, string> = Object.fromEntries(
  Object.entries(COUNTRY_SEGMENT).map(([country, segment]) => [segment, country]),
);

// Imported restaurant slugs end with their city key: "orasac-belgrade",
// "cafe-roma-the-hague-2". Longest keys first so "novi-sad" wins over "sad".
const CITY_SUFFIX = new RegExp(
  `-(${Object.keys(CITY_COUNTRY)
    .sort((a, b) => b.length - a.length)
    .join('|')})(?:-\\d+)?$`,
);

/**
 * Country a page belongs to, from its path after the language segment:
 * '/serbia/belgrade' → RS, '/places/orasac-belgrade/menu' → RS, '/blog' → AZ.
 */
export function countryOfPath(subpath: string): string {
  const parts = subpath.split('/').filter(Boolean);
  if (parts[0] && SEGMENT_COUNTRY[parts[0]]) return SEGMENT_COUNTRY[parts[0]];
  if (parts[0] === 'places' && parts[1]) {
    const m = parts[1].match(CITY_SUFFIX);
    if (m) return CITY_COUNTRY[m[1]];
  }
  return HOME_COUNTRY;
}

export const langsFor = (country?: string | null): readonly string[] =>
  COUNTRY_LANGS[country ?? HOME_COUNTRY] ?? HOME_LANGS;

export const langsForPath = (subpath: string) => langsFor(countryOfPath(subpath));

/** `lang` if the country's pages exist in it, otherwise English. */
export const langForCountry = (country: string | null | undefined, lang: string) =>
  langsFor(country).includes(lang) ? lang : 'en';

/** Language for links into the Azerbaijani section (nav, footer, /places). */
export const homeLang = (lang: string) => langForCountry(HOME_COUNTRY, lang);

/** Strip the language segment: '/sr/serbia/nis' → '/serbia/nis'. */
export function stripLang(pathname: string): string {
  const parts = pathname.split('/');
  return (ALL_LANGS as readonly string[]).includes(parts[1])
    ? `/${parts.slice(2).join('/')}`.replace(/\/$/, '') || ''
    : pathname;
}
