import { getT } from '@/lib/i18n';
import { SITE_NAME } from '@/lib/seo';

/**
 * Title/description for a restaurant's menu page.
 *
 * People search these pages by name plus intent — "<restoran> menyu",
 * "<restoran> qiymətləri", "меню <ресторан> цены", "<restaurant> menu prices" —
 * so the title leads with the restaurant name and names both the menu and the
 * prices. The description is built from that restaurant's own numbers (dish
 * count, price range, sections) so every one of the ~800 menu pages gets a
 * distinct, concrete snippet instead of one boilerplate sentence repeated, and
 * a searcher can see the price range before deciding to click.
 */

/** Google truncates around here; past it the tail is dropped in the SERP. */
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 155;

export interface MenuFacts {
  name: string;
  dishCount: number;
  /** Cheapest and priciest dish, in manat. */
  minPrice: number | null;
  maxPrice: number | null;
  /** Menu section names, already localized (e.g. "Soups", "Kebabs"). */
  sections: string[];
}

/** Russian needs three forms: 1 блюдо, 2–4 блюда, 5+ блюд. */
function ruPluralIndex(n: number): 0 | 1 | 2 {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 0;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 1;
  return 2;
}

/** "182 dishes" / "182 блюда" — exported so the page heading and the meta
 *  description can't drift apart. */
export function dishesLabel(lang: string, n: number): string {
  const t = getT(lang);
  const key = (
    ['seo.menu.dishesOne', 'seo.menu.dishesFew', 'seo.menu.dishesMany'] as const
  )[ruPluralIndex(n)];
  return t(key, { n });
}

// Azerbaijani casing: 'i' uppercases to 'İ' and 'I' lowercases to 'ı'.
const AZ_UPPER: Record<string, string> = { i: 'İ', ı: 'I' };
const AZ_LOWER: Record<string, string> = { I: 'ı', İ: 'i' };

function azLower(s: string): string {
  return s.replace(/[Iİ]/g, (c) => AZ_LOWER[c]).toLowerCase();
}

/**
 * Restaurants type their section names however they like, and a lot of them
 * shout ("SƏHƏR YEMƏYİ", "ŞORBALAR"). All-caps in a meta description reads as
 * spam and invites Google to rewrite the snippet, so anything fully uppercase
 * is brought back to sentence case. Mixed-case names are left untouched —
 * they are already how the restaurant wants them.
 */
function tidyCase(text: string): string {
  const letters = text.replace(/[^\p{L}]/gu, '');
  if (!letters || letters !== letters.toUpperCase() || letters.length < 2) {
    return text;
  }
  return text
    .split(/(\s+)/)
    .map((word) => {
      if (!/\p{L}/u.test(word)) return word;
      const first = word[0];
      const upper = AZ_UPPER[azLower(first)] ?? first.toUpperCase();
      return upper + azLower(word.slice(1));
    })
    .join('');
}

/** Drop trailing decimals so "12.00 ₼" reads as "12 ₼". */
function money(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(2).replace(/0+$/, '').replace(/\.$/, '');
}

export function buildMenuTitle(lang: string, name: string): string {
  const t = getT(lang);
  const full = t('seo.menu.title', { name });
  const branded = `${full} | ${SITE_NAME}`;

  // Prefer the branded form; give up the brand, then the "& Prices" half,
  // rather than let Google cut the restaurant name off mid-word.
  if (branded.length <= TITLE_MAX) return branded;
  if (full.length <= TITLE_MAX) return full;
  return t('seo.menu.titleShort', { name });
}

export function buildMenuDescription(lang: string, facts: MenuFacts): string {
  const t = getT(lang);
  const { name, dishCount, minPrice, maxPrice, sections } = facts;

  const parts: string[] = [
    dishCount > 0
      ? t('seo.menu.lead', { name, dishes: dishesLabel(lang, dishCount) })
      : t('seo.menu.leadNoCount', { name }),
  ];

  if (minPrice != null && maxPrice != null && maxPrice > minPrice) {
    parts.push(t('seo.menu.priceRange', { min: money(minPrice), max: money(maxPrice) }));
  } else if (minPrice != null) {
    parts.push(t('seo.menu.pricesFrom', { min: money(minPrice) }));
  }

  const cta = t('seo.menu.cta');
  let text = `${parts.join(', ')}.`;

  // Section names are the strongest keyword signal after the price, but only
  // add them while the call to action still fits — the CTA is what earns clicks.
  for (const take of [3, 2, 1]) {
    if (sections.length < take) continue;
    const candidate = `${parts.join(', ')}. ${sections.slice(0, take).join(', ')}. ${cta}`;
    if (candidate.length <= DESCRIPTION_MAX) return candidate;
  }

  const withCta = `${text} ${cta}`;
  if (withCta.length <= DESCRIPTION_MAX) return withCta;

  if (text.length > DESCRIPTION_MAX) {
    text = text.slice(0, DESCRIPTION_MAX - 1).trimEnd() + '…';
  }
  return text;
}

/** Pull the numbers a menu description needs out of the API payload. */
export function collectMenuFacts(
  name: string,
  menuCategories: { name: string | null; dishes: { price: number | null }[] }[]
): MenuFacts {
  const prices = menuCategories
    .flatMap((c) => c.dishes.map((d) => d.price))
    .filter((p): p is number => typeof p === 'number' && p > 0);

  return {
    name,
    dishCount: menuCategories.reduce((n, c) => n + c.dishes.length, 0),
    minPrice: prices.length ? Math.min(...prices) : null,
    maxPrice: prices.length ? Math.max(...prices) : null,
    sections: menuCategories
      .map((c) => tidyCase((c.name ?? '').trim()))
      .filter(Boolean),
  };
}
