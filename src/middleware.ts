import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get('r00t-r3b3lz-auth');
  const { pathname } = request.nextUrl;

  // If user is trying to access admin page and is not authenticated, redirect to login
  if (pathname.startsWith('/admin-page')) {
    if (cookie?.value !== 'true') {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is authenticated and tries to access login page, redirect to admin dashboard
  if (pathname === '/login' && cookie?.value === 'true') {
    const adminUrl = new URL('/admin-page', request.url);
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin-page/:path*', '/login'],
}
