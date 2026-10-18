import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { isStoredImage } from '@/lib/links';
import { cleanText } from '@/lib/validate';

const CATEGORIES = ['Detailing', 'Paint Correction', 'Ceramic Coating', 'PPF', 'Interior', 'Polishing'];

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  const sql = session
    ? 'SELECT * FROM before_after ORDER BY display_order ASC, id ASC'
    : 'SELECT * FROM before_after WHERE is_active = 1 ORDER BY display_order ASC, id ASC';
  return NextResponse.json(getDb().prepare(sql).all());
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const before = cleanText(body?.before_image, 300);
  const after = cleanText(body?.after_image, 300);
  if (!isStoredImage(before) || !isStoredImage(after)) return NextResponse.json({ error: 'Invalid image format.' }, { status: 400 });
  const category = CATEGORIES.includes(body?.category) ? body.category : 'Detailing';
  const result = getDb().prepare('INSERT INTO before_after (title, description, category, before_image, after_image, display_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
    cleanText(body?.title, 120), cleanText(body?.description, 500), category, before, after, Number(body?.display_order) || 0, body?.is_active === 0 ? 0 : 1,
  );
  return NextResponse.json({ success: true, id: result.lastInsertRowid, message: 'Changes saved successfully.' });
}

export async function PUT(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const id = Number(body?.id);
  const before = cleanText(body?.before_image, 300);
  const after = cleanText(body?.after_image, 300);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
  if (!isStoredImage(before) || !isStoredImage(after)) return NextResponse.json({ error: 'Invalid image format.' }, { status: 400 });
  const category = CATEGORIES.includes(body?.category) ? body.category : 'Detailing';
  const result = getDb().prepare('UPDATE before_after SET title=?, description=?, category=?, before_image=?, after_image=?, display_order=?, is_active=? WHERE id=?').run(
    cleanText(body?.title, 120), cleanText(body?.description, 500), category, before, after, Number(body?.display_order) || 0, body?.is_active === 0 ? 0 : 1, id,
  );
  if (!result.changes) return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
  return NextResponse.json({ success: true, message: 'Changes saved successfully.' });
}

export async function DELETE(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(req.nextUrl.searchParams.get('id'));
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: 'Item not found.' }, { status: 404 });
  getDb().prepare('DELETE FROM before_after WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
