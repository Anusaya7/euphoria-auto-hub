import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import type { CountRow } from '@/lib/types';
import { getSessionFromRequest } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const db = getDb();
    const stats = {
      services: (db.prepare('SELECT COUNT(*) as c FROM services WHERE is_active = 1').get() as CountRow).c,
      gallery: (db.prepare('SELECT COUNT(*) as c FROM gallery_images').get() as CountRow).c,
      testimonials: (db.prepare('SELECT COUNT(*) as c FROM testimonials').get() as CountRow).c,
      enquiries: (db.prepare('SELECT COUNT(*) as c FROM enquiries').get() as CountRow).c,
      new_enquiries: (db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status = 'NEW'").get() as CountRow).c,
    };
    return NextResponse.json(stats);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
