import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const db = getDb();
    const unreadOnly = req.nextUrl.searchParams.get('unread') === '1';
    const rows = db.prepare(`SELECT id, type, title, message, is_read, related_id, created_at FROM admin_notifications ${unreadOnly ? 'WHERE is_read = 0' : ''} ORDER BY datetime(created_at) DESC, id DESC LIMIT 100`).all();
    const unread = (db.prepare('SELECT COUNT(*) AS c FROM admin_notifications WHERE is_read = 0').get() as { c: number }).c;
    return NextResponse.json({ unread, notifications: rows });
  } catch (error) {
    console.error('GET /api/notifications error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const db = getDb();
    db.prepare('UPDATE admin_notifications SET is_read = 1 WHERE is_read = 0').run();
    return NextResponse.json({ success: true, message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('PUT /api/notifications error:', error);
    return NextResponse.json({ error: 'Unable to update notifications.' }, { status: 500 });
  }
}
