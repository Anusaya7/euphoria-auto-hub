import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { isStoredImage } from '@/lib/links';
import { cleanText } from '@/lib/validate';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const db = getDb();
    const image = db.prepare('SELECT * FROM gallery_images WHERE id = ?').get(id);
    if (!image) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(image);
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const image_url = cleanText(body?.image_url, 300);
    if (!isStoredImage(image_url)) return NextResponse.json({ error: 'Image must be JPG, PNG or WEBP.' }, { status: 400 });
    const db = getDb();
    const current = db.prepare('SELECT show_on_home FROM gallery_images WHERE id = ?').get(id) as { show_on_home?: number } | undefined;
    const showOnHome = body?.show_on_home === undefined ? (current?.show_on_home ?? 1) : (body.show_on_home ? 1 : 0);
    const result = db.prepare('UPDATE gallery_images SET title=?, category=?, image_url=?, alt_text=?, display_order=?, is_active=?, show_on_home=? WHERE id=?').run(
      cleanText(body?.title, 120),
      cleanText(body?.category, 40) || 'General',
      image_url,
      cleanText(body?.alt_text, 180),
      Number(body?.display_order) || 0,
      body?.is_active ? 1 : 0,
      showOnHome,
      id
    );
    if (result.changes === 0) return NextResponse.json({ error: 'Gallery image not found.' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Gallery image updated successfully.' });
  } catch (error) {
    console.error('PUT /api/gallery error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const db = getDb();
    db.prepare('DELETE FROM gallery_images WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
