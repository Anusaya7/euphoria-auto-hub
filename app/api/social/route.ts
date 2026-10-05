import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { recordNotification } from '@/lib/adminEvents';
import { cleanText, isHttpsUrl } from '@/lib/validate';

const PLATFORMS = ['instagram', 'youtube', 'facebook'] as const;

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    const db = getDb();
    const rows = db.prepare('SELECT id, platform, display_name, url, enabled, display_order FROM social_links ORDER BY display_order ASC, id ASC').all() as {
      id: number; platform: string; display_name: string; url: string; enabled: number; display_order: number;
    }[];
    const links = session ? rows : rows.filter((row) => row.enabled && row.url);
    return NextResponse.json(links);
  } catch (error) {
    console.error('GET /api/social error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const body = await req.json().catch(() => null);
    const links = Array.isArray(body?.links) ? body.links : null;
    if (!links) return NextResponse.json({ error: 'Invalid social links.' }, { status: 400 });

    const db = getDb();
    const update = db.prepare('UPDATE social_links SET display_name = ?, url = ?, enabled = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP WHERE platform = ?');
    for (const link of links) {
      const platform = cleanText(link?.platform, 40).toLowerCase();
      if (!PLATFORMS.includes(platform as typeof PLATFORMS[number])) continue;
      const url = cleanText(link?.url, 300);
      if (url && !isHttpsUrl(url)) {
        return NextResponse.json({ error: `${platform} must be a valid http or https URL.` }, { status: 400 });
      }
      update.run(cleanText(link?.display_name, 80) || platform, url, link?.enabled ? 1 : 0, Number(link?.display_order) || 0, platform);
    }
    recordNotification({ type: 'social', title: 'Social links updated', message: 'Instagram, YouTube and other social links were saved.' });
    return NextResponse.json({ success: true, message: 'Social links updated successfully.' });
  } catch (error) {
    console.error('PUT /api/social error:', error);
    return NextResponse.json({ error: 'Unable to save changes. Please try again.' }, { status: 500 });
  }
}
