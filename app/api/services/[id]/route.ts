import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { recordNotification } from '@/lib/adminEvents';
import { isStoredImage } from '@/lib/links';
import { cleanSlug, cleanText, isUniqueConstraint } from '@/lib/validate';

const PUBLIC_FIELDS = 'id, name, slug, short_description, full_description, image, icon, display_order, is_featured';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req);
    const { id } = await params;
    if (!/^\d+$/.test(id)) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    const db = getDb();
    const service = session
      ? db.prepare('SELECT * FROM services WHERE id = ?').get(id)
      : db.prepare(`SELECT ${PUBLIC_FIELDS} FROM services WHERE id = ? AND is_active = 1`).get(id);
    if (!service) return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    return NextResponse.json(service);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    if (!/^\d+$/.test(id)) return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
    const body = await req.json().catch(() => null);
    const name = cleanText(body?.name, 120);
    const slug = cleanSlug(body?.slug);
    const image = cleanText(body?.image, 300);
    if (!name || !slug) return NextResponse.json({ error: 'Name and a valid slug are required.' }, { status: 400 });
    if (image && !isStoredImage(image)) return NextResponse.json({ error: 'Service image must be a studio image path.' }, { status: 400 });
    const db = getDb();
    const result = db.prepare('UPDATE services SET name=?, slug=?, short_description=?, full_description=?, image=?, icon=?, display_order=?, is_active=?, is_featured=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(
      name,
      slug,
      cleanText(body?.short_description, 400),
      cleanText(body?.full_description, 4000),
      image,
      cleanText(body?.icon, 40),
      Number(body?.display_order) || 0,
      body?.is_active ? 1 : 0,
      body?.is_featured ? 1 : 0,
      id
    );
    if (result.changes === 0) return NextResponse.json({ error: 'Service not found.' }, { status: 404 });
    recordNotification({ type: 'service', title: 'Service updated', message: `${name} was updated.`, relatedId: id });
    return NextResponse.json({ success: true, message: 'Service updated successfully.' });
  } catch (error) {
    if (isUniqueConstraint(error)) {
      return NextResponse.json({ error: 'A service with this slug already exists.' }, { status: 409 });
    }
    console.error('PUT /api/services error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const db = getDb();
    db.prepare('DELETE FROM services WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Service deleted successfully.' });
  } catch (error) {
    console.error('DELETE /api/services error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
