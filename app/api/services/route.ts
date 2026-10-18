import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { isStoredImage } from '@/lib/links';
import { cleanSlug, cleanText, isUniqueConstraint } from '@/lib/validate';
import { recordNotification } from '@/lib/adminEvents';

const PUBLIC_FIELDS = 'id, name, slug, short_description, full_description, image, icon, display_order, is_featured';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    const db = getDb();
    const services = session
      ? db.prepare('SELECT * FROM services ORDER BY display_order ASC, id ASC').all()
      : db.prepare(`SELECT ${PUBLIC_FIELDS} FROM services WHERE is_active = 1 ORDER BY display_order ASC, id ASC`).all();
    return NextResponse.json(services);
  } catch (error) {
    console.error('GET /api/services error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => null);
    const name = cleanText(body?.name, 120);
    const slug = cleanSlug(body?.slug);
    const image = cleanText(body?.image, 300);
    if (!name || !slug) return NextResponse.json({ error: 'Name and a valid slug are required.' }, { status: 400 });
    if (image && !isStoredImage(image)) return NextResponse.json({ error: 'Service image must be a studio image path.' }, { status: 400 });

    const db = getDb();
    const result = db.prepare('INSERT INTO services (name, slug, short_description, full_description, image, icon, display_order, is_active, is_featured, duration, price, show_price, benefits) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
      name,
      slug,
      cleanText(body?.short_description, 400),
      cleanText(body?.full_description, 4000),
      image,
      cleanText(body?.icon, 40),
      Number(body?.display_order) || 0,
      body?.is_active ? 1 : 0,
      body?.is_featured ? 1 : 0,
      cleanText(body?.duration, 80),
      cleanText(body?.price, 40),
      body?.show_price ? 1 : 0,
      cleanText(body?.benefits, 1000),
    );

    recordNotification({ type: 'service', title: 'Service added', message: `${name} was added.`, relatedId: Number(result.lastInsertRowid) });
    return NextResponse.json({ success: true, id: result.lastInsertRowid, message: 'Service created successfully.' });
  } catch (error) {
    if (isUniqueConstraint(error)) {
      return NextResponse.json({ error: 'A service with this slug already exists.' }, { status: 409 });
    }
    console.error('POST /api/services error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
