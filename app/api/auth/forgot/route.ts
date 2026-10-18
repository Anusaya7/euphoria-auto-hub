import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { getDb } from '@/lib/db';
import { mailConfigured } from '@/lib/notify';
import nodemailer from 'nodemailer';
import { clientKey, rateLimit } from '@/lib/rateLimit';

const MESSAGE = 'If this email belongs to an admin and email delivery is configured, a reset link will be sent.';

export async function POST(req: NextRequest) {
  if (!rateLimit(`forgot:${clientKey(req)}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ message: MESSAGE });
  }
  const body = await req.json().catch(() => null);
  const email = String(body?.email || '').trim().toLowerCase();
  if (!email || !mailConfigured()) return NextResponse.json({ message: MESSAGE });

  const user = getDb().prepare('SELECT id FROM admin_users WHERE email = ?').get(email) as { id: number } | undefined;
  if (!user) return NextResponse.json({ message: MESSAGE });

  const token = crypto.randomBytes(32).toString('hex');
  const hash = bcrypt.hashSync(token, 12);
  const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString();
  getDb().prepare('UPDATE admin_users SET reset_hash = ?, reset_expires = ? WHERE id = ?').run(hash, expires, user.id);

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'https://euphoriaautohub.in';
  const port = Number(process.env.SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Euphoria Auto Hub admin password reset',
    text: `Reset your admin password within 30 minutes:\n${site}/admin/reset?token=${token}`,
  }).catch(() => null);

  return NextResponse.json({ message: MESSAGE });
}
