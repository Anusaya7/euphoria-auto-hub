import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { ENQUIRY_STATUSES } from '@/lib/validate';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const body = await req.json().catch(() => null);
    const status = body?.status;
    const db = getDb();
    if (body?.is_read === true && !status) {
      const read = db.prepare('UPDATE enquiries SET is_read = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(id);
      if (read.changes === 0) return NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
      return NextResponse.json({ success: true, message: 'Enquiry marked as read.' });
    }
    if (typeof status !== 'string' || !(ENQUIRY_STATUSES as readonly string[]).includes(status)) {
      return NextResponse.json({ error: 'Choose a valid enquiry status.' }, { status: 400 });
    }
    const result = db.prepare('UPDATE enquiries SET status = ?, is_read = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(status, id);
    if (result.changes === 0) return NextResponse.json({ error: 'Enquiry not found.' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Enquiry updated successfully.' });
  } catch (error) {
    console.error('PUT /api/enquiries error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { id } = await params;
    const db = getDb();
    db.prepare('DELETE FROM enquiries WHERE id = ?').run(id);
    return NextResponse.json({ success: true, message: 'Enquiry deleted successfully.' });
  } catch (error) {
    console.error('DELETE /api/enquiries error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
