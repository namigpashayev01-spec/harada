import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RESTAURANT_SLUG_REDIRECTS } from '@/lib/slugRedirects';
import { ALL_LANGS, langsForPath } from '@/lib/locales';

// Every route language. Which of them a given page exists in is decided per
// country by langsForPath() — see src/lib/locales.ts.
const VALID_LANGUAGES: readonly string[] = ALL_LANGS;

/** Azerbaijani is the site's primary language — visitors land here by default. */
export const DEFAULT_LANGUAGE = 'az';

/**
 * Active middleware. With a `src/` directory Next.js loads `src/middleware.ts`
 * (the root-level middleware.ts is only imported as a constants module).
 *
 * Two jobs:
 *  1. Expose the current locale (derived from the URL) to the root layout via a
 *     request header, so that <html lang="…"> matches the page language.
 *  2. Send anything without a language prefix to the default language. Every
 *     real page lives under /[lang], so an unprefixed path like /places was
 *     simply a 404 before.
 *  3. Point retired restaurant URLs at their replacement. Duplicate records
 *     were merged and "-test" slugs renamed, so those addresses would now 404
 *     for both visitors and Google without a redirect.
 */
/** Restoran idarəetmə panelinin subdomeni. */
const MANAGER_HOST = 'manager.harada-oturaq.az';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host')?.split(':')[0] ?? '';

  // manager.harada-oturaq.az — ayrı panel kimi görünür, amma eyni tətbiqin
  // /[lang]/manager bölməsindən xidmət olunur. Ünvan çubuğunda /manager
  // görünmür, çünki yönləndirmə deyil, daxili rewrite edilir.
  if (host === MANAGER_HOST) {
    const lang =
      VALID_LANGUAGES.find(
        (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
      ) ?? DEFAULT_LANGUAGE;
    const rest = pathname.startsWith(`/${lang}`)
      ? pathname.slice(lang.length + 1)
      : pathname;

    const url = request.nextUrl.clone();
    url.pathname = `/${lang}/manager${rest === '/' ? '' : rest}`;

    const headers = new Headers(request.headers);
    headers.set('x-next-locale', lang);
    return NextResponse.rewrite(url, { request: { headers } });
  }

  // Panel yalnız öz subdomenindən açılsın — əsas domendə gizlədilir.
  if (pathname.includes('/manager')) {
    return new NextResponse(null, { status: 404 });
  }

  const lang = VALID_LANGUAGES.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );

  if (!lang) {
    const url = request.nextUrl.clone();
    // Foreign sections have no Azerbaijani version: /serbia/nis → /en/serbia/nis.
    const rest = pathname === '/' ? '' : pathname;
    const target = langsForPath(rest).includes(DEFAULT_LANGUAGE) ? DEFAULT_LANGUAGE : 'en';
    url.pathname = `/${target}${rest}`;
    // Permanent: the prefixed URL is the canonical one, so search engines
    // should consolidate on it rather than keep requesting the bare path.
    return NextResponse.redirect(url, 308);
  }

  // /{lang}/places/{slug}[/menu] — yalnız slug hissəsi əvəzlənir, sonrakı
  // alt-yol (məsələn /menu) və sorğu parametrləri olduğu kimi qalır.
  const parts = pathname.split('/');
  if (parts[2] === 'places' && parts[3]) {
    const target = RESTAURANT_SLUG_REDIRECTS[parts[3]];
    if (target && target !== parts[3]) {
      parts[3] = target;
      const url = request.nextUrl.clone();
      url.pathname = parts.join('/');
      return NextResponse.redirect(url, 301);
    }
  }

  // A page requested in a language it doesn't exist in → its English version.
  // /az/serbia/belgrade and /sr/places (Baku) were never real pages; 301 so
  // search engines move any signals over to the English URL.
  const rest = pathname.slice(lang.length + 1);
  if (!langsForPath(rest).includes(lang)) {
    const url = request.nextUrl.clone();
    url.pathname = `/en${rest}`;
    return NextResponse.redirect(url, 301);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-next-locale', lang);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
