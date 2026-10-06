import { homeLang } from '@/lib/locales';
import { getT } from '@/lib/i18n';
import { SITE_NAME, SITE_URL, DEFAULT_OG_IMAGE } from '@/lib/seo';
import { HOME_COUNTRY, countryPath, cityPath } from '@/lib/geo';
import type { Restaurant, MenuCategory, WorkingDay } from '@/types/restaurant';

/**
 * Schema.org JSON-LD builders.
 *
 * Everything here returns a plain object that a server component renders with
 * <JsonLd data={...} />. The site had no structured data at all, so Google saw
 * ~2500 restaurant pages as generic documents: no rich result, no price range,
 * no opening hours, no menu link. These builders feed it the facts we already
 * hold in the database.
 *
 * Rule for every builder: emit a property ONLY when the underlying data is
 * real. A guessed `priceRange` or an invented `aggregateRating` is a
 * structured-data violation and risks a manual action, which would cost far
 * more than the markup gains. Absent data means an absent key.
 */

/** A JSON-LD node. Values are whatever schema.org allows, hence `unknown`. */
export type SchemaNode = Record<string, unknown>;

/** Schema.org day names, indexed by the API's lowercase English day. */
const DAY_MAP: Record<string, string> = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

/** Absolute URL for a path that may already be absolute. */
function abs(path: string): string {
  if (!path) return '';
  return /^https?:\/\//i.test(path) ? path : `${SITE_URL}${path}`;
}

