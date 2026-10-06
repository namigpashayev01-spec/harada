export const LANGS = ['az', 'en', 'ru', 'sr', 'nl', 'uz', 'fr', 'lv'] as const;

export type Lang = (typeof LANGS)[number];

/**
 * Every UI string in the site lives in the three dictionary files next to this
 * one. `az.ts` is the source of truth for which keys exist — `en.ts` and `ru.ts`
 * are typed against it, so forgetting a translation is a build error rather
 * than an Azerbaijani word leaking onto the English page.
 */
export type Dictionary = Record<string, string>;

export type TranslateVars = Record<string, string | number>;

/**
 * Replaces `{name}` placeholders. Missing keys fall back to the key itself so a
 * gap shows up as an obvious token instead of an empty element.
 */
export function interpolate(template: string, vars?: TranslateVars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    name in vars ? String(vars[name]) : match
  );
}
