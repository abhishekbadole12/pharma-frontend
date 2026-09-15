import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = ['/', '/login', '/signup', '/forgot-password', '/reset-password', '/about', '/contact'];
const adminPaths = ['/admin'];
const clientPaths = ['/shop', '/cart', '/checkout', '/orders', '/wishlist', '/account', '/product'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('access_token');

  const isPublic = publicPaths.some(p => pathname === p || pathname.startsWith(p + '/'));
  const isAdmin = adminPaths.some(p => pathname.startsWith(p));
  const isClient = clientPaths.some(p => pathname.startsWith(p));
  const isAuth = pathname.startsWith('/login') || pathname.startsWith('/signup');

  if ((isAdmin || isClient) && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads).*)'],
};
