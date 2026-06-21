import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Keep this list in sync with the one in the root middleware.ts (used by layouts).
const VALID_LANGUAGES = ['en', 'az', 'ru'];

/**
 * Active middleware. With a `src/` directory Next.js loads `src/middleware.ts`
 * (the root-level middleware.ts is only imported as a constants module).
 *
 * Its sole job here is to expose the current locale (derived from the URL) to
 * the root layout via a request header, so that <html lang="…"> matches the
 * page language. It intentionally does NOT redirect — language routing stays
 * handled by src/app/page.tsx and the [lang] segment.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lang = VALID_LANGUAGES.find(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (!lang) return NextResponse.next();

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-next-locale', lang);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
