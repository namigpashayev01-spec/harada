import { az } from './dictionaries/az';
import { en } from './dictionaries/en';
import { ru } from './dictionaries/ru';
import { sr } from './dictionaries/sr';
import { nl } from './dictionaries/nl';
import { uz } from './dictionaries/uz';
import { fr } from './dictionaries/fr';
import { lv } from './dictionaries/lv';
import { LANGS, interpolate } from './types';
import type { Dictionary, Lang, TranslateVars } from './types';
import type { TranslationKey } from './dictionaries/az';

export type { Dictionary, Lang, TranslateVars, TranslationKey };
export { LANGS, interpolate };

const DICTIONARIES: Record<Lang, Dictionary> = { az, en, ru, sr, nl, uz, fr, lv };

export const DEFAULT_LANG: Lang = 'az';

export function isLang(value: unknown): value is Lang {
  return typeof value === 'string' && (LANGS as readonly string[]).includes(value);
}

export function normalizeLang(value: unknown): Lang {
  return isLang(value) ? value : DEFAULT_LANG;
}

/**
 * The full dictionary for one language. Server components and layouts use this;
 * the [lang] layout also hands the result to the client provider so client
 * components get their strings on the very first render (no fetch, no flash).
 */
export function getDictionary(lang: string): Dictionary {
  return DICTIONARIES[normalizeLang(lang)];
}

/**
 * Translate a single key. For server components — client components should call
 * `useT()` from the translate context instead, so only the active language's
 * strings are shipped to the browser.
 *
 * Falls back to English, then Azerbaijani, then to the key itself, so a page never renders an
 * empty label.
 */
export function t(
  lang: string,
  key: TranslationKey | (string & {}),
  vars?: TranslateVars
): string {
  const dict = getDictionary(lang);
  return interpolate(dict[key] ?? (en as Dictionary)[key] ?? (az as Dictionary)[key] ?? key, vars);
}

/**
 * Curried form for server components that translate many keys in one render:
 * `const tr = getT(lang); tr('nav.home')`
 */
export function getT(lang: string) {
  const dict = getDictionary(lang);
  return (key: TranslationKey | (string & {}), vars?: TranslateVars): string =>
    interpolate(dict[key] ?? (en as Dictionary)[key] ?? (az as Dictionary)[key] ?? key, vars);
}
