import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { recordNotification } from '@/lib/adminEvents';
import { cleanText } from '@/lib/validate';
import { clientKey, rateLimit } from '@/lib/rateLimit';

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const rows = getDb().prepare('SELECT * FROM leads ORDER BY datetime(created_at) DESC, id DESC LIMIT 200').all();
  return NextResponse.json(rows);
}

const LEAD_STATUSES = ['Pending', 'Contacted', 'Converted', 'Closed'];

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const id = Number(body?.id);
  const status = cleanText(body?.status, 40);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: 'Invalid lead.' }, { status: 400 });
  if (!LEAD_STATUSES.includes(status)) return NextResponse.json({ error: 'Choose a valid status.' }, { status: 400 });
  const result = getDb().prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, id);
  if (!result.changes) return NextResponse.json({ error: 'Lead not found.' }, { status: 404 });
  return NextResponse.json({ success: true, status });
}

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`lead:${clientKey(req)}`, 6, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Please wait a few minutes before sending another enquiry.' }, { status: 429 });
    }
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    const name = cleanText(body.name, 80);
    const phone = cleanText(body.phone, 20);
    const email = cleanText(body.email, 160);
    const digits = phone.replace(/\D/g, '');
    if (!name) return NextResponse.json({ error: 'Enter your name.' }, { status: 400 });
    if (digits.length < 10 || digits.length > 15) return NextResponse.json({ error: 'Enter a valid mobile number.' }, { status: 400 });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });

    const service = cleanText(body.service, 120);
    const message = [
      cleanText(body.vehicle, 80) && `Vehicle: ${cleanText(body.vehicle, 80)}`,
      cleanText(body.date, 20) && `Preferred date: ${cleanText(body.date, 20)}`,
      cleanText(body.time, 20) && `Preferred time: ${cleanText(body.time, 20)}`,
      cleanText(body.message, 500),
    ].filter(Boolean).join('\n');

    const result = getDb().prepare(
      'INSERT INTO leads (name, phone, email, service, source, message, status, vehicle, preferred_date, preferred_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    ).run(name, phone, email, service, 'chatbot', message, 'Pending', cleanText(body.vehicle, 80), cleanText(body.date, 20), cleanText(body.time, 20));

    recordNotification({
      type: 'lead',
      title: 'Chat enquiry',
      message: `${name} asked about ${service || 'a service'}.`,
      relatedId: Number(result.lastInsertRowid),
    });

    return NextResponse.json({ success: true, message: 'Enquiry sent. The studio will reply.' });
  } catch (error) {
    console.error('POST /api/leads error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again or contact us on WhatsApp.' }, { status: 500 });
  }
}
