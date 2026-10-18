import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { recordNotification } from '@/lib/adminEvents';
import { TIME_SLOTS, VEHICLE_TYPES } from '@/lib/serviceCatalog';
import { cleanText } from '@/lib/validate';
import { clientKey, rateLimit } from '@/lib/rateLimit';

const BOOKING_STATUSES = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

function code() {
  return `EH-${Date.now().toString(36).toUpperCase()}`;
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const rows = getDb().prepare('SELECT * FROM bookings ORDER BY datetime(created_at) DESC, id DESC LIMIT 200').all();
  return NextResponse.json(rows);
}

export async function PATCH(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const id = Number(body?.id);
  const status = cleanText(body?.status, 40);
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: 'Invalid booking.' }, { status: 400 });
  if (!BOOKING_STATUSES.includes(status)) return NextResponse.json({ error: 'Choose a valid status.' }, { status: 400 });
  const result = getDb().prepare('UPDATE bookings SET status = ? WHERE id = ?').run(status, id);
  if (!result.changes) return NextResponse.json({ error: 'Booking not found.' }, { status: 404 });
  return NextResponse.json({ success: true, status });
}

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`booking:${clientKey(req)}`, 6, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Please wait a few minutes before sending another request.' }, { status: 429 });
    }
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object') return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
    const name = cleanText(body.name, 80);
    const phone = cleanText(body.phone, 20);
    const email = cleanText(body.email, 160);
    const service = cleanText(body.service, 120);
    const vehicle = cleanText(body.vehicle_type, 40);
    const date = cleanText(body.booking_date, 12);
    const time = cleanText(body.booking_time, 8);
    const digits = phone.replace(/\D/g, '');
    if (!name) return NextResponse.json({ error: 'Enter your name.' }, { status: 400 });
    if (digits.length < 10 || digits.length > 15) return NextResponse.json({ error: 'Enter a valid mobile number.' }, { status: 400 });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: 'Enter a valid email address.' }, { status: 400 });
    if (!service) return NextResponse.json({ error: 'Choose a service.' }, { status: 400 });
    if (!VEHICLE_TYPES.includes(vehicle as typeof VEHICLE_TYPES[number])) return NextResponse.json({ error: 'Choose a vehicle type.' }, { status: 400 });
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < new Date().toISOString().slice(0, 10)) {
      return NextResponse.json({ error: 'Choose a valid date.' }, { status: 400 });
    }
    if (!TIME_SLOTS.includes(time)) return NextResponse.json({ error: 'Choose a preferred time.' }, { status: 400 });

    const bookingCode = code();
    const db = getDb();
    const result = db.prepare(`INSERT INTO bookings (booking_code, service_name, vehicle_type, booking_date, booking_time, name, phone, email, vehicle_make, vehicle_model, registration_number, notes, status, source)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'website')`).run(
      bookingCode,
      service,
      vehicle,
      date,
      time,
      name,
      phone,
      email,
      cleanText(body.vehicle_make, 60),
      cleanText(body.vehicle_model, 60),
      cleanText(body.registration_number, 20),
      cleanText(body.notes, 500),
    );
    recordNotification({
      type: 'booking',
      title: 'New booking request',
      message: `${name} requested ${service} on ${date} at ${time}.`,
      relatedId: Number(result.lastInsertRowid),
    });
    return NextResponse.json({
      success: true,
      booking_code: bookingCode,
      status: 'Pending',
      message: 'Booking request submitted. The studio will confirm the time with you.',
    });
  } catch (error) {
    console.error('POST /api/booking error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again or contact us on WhatsApp.' }, { status: 500 });
  }
}
