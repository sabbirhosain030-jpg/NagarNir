import { updateSession } from '@/lib/supabase/middleware';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip the login page itself
  if (pathname === '/admin/login') {
    const { supabaseResponse, user } = await updateSession(request);
    if (user) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    return supabaseResponse;
  }

  // Protect all /admin/* routes
  if (pathname.startsWith('/admin')) {
    const { supabaseResponse, user } = await updateSession(request);
    if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectTo', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return supabaseResponse;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
