import { BUSINESS } from '@/lib/links';

export function whatsappDigits(value?: string | null) {
  const digits = (value || BUSINESS.whatsapp).replace(/\D/g, '');
  return digits.length >= 10 ? digits : BUSINESS.whatsapp;
}

export function whatsappLink(message: string, phone?: string | null) {
  return `https://wa.me/${whatsappDigits(phone)}?text=${encodeURIComponent(message)}`;
}

export function enquiryMessage(service: string) {
  return `Hi Euphoria Auto Hub, I would like to enquire about ${service} for my car.`;
}

export function bookingMessage(input: {
  service?: string;
  vehicle?: string;
  date?: string;
  time?: string;
  name?: string;
  phone?: string;
}) {
  return [
    'Hi Euphoria Auto Hub,',
    'I would like to book a service.',
    `Service: ${input.service || ''}`,
    `Vehicle: ${input.vehicle || ''}`,
    `Preferred Date: ${input.date || ''}`,
    `Preferred Time: ${input.time || ''}`,
    `Name: ${input.name || ''}`,
    `Phone: ${input.phone || ''}`,
  ].join('\n');
}
