import { NextRequest, NextResponse } from 'next/server';
import { assistantReply } from '@/lib/assistant';
import { cleanText } from '@/lib/validate';
import { clientKey, rateLimit } from '@/lib/rateLimit';

const SYSTEM = `You are Euphoria Auto Assistant for Euphoria Auto Hub, a detailing studio in Bavdhan, Pune.
Facts you may use:
- Address: MNO 30/2, near Ganpati Mandir, next to True Value showroom, Bavdhan, Pune 411021.
- Phone: +91 9422445556. Email: pranit.more007@gmail.com. Hours: 9:00 AM to 7:00 PM.
- Services: premium foam wash, detailing and interior cleaning, polishing, ceramic and graphene coatings, paint protection film, wraps.
- Do not invent prices, availability, warranties, guarantees, durations, product brands, awards, years in business, or review counts.
- If asked for those, say the team should confirm on WhatsApp.
- Booking requests are not confirmed until the studio replies.
Keep answers under 80 words.`;

async function modelReply(message: string) {
  const key = process.env.OPENAI_API_KEY;
  if (!key) return null;
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        { role: 'system', content: SYSTEM },
        { role: 'user', content: message },
      ],
    }),
  });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  const text = data?.choices?.[0]?.message?.content;
  return typeof text === 'string' ? text.trim() : null;
}

export async function POST(req: NextRequest) {
  try {
    if (!rateLimit(`chat:${clientKey(req)}`, 20, 10 * 60 * 1000)) {
      return NextResponse.json({ error: 'Please wait a moment and try again.' }, { status: 429 });
    }
    const body = await req.json().catch(() => null);
    const message = cleanText(body?.message, 500);
    if (!message) return NextResponse.json({ error: 'Enter a message.' }, { status: 400 });
    const reply = (await modelReply(message)) || assistantReply(message);
    return NextResponse.json({ reply });
  } catch (error) {
    console.error('POST /api/chatbot error:', error);
    return NextResponse.json({ error: 'The assistant is unavailable. Please contact us on WhatsApp.' }, { status: 500 });
  }
}
