import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getSessionFromRequest } from '@/lib/auth';
import { cleanText } from '@/lib/validate';
import { isSafeUrl } from '@/lib/links';

function row(body: Record<string, unknown>) {
  const name = cleanText(body.name, 80);
  if (!name) return { error: 'Package name is required.' };
  const link = cleanText(body.cta_link, 200) || '/contact';
  if (!isSafeUrl(link)) return { error: 'Please enter a valid URL.' };
  return {
    name,
    short_description: cleanText(body.short_description, 400),
    included: cleanText(body.included, 800),
    benefits: cleanText(body.benefits, 800),
    price: cleanText(body.price, 40),
    show_price: body.show_price ? 1 : 0,
    cta: cleanText(body.cta, 60) || 'Get a quote',
    cta_link: link,
    is_featured: body.is_featured ? 1 : 0,
    display_order: Number(body.display_order) || 0,
    is_active: body.is_active === 0 || body.is_active === false ? 0 : 1,
  };
}

export async function GET(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  const sql = session
    ? 'SELECT * FROM packages ORDER BY display_order ASC, id ASC'
    : 'SELECT * FROM packages WHERE is_active = 1 ORDER BY display_order ASC, id ASC';
  return NextResponse.json(getDb().prepare(sql).all());
}

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = row(body || {});
  if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const result = getDb().prepare(`INSERT INTO packages (name, short_description, included, benefits, price, show_price, cta, cta_link, is_featured, display_order, is_active)
    VALUES (@name, @short_description, @included, @benefits, @price, @show_price, @cta, @cta_link, @is_featured, @display_order, @is_active)`).run(parsed);
  return NextResponse.json({ success: true, id: result.lastInsertRowid, message: 'Changes saved successfully.' });
}

export async function PUT(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await req.json().catch(() => null);
  const id = Number(body?.id);
  const parsed = row(body || {});
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: 'Package not found.' }, { status: 404 });
  if ('error' in parsed) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const result = getDb().prepare(`UPDATE packages SET name=@name, short_description=@short_description, included=@included, benefits=@benefits, price=@price, show_price=@show_price, cta=@cta, cta_link=@cta_link, is_featured=@is_featured, display_order=@display_order, is_active=@is_active WHERE id=@id`).run({ ...parsed, id });
  if (!result.changes) return NextResponse.json({ error: 'Package not found.' }, { status: 404 });
  return NextResponse.json({ success: true, message: 'Changes saved successfully.' });
}

export async function DELETE(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const id = Number(req.nextUrl.searchParams.get('id'));
  if (!Number.isInteger(id) || id < 1) return NextResponse.json({ error: 'Package not found.' }, { status: 404 });
  getDb().prepare('DELETE FROM packages WHERE id = ?').run(id);
  return NextResponse.json({ success: true, message: 'Package deleted.' });
}
