import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { validateEnquiry } from '@/lib/validate';
import { notifyNewEnquiry } from '@/lib/notify';
import { recordNotification } from '@/lib/adminEvents';
import { clientKey, rateLimit } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const db = getDb();
    const enquiries = db.prepare('SELECT id, first_name, last_name, email, mobile, message, status, is_read, created_at FROM enquiries ORDER BY datetime(created_at) DESC, id DESC').all();
    return NextResponse.json(enquiries);
  } catch (error) {
    console.error('GET /api/enquiries error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`enquiry:${clientKey(req)}`, 8, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Please wait a few minutes before sending another enquiry.' }, { status: 429 });
    }
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    }
    const parsed = validateEnquiry(body as Record<string, unknown>);
    if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });

    const db = getDb();
    const result = db.prepare(
      'INSERT INTO enquiries (first_name, last_name, email, mobile, message, status) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(parsed.first_name, parsed.last_name, parsed.email, parsed.mobile, parsed.message, 'NEW');

    recordNotification({
      type: 'enquiry',
      title: 'New customer enquiry',
      message: `${parsed.first_name} sent a message from the contact form.`,
      relatedId: Number(result.lastInsertRowid),
    });

    try {
      await notifyNewEnquiry(parsed);
    } catch (error) {
      console.error('Enquiry email was not sent:', error instanceof Error ? error.message : 'send failed');
    }

    return NextResponse.json({ success: true, id: result.lastInsertRowid, message: 'Enquiry submitted successfully.' });
  } catch (error) {
    console.error('POST /api/enquiries error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
