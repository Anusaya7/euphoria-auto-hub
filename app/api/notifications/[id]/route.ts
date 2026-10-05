import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const db = getDb();
    const result = db.prepare('UPDATE admin_notifications SET is_read = 1 WHERE id = ?').run(id);
    if (result.changes === 0) return NextResponse.json({ error: 'Notification not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PUT /api/notifications/[id] error:', error);
    return NextResponse.json({ error: 'Unable to update notification.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const db = getDb();
    db.prepare('DELETE FROM admin_notifications WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Notification deleted.' });
  } catch (error) {
    console.error('DELETE /api/notifications/[id] error:', error);
    return NextResponse.json({ error: 'Unable to delete notification.' }, { status: 500 });
  }
}
