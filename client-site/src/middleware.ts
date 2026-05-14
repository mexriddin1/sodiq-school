import { NextRequest, NextResponse } from 'next/server';
import { LOCALES, DEFAULT_LOCALE } from '@/i18n/config';

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/uploads') ||
    pathname === '/favicon.ico' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];
  if (LOCALES.includes(first as any)) return;

  // Detect preferred locale from cookie or Accept-Language
  const cookieLocale = req.cookies.get('NEXT_LOCALE')?.value;
  let target: string = DEFAULT_LOCALE;
  if (cookieLocale && LOCALES.includes(cookieLocale as any)) {
    target = cookieLocale;
  } else {
    const accept = req.headers.get('accept-language') || '';
    for (const lang of accept.split(',')) {
      const code = lang.split(';')[0].trim().toLowerCase().slice(0, 2);
      if (LOCALES.includes(code as any)) { target = code; break; }
    }
  }

  const url = req.nextUrl.clone();
  url.pathname = `/${target}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|uploads|.*\\..*).*)'],
};
