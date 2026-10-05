import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { signToken, setSessionCookie } from '@/lib/auth';
import { clientKey, rateLimit } from '@/lib/rateLimit';

const INVALID_USER_HASH = bcrypt.hashSync('rejected-login', 12);

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`login:${clientKey(req)}`, 10, 15 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many attempts. Please wait and try again.' }, { status: 429 });
    }
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const db = getDb();
    const user = db.prepare('SELECT id, email, name, password_hash, token_version FROM admin_users WHERE email = ?').get(email) as { id: number; email: string; name: string; password_hash: string; token_version: number } | undefined;

    const passwordMatches = user
      ? bcrypt.compareSync(password, user.password_hash)
      : bcrypt.compareSync(password, INVALID_USER_HASH);
    if (!user || !passwordMatches) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = await signToken({ id: user.id, email: user.email, name: user.name, tv: Number(user.token_version || 0) });
    const cookieOptions = setSessionCookie(token);

    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } });
    response.cookies.set(cookieOptions);
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