/** Strip HTML and collapse whitespace — descriptions arrive as stored markup. */
export function plainText(html: string | null | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/** "09:00:00" → "09:00". Schema.org wants HH:MM. */
function hhmm(time: string | null | undefined): string | null {
  if (!time) return null;
  const m = /^(\d{2}):(\d{2})/.exec(time);
  return m ? `${m[1]}:${m[2]}` : null;
}

/**
 * Opening hours as one specification per day.
 *
 * The API splits a day into breakfast/lunch/dinner windows, so a day can carry
 * several meals. We collapse them to the day's outer envelope (earliest open →
 * latest close) because that is what "when is it open" means to a searcher;
 * the per-meal split stays on the page for the reservation flow.
 */
function openingHours(days: WorkingDay[] | undefined): SchemaNode[] {
  if (!days?.length) return [];
  const out: SchemaNode[] = [];

  for (const day of days) {
    const name = DAY_MAP[day.day];
    if (!name || !day.is_open || !day.meals?.length) continue;

    const opens = day.meals.map((m) => hhmm(m.start_time)).filter(Boolean) as string[];
    const closes = day.meals.map((m) => hhmm(m.end_time)).filter(Boolean) as string[];
    if (!opens.length || !closes.length) continue;

    out.push({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: `https://schema.org/${name}`,
      opens: opens.sort()[0],
      closes: closes.sort()[closes.length - 1],
    });
  }
  return out;
}

/**
 * `priceRange` from the restaurant's own dish prices.
 *
 * Google accepts either a symbolic range ($$) or a concrete one. A concrete
 * range is more useful and is verifiable against the page, so we emit that and
 * only when we actually have prices.
 */
function priceRange(menuCategories: MenuCategory[] | undefined): string | null {
  const prices = (menuCategories ?? [])
    .flatMap((c) => c.dishes ?? [])
    .map((d) => Number(d.price))
    .filter((p) => Number.isFinite(p) && p > 0);
  if (!prices.length) return null;

  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? `${min} AZN` : `${min}–${max} AZN`;
}

/**
 * The "Mətbəx" / Cuisine property. Restaurants also carry a "Məkan tipi"
 * property (Outdoor / Indoor) under the same `properties` array, and calling
 * "Outdoor" a cuisine would be plainly wrong markup, so cuisines are read from
 * this property alone.
 */
const CUISINE_PROPERTY_ID = 2;

/** Cuisine tags — sub-properties of the Cuisine property only. */
function servesCuisine(r: Restaurant): string[] {
  const titles = (r.properties ?? [])
    .filter((p) => p.id === CUISINE_PROPERTY_ID)
    .flatMap((p) => (p.sub_properties ?? []).map((s) => s.title));
  return [...new Set(titles.filter((v): v is string => Boolean(v && v.trim())))];
}

/**
 * Category tags (Pizza, Breakfast, Business lunch, Tea …). These describe what
 * the place is good for rather than a cuisine, so they belong in `keywords`,
 * not `servesCuisine`.
 */
function keywords(r: Restaurant): string[] {
  const titles = (r.categories ?? []).map((c) => c.title);
  return [...new Set(titles.filter((v): v is string => Boolean(v && v.trim())))];
}

/** The restaurant's own page URL in the given language. */
function placeUrl(lang: string, slug: string): string {
  return `${SITE_URL}/${lang}/places/${slug}`;
}

/**
 * The main `Restaurant` node.
 *
 * @param withMenuLink emit `hasMenu` — only true when the restaurant really
 *   has dishes, otherwise the link points at an empty page.
 */
export function restaurantSchema(
  r: Restaurant,
  lang: string,
  slug: string,
): SchemaNode {
  const url = placeUrl(lang, slug);
  const node: SchemaNode = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${url}#restaurant`,
    name: r.title,
    url,
  };

  const description = plainText(r.description) || plainText(r.seo_description);
  if (description) node.description = description;
  if (r.image) node.image = abs(r.image);
  if (r.phone) node.telephone = r.phone;
  if (r.website) node.sameAs = [r.website];

  // Azerbaijani rows carry no city yet and have always been marked Bakı; a
  // foreign restaurant must carry its own city — a Tashkent address labelled
  // Bakı would be plainly false markup.
  const isHome = (r.country ?? HOME_COUNTRY) === HOME_COUNTRY;
  const locality = r.city_name || (isHome ? 'Bakı' : null);
  if (r.address) {
    node.address = {
      '@type': 'PostalAddress',
      streetAddress: r.address,
      ...(locality ? { addressLocality: locality } : {}),
      addressCountry: r.country ?? HOME_COUNTRY,
    };
  }

  const lat = Number(r.latitude);
  const lon = Number(r.longitude);
  if (Number.isFinite(lat) && Number.isFinite(lon) && lat !== 0 && lon !== 0) {
    node.geo = { '@type': 'GeoCoordinates', latitude: lat, longitude: lon };
    node.hasMap = `https://www.google.com/maps?q=${lat},${lon}`;
  }

  const cuisine = servesCuisine(r);
  if (cuisine.length) node.servesCuisine = cuisine;

  const tags = keywords(r);
  if (tags.length) node.keywords = tags.join(', ');

  // Real dish prices win; without a menu fall back to the imported $–$$$$
  // level, which Google also accepts as a priceRange.
  const level = Number(r.price_level);
  const range =
    priceRange(r.menu_categories) ??
    (level >= 1 && level <= 4 ? '$'.repeat(level) : null);
  if (range) node.priceRange = range;

  const hours = openingHours(r.working_hours);
  if (hours.length) node.openingHoursSpecification = hours;

  const dishCount = (r.menu_categories ?? []).reduce(
    (n, c) => n + (c.dishes?.length ?? 0),
    0,
  );
  if (dishCount > 0) node.hasMenu = `${url}/menu`;

  // No reviews exist yet. When they do, add aggregateRating here — never
  // before, since a rating without reviews is exactly what Google penalises.
  return node;
}

/**
 * The `Menu` node for a restaurant's menu page: sections and dishes with real
 * prices, so Google can surface "what's on the menu and what does it cost".
 */
export function menuSchema(
  r: Restaurant,
  lang: string,
  slug: string,
  categories: MenuCategory[],
): SchemaNode | null {
  const sections = categories
    .filter((c) => c.dishes?.length)
    .map((c) => ({
      '@type': 'MenuSection',
      name: c.name,
      hasMenuItem: c.dishes.map((d) => {
        const item: SchemaNode = { '@type': 'MenuItem', name: d.name };
        if (d.description) item.description = plainText(d.description);
        const price = Number(d.price);
        if (Number.isFinite(price) && price > 0) {
          item.offers = {
            '@type': 'Offer',
            price: price,
            priceCurrency: 'AZN',
          };
        }
        return item;
      }),
    }));

  if (!sections.length) return null;

  const url = placeUrl(lang, slug);
  return {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    '@id': `${url}/menu#menu`,
    url: `${url}/menu`,
    name: `${r.title} — menyu`,
    inLanguage: lang,
    hasMenuSection: sections,
  };
}

