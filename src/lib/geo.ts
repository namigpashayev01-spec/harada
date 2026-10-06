/**
 * Country handling on the frontend — mirrors App\Support\Geo on the API.
 *
 * The site is built around Azerbaijan. Restaurants from other countries
 * (Uzbekistan, Canada, the Netherlands and Serbia: public facts from Restaurant Guru and OpenStreetMap)
 * get their own section under a country segment, /{lang}/{country}/{city}, and
 * never appear in the Azerbaijani listings. They have no reservation flow and use their own city
 * in breadcrumbs and structured data.
 */
export const HOME_COUNTRY = 'AZ';

/** URL segment per foreign country. */
export const COUNTRY_SEGMENT: Record<string, string> = {
  UZ: 'uzbekistan',
  CA: 'canada',
  NL: 'netherlands',
  RS: 'serbia',
  LV: 'latvia',
};

/**
 * URL segment for a city term. Cities are the one taxonomy whose segment is not
 * fixed: each belongs to its own country hub (/uzbekistan/tashkent,
 * /canada/toronto), so the segment comes from the term, not the taxonomy type.
 */
export const citySegment = (country?: string | null) =>
  COUNTRY_SEGMENT[country ?? ''] ?? COUNTRY_SEGMENT.UZ;

export const isHomeCountry = (country?: string | null) =>
  (country ?? HOME_COUNTRY) === HOME_COUNTRY;

/** '/az/uzbekistan' — null for the home country, which has no segment. */
export const countryPath = (lang: string, country?: string | null) =>
  country && COUNTRY_SEGMENT[country] ? `/${lang}/${COUNTRY_SEGMENT[country]}` : null;

/** '/az/uzbekistan/tashkent' */
export const cityPath = (lang: string, country?: string | null, city?: string | null) => {
  const base = countryPath(lang, country);
  return base && city ? `${base}/${city}` : null;
};
