import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const session = await getSessionFromRequest(req);
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url));
    }
  }

  if (pathname.startsWith('/services/')) {
    const slug = decodeURIComponent(pathname.slice('/services/'.length)).replace(/\/$/, '');
    if (slug && !slug.includes('/')) {
      const active = getDb().prepare('SELECT 1 AS ok FROM services WHERE slug = ? AND is_active = 1').get(slug);
      if (!active) {
        return NextResponse.rewrite(new URL('/missing-service', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/services/:path*'],
};
