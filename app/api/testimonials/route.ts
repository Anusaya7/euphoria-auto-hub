import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { recordNotification } from '@/lib/adminEvents';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    const db = getDb();
    const testimonials = session
      ? db.prepare('SELECT id, customer_name, review, rating, image, is_active, show_on_home, service_name, is_verified, display_order, created_at FROM testimonials ORDER BY display_order ASC, id DESC').all()
      : db.prepare('SELECT id, customer_name, review, rating FROM testimonials WHERE is_active = 1 AND is_verified = 1 ORDER BY id DESC').all();
    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('GET /api/testimonials error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json();
    const customer_name = String(body?.customer_name || '').trim().slice(0, 120);
    const review = String(body?.review || '').trim().slice(0, 2000);
    const rating = Math.min(5, Math.max(1, Number(body?.rating) || 5));
    if (!customer_name || !review) return NextResponse.json({ error: 'Name and review required' }, { status: 400 });
    const db = getDb();
    const result = db.prepare('INSERT INTO testimonials (customer_name, review, rating, image, is_active, show_on_home, service_name, is_verified, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)').run(
      customer_name, review, rating, body?.image || '', body?.is_active ?? 1, body?.show_on_home === 0 ? 0 : 1,
      String(body?.service_name || '').trim().slice(0, 80), body?.is_verified ? 1 : 0, Number(body?.display_order) || 0,
    );
    recordNotification({ type: 'testimonial', title: 'New testimonial', message: `${customer_name} was added to testimonials.`, relatedId: Number(result.lastInsertRowid) });
    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch {
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
