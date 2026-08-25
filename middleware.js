import { NextResponse } from 'next/server';
import { verifyTokenEdge, COOKIE_NAME } from '@/lib/auth-edge';

// Guards every /admin route except the login page.
export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (pathname === '/admin/login') return NextResponse.next();

  const session = await verifyTokenEdge(request.cookies.get(COOKIE_NAME)?.value);
  if (session) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = '/admin/login';
  url.searchParams.set('next', pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/admin/:path*'],
};
