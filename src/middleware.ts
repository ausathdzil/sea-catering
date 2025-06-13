import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './lib/auth';
import { headers } from 'next/headers';

const protectedRoutes = ['/dashboard'];
const publicRoutes = ['/sign-in', '/sign-up'];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const session = await getSession({
    headers: await headers(),
  });

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

  return NextResponse.next();
}

export const config = {
  runtime: 'nodejs',
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
