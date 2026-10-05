import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { isStoredImage } from '@/lib/links';
import { cleanText } from '@/lib/validate';
import { recordNotification } from '@/lib/adminEvents';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    const db = getDb();
    const images = session
      ? db.prepare('SELECT * FROM gallery_images ORDER BY display_order ASC, id ASC').all()
      : db.prepare('SELECT id, title, category, image_url, alt_text, display_order FROM gallery_images WHERE is_active = 1 ORDER BY display_order ASC, id ASC').all();
    return NextResponse.json(images);
  } catch (error) {
    console.error('GET /api/gallery error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json().catch(() => null);
    const image_url = cleanText(body?.image_url, 300);
    if (!isStoredImage(image_url)) return NextResponse.json({ error: 'Image must be JPG, PNG or WEBP.' }, { status: 400 });
    const title = cleanText(body?.title, 120);
    const db = getDb();
    const max = db.prepare('SELECT COALESCE(MAX(display_order), 0) as m FROM gallery_images').get() as { m: number };
    const result = db.prepare('INSERT INTO gallery_images (title, category, image_url, alt_text, display_order, is_active) VALUES (?, ?, ?, ?, ?, 1)').run(
      title,
      cleanText(body?.category, 40) || 'General',
      image_url,
      cleanText(body?.alt_text, 180) || title,
      Number(body?.display_order) || max.m + 1
    );
    recordNotification({ type: 'gallery', title: 'Gallery image uploaded', message: title ? `${title} was added to the gallery.` : 'A gallery image was uploaded.', relatedId: Number(result.lastInsertRowid) });
    return NextResponse.json({ success: true, id: result.lastInsertRowid, message: 'Gallery image uploaded successfully.' });
  } catch (error) {
    console.error('POST /api/gallery error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
