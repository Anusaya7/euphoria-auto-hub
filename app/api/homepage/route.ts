import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { recordNotification } from '@/lib/adminEvents';
function containsUnsafe(value: unknown): boolean {
  if (typeof value === 'string') {
    const v = value.trim();
    if (!v) return false;
    if (/^(javascript|data):/i.test(v) || v.includes('../') || v.includes('..\\') || v.includes('\0')) return true;
    if (v.startsWith('/')) {
      if (/^\/(images|uploads)\/[A-Za-z0-9._-]+\.(jpg|jpeg|png|webp|mp4|webm)$/i.test(v)) return false;
      if (/^\/[A-Za-z0-9/_#?-]*$/.test(v)) return false;
      return true;
    }
    return false;
  }
  if (Array.isArray(value)) return value.some(containsUnsafe);
  if (value && typeof value === 'object') return Object.values(value as Record<string, unknown>).some(containsUnsafe);
  return false;
}

export async function GET() {
  try {
    const db = getDb();
    const sections = db.prepare('SELECT section, data FROM homepage_content').all() as { section: string; data: string }[];
    const result: Record<string, unknown> = {};
    sections.forEach((section) => {
      try { result[section.section] = JSON.parse(section.data); } catch { result[section.section] = {}; }
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('GET /api/homepage error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      return NextResponse.json({ error: 'Invalid homepage content.' }, { status: 400 });
    }
    if (containsUnsafe(body)) {
      return NextResponse.json({ error: 'A media link is not allowed.' }, { status: 400 });
    }

    const db = getDb();
    const updateSection = db.prepare('INSERT INTO homepage_content (section, data, updated_at) VALUES (@section, @data, CURRENT_TIMESTAMP) ON CONFLICT(section) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP');
    const save = db.transaction((entries: [string, unknown][]) => {
      for (const [section, data] of entries) {
        if (!/^[a-z0-9_]{1,40}$/.test(section)) continue;
        updateSection.run({ section, data: JSON.stringify(data) });
      }
    });
    save(Object.entries(body));
    recordNotification({ type: 'content', title: 'Homepage updated', message: 'Website content was updated.', relatedId: 'homepage' });

    return NextResponse.json({ success: true, message: 'Homepage updated successfully.' });
  } catch (error) {
    console.error('PUT /api/homepage error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
