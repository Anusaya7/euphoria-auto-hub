import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { getDb } from '@/lib/db';

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured');
  }
  return new TextEncoder().encode(secret);
}

const COOKIE_NAME = 'euphoria_admin_session';

export async function signToken(payload: { id: number; email: string; name: string; tv: number }) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(getJwtSecret());
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as { id: number; email: string; name: string; tv?: number };
  } catch {
    return null;
  }
}

async function sessionFromToken(token?: string) {
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.id || !payload.email) return null;
  const user = getDb().prepare('SELECT token_version FROM admin_users WHERE id = ? AND email = ?').get(payload.id, payload.email) as { token_version: number } | undefined;
  if (!user || Number(payload.tv ?? 0) !== Number(user.token_version || 0)) return null;
  return { id: Number(payload.id), email: payload.email, name: payload.name };
}

export async function getSession() {
  const cookieStore = await cookies();
  return sessionFromToken(cookieStore.get(COOKIE_NAME)?.value);
}

export async function getSessionFromRequest(req: NextRequest) {
  return sessionFromToken(req.cookies.get(COOKIE_NAME)?.value);
}

export function setSessionCookie(token: string) {
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
  };
}

export function clearSessionCookie() {
  return {
    name: COOKIE_NAME,
    value: '',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 0,
    path: '/',
  };
}
