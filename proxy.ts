import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // Protect the /dashboard route and all its sub-routes
  if (pathname.startsWith('/dashboard')) {
    if (!authToken) {
      // Redirect to login if token is missing
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is already logged in and tries to access /login or /register, redirect to /dashboard
  if (pathname === '/login' || pathname === '/register') {
    if (authToken) {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - media (public media files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|media).*)',
  ],
};

