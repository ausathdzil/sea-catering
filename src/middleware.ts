import { getCookieCache } from 'better-auth/cookies';
import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];
const adminRoutes = ['/dashboard/subscriptions', '/dashboard/users'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => path.startsWith(route));
  const isPublicRoute = publicRoutes.includes(path);

  const session = await getCookieCache(req);

  if (isProtectedRoute && !session?.user.id) {
    return NextResponse.redirect(new URL('/sign-in', req.nextUrl));
  }

  if (isAdminRoute && session?.user.role !== 'admin') {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  if (
    isPublicRoute &&
    session?.user.id &&
    !req.nextUrl.pathname.startsWith('/dashboard')
  ) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
