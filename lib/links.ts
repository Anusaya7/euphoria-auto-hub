export const BUSINESS = {
  phone: '+91 9422445556',
  email: 'pranit.more007@gmail.com',
  whatsapp: '919422445556',
  address: 'Mno 30/2, Euphoria Auto Hub, Pune, Bavdhan, Pune - 411021 (Near Ganpati Mandir, Next True Value Showroom)',
  maps: 'https://maps.app.goo.gl/wu66e8r4i5hMh8cCA',
  hours: 'All Day: 9:00 AM – 7:00 PM',
};

export function phoneHref(phone?: string | null) {
  const raw = (phone || BUSINESS.phone).trim();
  const compact = raw.replace(/[^\d+]/g, '');
  return compact ? `tel:${compact}` : '';
}

export function mailHref(email?: string | null) {
  const value = (email || BUSINESS.email).trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return `mailto:${BUSINESS.email}`;
  return `mailto:${value}`;
}

export function whatsappHref(value?: string | null) {
  const digits = (value || '').replace(/\D/g, '');
  if (digits.length < 10) return '';
  return `https://wa.me/${digits}`;
}

export function mapsEmbedSrc(address?: string | null) {
  const query = (address || BUSINESS.address).trim();
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=16&output=embed`;
}

export function isSafeUrl(value: unknown) {
  if (typeof value !== 'string' || value.trim() === '') return true;
  const v = value.trim().toLowerCase();
  if (v.startsWith('javascript:') || v.startsWith('data:')) return false;
  return v.startsWith('/') || v.startsWith('https://') || v.startsWith('http://') || v.startsWith('mailto:') || v.startsWith('tel:');
}

export function httpsHref(value?: string | null, fallback = BUSINESS.maps) {
  const raw = (value || '').trim();
  if (/^https:\/\/[^\s]+$/i.test(raw)) return raw;
  return fallback;
}

export function isStoredMediaPath(value: unknown) {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (!v || v.includes('..') || v.includes('\\') || v.includes('\0')) return false;
  if (/^\/(images|uploads)\/[A-Za-z0-9._-]+\.(jpg|jpeg|png|webp|mp4|webm)$/i.test(v)) return true;
  return /^https:\/\/[^\s]+$/i.test(v);
}

export function isStoredImage(value: unknown) {
  if (typeof value !== 'string') return false;
  const v = value.trim();
  if (!v || v.includes('..') || v.includes('\\') || v.includes('\0')) return false;
  return /^\/(images|uploads)\/[A-Za-z0-9._-]+\.(jpg|jpeg|png|webp)$/i.test(v);
}

export function localImage(value: unknown, fallback: string) {
  return isStoredImage(value) ? String(value).trim() : fallback;
}
