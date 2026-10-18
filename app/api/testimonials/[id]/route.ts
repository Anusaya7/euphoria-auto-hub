import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const body = await req.json();
    const customer_name = String(body?.customer_name || '').trim().slice(0, 120);
    const review = String(body?.review || '').trim().slice(0, 2000);
    const rating = Math.min(5, Math.max(1, Number(body?.rating) || 5));
    if (!customer_name || !review) return NextResponse.json({ error: 'Name and review required' }, { status: 400 });
    const db = getDb();
    const current = db.prepare('SELECT show_on_home FROM testimonials WHERE id = ?').get(id) as { show_on_home?: number } | undefined;
    const showOnHome = body?.show_on_home === undefined ? (current?.show_on_home ?? 1) : (body.show_on_home ? 1 : 0);
    const result = db.prepare('UPDATE testimonials SET customer_name=?, review=?, rating=?, image=?, is_active=?, show_on_home=?, service_name=?, is_verified=?, display_order=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(
      customer_name, review, rating, body?.image || '', body?.is_active ? 1 : 0, showOnHome,
      String(body?.service_name || '').trim().slice(0, 80), body?.is_verified ? 1 : 0, Number(body?.display_order) || 0, id
    );
    if (result.changes === 0) return NextResponse.json({ error: 'Testimonial not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const db = getDb();
    db.prepare('DELETE FROM testimonials WHERE id = ?').run(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
