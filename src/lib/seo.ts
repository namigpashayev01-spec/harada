import type { Metadata } from 'next';

export const SITE_URL = 'https://harada-oturaq.az';

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
  return {
    canonical: `/${lang}${subpath}`,
    languages: {
      'az-AZ': `/az${subpath}`,
      'en-US': `/en${subpath}`,
      'ru-RU': `/ru${subpath}`,
    },
  };
}
