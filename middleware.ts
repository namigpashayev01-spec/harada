import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const VALID_LANGUAGES = ['en', 'az', 'ru'];
export type ValidLanguage = (typeof VALID_LANGUAGES)[number];
const DEFAULT_LANGUAGE = 'az';

function getPreferredLanguage(request: NextRequest): string {
  const cookieLanguage = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLanguage && VALID_LANGUAGES.includes(cookieLanguage)) {
    return cookieLanguage;
  }

  const acceptLanguage = request.headers.get('accept-language');
  console.log(acceptLanguage)
  if (acceptLanguage) {
    const preferredLanguage = acceptLanguage
      .split(',')
      .map((lang) => lang.split(';')[0].trim().toLowerCase())
      .find((lang) => VALID_LANGUAGES.includes(lang.substring(0, 2)));

    if (preferredLanguage) {
      return preferredLanguage.substring(0, 2);
    }
  }

  return DEFAULT_LANGUAGE;
}

function isAssetPath(pathname: string): boolean {
  return (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname.startsWith('/favicon')
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAssetPath(pathname)) return NextResponse.next();

  const pathnameHasValidLanguage = VALID_LANGUAGES.some(
    (lang) => pathname.startsWith(`/${lang}/`) || pathname === `/${lang}`
  );

  if (pathnameHasValidLanguage) {
    return NextResponse.next();
  }

  const language = getPreferredLanguage(request);

  const newUrl = new URL(
    `/${language}${pathname === '/' ? '' : pathname}`,
    request.url
  );

  const searchParams = request.nextUrl.searchParams;
  searchParams.forEach((value, key) => {
    newUrl.searchParams.set(key, value);
  });

  return NextResponse.redirect(newUrl);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)'],
};