/** One crumb: a visible label and the page it points to. */
export interface Crumb {
  name: string;
  /** Path after the domain, e.g. '/az/places'. Omit on the current page. */
  path?: string;
}

/**
 * `BreadcrumbList` — renders the navigation trail under the result in Google
 * instead of a bare URL. The last crumb is the current page and carries no
 * `item`, per Google's guidance.
 */
export function breadcrumbSchema(crumbs: Crumb[]): SchemaNode {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => {
      const el: SchemaNode = {
        '@type': 'ListItem',
        position: i + 1,
        name: c.name,
      };
      if (c.path) el.item = `${SITE_URL}${c.path}`;
      return el;
    }),
  };
}

/** Where a restaurant sits geographically — enough to build its trail. */
export interface PlaceGeo {
  country?: string | null;
  country_name?: string | null;
  city?: string | null;
  city_name?: string | null;
}

/**
 * Ready-made trail for a restaurant page: Home › Places › <name>. A foreign
 * restaurant hangs off its own section instead — Home › Uzbekistan › Tashkent
 * › <name> — because /places lists Azerbaijani restaurants only.
 */
export function placeCrumbs(
  lang: string,
  name: string,
  slug?: string,
  geo?: PlaceGeo,
): Crumb[] {
  const t = getT(lang);
  const home: Crumb = { name: t('nav.home'), path: `/${homeLang(lang)}` };
  const current: Crumb = slug ? { name, path: `/${lang}/places/${slug}` } : { name };

  const countryHref = countryPath(lang, geo?.country);
  if (countryHref && geo?.country_name) {
    const trail: Crumb[] = [home, { name: geo.country_name, path: countryHref }];
    const cityHref = cityPath(lang, geo.country, geo.city);
    if (cityHref && geo.city_name) trail.push({ name: geo.city_name, path: cityHref });
    return [...trail, current];
  }

  return [home, { name: t('nav.places'), path: `/${homeLang(lang)}/places` }, current];
}

/**
 * Site-wide identity: the organisation behind the site plus a `WebSite` node
 * carrying the internal search action, which lets Google show a search box for
 * the brand.
 */
export function siteSchema(lang: string): SchemaNode {
  const t = getT(lang);
  const org: SchemaNode = {
    '@type': 'Organization',
    '@id': `${SITE_URL}#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
    areaServed: { '@type': 'City', name: 'Bakı' },
  };

  const website: SchemaNode = {
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    name: SITE_NAME,
    url: `${SITE_URL}/${homeLang(lang)}`,
    inLanguage: lang,
    publisher: { '@id': `${SITE_URL}#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/${homeLang(lang)}/places?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    description: t('seo.home.description'),
  };

  return { '@context': 'https://schema.org', '@graph': [org, website] };
}

/** Minimal shape a listing card needs to appear in an ItemList. */
export interface ListedPlace {
  title: string;
  slug: string;
  image?: string;
}

/**
 * `ItemList` for a taxonomy listing — tells Google the page is a ranked list of
 * distinct restaurants rather than one long document.
 *
 * Only valid where the list is rendered on the SERVER: structured data must
 * describe what the crawler actually sees, and `/places` builds its list in the
 * browser, so it deliberately has no ItemList.
 */
export function placeListSchema(
  lang: string,
  places: ListedPlace[],
  listName: string,
): SchemaNode | null {
  if (!places.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: listName,
    numberOfItems: places.length,
    itemListElement: places.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: placeUrl(lang, p.slug),
      name: p.title,
      ...(p.image ? { image: abs(p.image) } : {}),
    })),
  };
}
