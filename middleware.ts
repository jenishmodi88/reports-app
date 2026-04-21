import { NextRequest, NextResponse } from 'next/server';

import { DEMO_USERS } from '@/lib/auth';

const PROTECTED_PATHS = ['/reports'];
const ADMIN_ONLY_PATHS = ['/admin'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PATHS.some((p) => pathname.startsWith(p));
  const isAdminOnly = ADMIN_ONLY_PATHS.some((p) => pathname.startsWith(p));

  if (!isProtected && !isAdminOnly) {
    return NextResponse.next();
  }

  // Check for auth token in cookie or header
  const token =
    request.cookies.get('auth-token')?.value ||
    request.headers.get('x-auth-token');

  if (!token || !DEMO_USERS[token]) {
    // Redirect to login with return URL
    const loginUrl = new URL('/', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    loginUrl.searchParams.set('reason', 'unauthenticated');
    return NextResponse.redirect(loginUrl);
  }

  const user = DEMO_USERS[token];

  // Admin-only enforcement
  if (isAdminOnly && user.role !== 'admin') {
    const url = new URL('/unauthorized', request.url);
    return NextResponse.redirect(url);
  }

  // Attach user info to headers for downstream use
  const response = NextResponse.next();
  response.headers.set('x-user-role', user.role);
  response.headers.set('x-user-name', user.name);
  return response;
}

export const config = {
  matcher: ['/reports/:path*', '/admin/:path*'],
};
