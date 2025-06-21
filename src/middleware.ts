import { NextRequest, NextResponse } from 'next/server';

import { getSession } from './lib/auth';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/sign-in', '/sign-up'];
const adminRoutes = ['/dashboard/users', '/dashboard/subscriptions'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);
  const isAdminRoute = adminRoutes.includes(path);

  const session = await getSession();

  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
  }

  if (
    isPublicRoute &&
    session &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  if (isAdminRoute && session && session.user.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
