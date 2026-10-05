import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { isStoredImage } from '@/lib/links';
import { cleanText } from '@/lib/validate';

export async function GET() {
  try {
    const db = getDb();
    const seo = db.prepare('SELECT * FROM seo_settings WHERE page = ?').get('home');
    return NextResponse.json(seo || {});
  } catch {
    return NextResponse.json({ error: 'Failed to fetch SEO' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json().catch(() => null);
    const page = cleanText(body?.page, 40) || 'home';
    const title = cleanText(body?.title, 160);
    const description = cleanText(body?.description, 320);
    const keywords = cleanText(body?.keywords, 300);
    const og_image = cleanText(body?.og_image, 300);
    const canonical_url = cleanText(body?.canonical_url, 300);
    if (!/^[a-z0-9_-]{1,40}$/.test(page)) return NextResponse.json({ error: 'Invalid SEO page.' }, { status: 400 });
    if (og_image && !isStoredImage(og_image)) return NextResponse.json({ error: 'Open Graph image must be JPG, PNG or WEBP.' }, { status: 400 });
    if (canonical_url && !/^https:\/\/[^\s]+$/i.test(canonical_url)) return NextResponse.json({ error: 'Canonical URL must be an https URL.' }, { status: 400 });
    const db = getDb();
    db.prepare('INSERT INTO seo_settings (page, title, description, keywords, og_image, canonical_url) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(page) DO UPDATE SET title=excluded.title, description=excluded.description, keywords=excluded.keywords, og_image=excluded.og_image, canonical_url=excluded.canonical_url, updated_at=CURRENT_TIMESTAMP').run(
      page, title, description, keywords, og_image, canonical_url
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update SEO' }, { status: 500 });
  }
}
