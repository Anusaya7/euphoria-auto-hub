const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function cleanText(value: unknown, max: number) {
  if (typeof value !== 'string') return '';
  return value.replace(/\u0000/g, '').trim().slice(0, max);
}

export function validateEnquiry(body: Record<string, unknown>) {
  const first_name = cleanText(body.first_name, 80);
  const last_name = cleanText(body.last_name, 80);
  const email = cleanText(body.email, 160);
  const mobile = cleanText(body.mobile, 20);
  const message = cleanText(body.message, 2000);

  if (!first_name) return { error: 'First name is required.' };
  if (!email || !EMAIL.test(email)) return { error: 'Enter a valid email address.' };
  const digits = mobile.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) return { error: 'Enter a valid mobile number.' };
  if (message.length < 5) return { error: 'Please enter a message.' };

  return { first_name, last_name, email, mobile, message };
}

export const ENQUIRY_STATUSES = ['NEW', 'CONTACTED', 'IN PROGRESS', 'COMPLETED', 'CANCELLED', 'CLOSED'] as const;

export function isHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch {
    return false;
  }
}

export function cleanSlug(value: unknown) {
  const slug = cleanText(value, 80).toLowerCase();
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) return '';
  return slug;
}

export function isUniqueConstraint(error: unknown) {
  return String(error).includes('UNIQUE');
}
