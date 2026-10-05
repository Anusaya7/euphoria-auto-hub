import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp']);

function detectImage(buffer: Buffer): 'jpg' | 'png' | 'webp' | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return 'jpg';
  if (buffer.length >= 8 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) return 'png';
  if (buffer.length >= 12 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') return 'webp';
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionFromRequest(req);
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

    if (file.name.includes('/') || file.name.includes('\\') || file.name.includes('\0')) {
      return NextResponse.json({ error: 'Image must be JPG, PNG or WEBP.' }, { status: 400 });
    }
    const parts = file.name.toLowerCase().split('.').filter(Boolean);
    const ext = parts.pop() || '';
    const blocked = ['exe', 'js', 'php', 'svg', 'html', 'htm', 'bat', 'cmd', 'sh', 'dll', 'mjs', 'pdf'];
    if (!ALLOWED_EXT.has(ext) || parts.some((part) => blocked.includes(part))) {
      return NextResponse.json({ error: 'Image must be JPG, PNG or WEBP.' }, { status: 400 });
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Image size must be below 5 MB.' }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length === 0 || bytes.length > MAX_SIZE) {
      return NextResponse.json({ error: 'Image size must be below 5 MB.' }, { status: 400 });
    }
    const kind = detectImage(bytes);
    if (!kind) {
      return NextResponse.json({ error: 'Image must be JPG, PNG or WEBP.' }, { status: 400 });
    }
    if ((kind === 'jpg' && ext !== 'jpg' && ext !== 'jpeg') || (kind === 'png' && ext !== 'png') || (kind === 'webp' && ext !== 'webp')) {
      return NextResponse.json({ error: 'Image must be JPG, PNG or WEBP.' }, { status: 400 });
    }

    const filename = `${uuidv4()}.${kind === 'jpg' ? (ext === 'jpeg' ? 'jpeg' : 'jpg') : kind}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), bytes);

    return NextResponse.json({ success: true, url: `/uploads/${filename}` });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
