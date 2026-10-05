import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { cleanText } from '@/lib/validate';

export async function GET() {
  try {
    const db = getDb();
    const contact = db.prepare('SELECT * FROM contact_settings LIMIT 1').get();
    return NextResponse.json(contact || {});
  } catch {
    return NextResponse.json({ error: 'Failed to fetch contact' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json().catch(() => null);
    const phone = cleanText(body?.phone, 40);
    const email = cleanText(body?.email, 160);
    const whatsapp = cleanText(body?.whatsapp, 20);
    const address = cleanText(body?.address, 300);
    const maps_url = cleanText(body?.maps_url, 300);
    const hours = cleanText(body?.hours, 120);
    if (!phone || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'A valid phone number and email are required.' }, { status: 400 });
    }
    if (maps_url && !/^https:\/\/[^\s]+$/i.test(maps_url)) {
      return NextResponse.json({ error: 'Maps link must be an https URL.' }, { status: 400 });
    }
    const db = getDb();
    const existing = db.prepare('SELECT id FROM contact_settings LIMIT 1').get() as { id: number } | undefined;
    if (existing) {
      db.prepare('UPDATE contact_settings SET phone=?, email=?, whatsapp=?, address=?, maps_url=?, hours=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(
        phone, email, whatsapp, address, maps_url, hours, existing.id
      );
    } else {
      db.prepare('INSERT INTO contact_settings (phone, email, whatsapp, address, maps_url, hours) VALUES (?, ?, ?, ?, ?, ?)').run(
        phone, email, whatsapp, address, maps_url, hours
      );
    }
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to update contact' }, { status: 500 });
  }
}
