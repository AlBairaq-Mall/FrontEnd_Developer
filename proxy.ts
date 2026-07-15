import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function proxy(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  const { pathname } = request.nextUrl;

  // Protect the /dashboard route and all its sub-routes
  if (pathname.startsWith('/dashboard')) {
    if (!authToken || userRole !== 'admin') {
      // Redirect to login if token is missing or user is not admin
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If user is already logged in as admin and tries to access /login or /register, redirect to /dashboard
  if (pathname === '/login' || pathname === '/register') {
    if (authToken && userRole === 'admin') {
      const dashboardUrl = new URL('/dashboard', request.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|media).*)'],
};

