import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { getSessionFromRequest, signToken, setSessionCookie } from '@/lib/auth';

export async function PUT(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => null);
    const name = String(body?.name || '').trim();
    const currentPassword = String(body?.current_password || '');
    const newPassword = String(body?.new_password || '');

    if (!name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 });

    const db = getDb();
    const user = db.prepare('SELECT id, email, password_hash, token_version FROM admin_users WHERE id = ?').get(session.id) as { id: number; email: string; password_hash: string; token_version: number } | undefined;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let tokenVersion = Number(user.token_version || 0);
    if (newPassword) {
      if (!currentPassword || !bcrypt.compareSync(currentPassword, user.password_hash)) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
      }
      if (newPassword.length < 8) {
        return NextResponse.json({ error: 'New password must be at least 8 characters.' }, { status: 400 });
      }
      tokenVersion += 1;
      db.prepare('UPDATE admin_users SET name = ?, password_hash = ?, token_version = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(
        name, bcrypt.hashSync(newPassword, 12), tokenVersion, user.id
      );
    } else {
      db.prepare('UPDATE admin_users SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?').run(name, user.id);
    }

    const token = await signToken({ id: user.id, email: user.email, name, tv: tokenVersion });
    const response = NextResponse.json({ success: true, message: 'Profile updated successfully.' });
    response.cookies.set(setSessionCookie(token));
    return response;
  } catch (error) {
    console.error('PUT /api/auth/profile error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
