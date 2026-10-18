import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { cleanText } from '@/lib/validate';

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  const sql = session
    ? 'SELECT * FROM faqs ORDER BY display_order ASC, id ASC'
    : 'SELECT id, question, answer, category, display_order FROM faqs WHERE is_active = 1 ORDER BY display_order ASC, id ASC';
  return NextResponse.json(getDb().prepare(sql).all());
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const question = cleanText(body?.question, 200);
  const answer = cleanText(body?.answer, 1200);
  if (!question || !answer) return NextResponse.json({ error: 'Question and answer are required.' }, { status: 400 });
  const result = getDb().prepare('INSERT INTO faqs (question, answer, category, display_order, is_active) VALUES (?, ?, ?, ?, ?)').run(
    question, answer, cleanText(body?.category, 40) || 'General', Number(body?.display_order) || 0, body?.is_active === 0 ? 0 : 1,
  );
  return NextResponse.json({ success: true, id: result.lastInsertRowid, message: 'Changes saved successfully.' });
}

export async function PUT(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const id = Number(body?.id);
  const question = cleanText(body?.question, 200);
  const answer = cleanText(body?.answer, 1200);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: 'FAQ not found.' }, { status: 404 });
  if (!question || !answer) return NextResponse.json({ error: 'Question and answer are required.' }, { status: 400 });
  const result = getDb().prepare('UPDATE faqs SET question=?, answer=?, category=?, display_order=?, is_active=? WHERE id=?').run(
    question, answer, cleanText(body?.category, 40) || 'General', Number(body?.display_order) || 0, body?.is_active === 0 ? 0 : 1, id,
  );
  if (!result.changes) return NextResponse.json({ error: 'FAQ not found.' }, { status: 404 });
  return NextResponse.json({ success: true, message: 'Changes saved successfully.' });
}

export async function DELETE(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(req.nextUrl.searchParams.get('id'));
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: 'FAQ not found.' }, { status: 404 });
  getDb().prepare('DELETE FROM faqs WHERE id = ?').run(id);
  return NextResponse.json({ success: true });
}
