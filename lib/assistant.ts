import { FAQS } from '@/lib/serviceCatalog';

const FACTS = [
  { test: /hour|open|time|close/i, reply: 'Euphoria Auto Hub is open from 9:00 AM to 7:00 PM.' },
  { test: /recommend|which service|not sure/i, reply: 'Tell me what you want to improve and a little about your car. The studio can inspect it and recommend the right service before quoting.' },
  { test: /where|address|location|map|bavdhan/i, reply: 'The studio is at MNO 30/2, near Ganpati Mandir, next to the True Value showroom, Bavdhan, Pune 411021.' },
  { test: /phone|call|email|contact/i, reply: 'Call +91 9422445556 or email pranit.more007@gmail.com. WhatsApp is the fastest way to reach the team.' },
  { test: /price|cost|quote|charge|how much/i, reply: 'I do not have live prices. Pricing depends on the vehicle and the work. I would recommend connecting with the team on WhatsApp for the latest quote.' },
  { test: /ceramic/i, reply: 'Ceramic coating is a clear protective layer that deepens gloss and makes paint easier to keep clean. The studio also offers graphene coating on the same service page. I cannot confirm duration, brand, or warranty here.' },
  { test: /graphene/i, reply: 'Graphene coating is offered with ceramic coating as advanced paint protection. Ask the team which option suits your paint. I cannot confirm product brands or warranty terms.' },
  { test: /ppf|paint protection film|film/i, reply: 'Paint Protection Film is a clear polyurethane film that shields paint from road debris, UV, and light abrasion. Ask the team whether your panels are suitable.' },
  { test: /wrap/i, reply: 'Wrap jobs include full, partial, colour-change, and graphic wraps in gloss, matte, and satin. A wrap is removable when it is applied properly.' },
  { test: /interior|cabin/i, reply: 'Interior work includes vacuuming, upholstery, dashboard and console cleaning, glass, and odour care, as part of detailing and interior cleaning.' },
  { test: /polish|correction|scratch|swirl/i, reply: 'Polishing uses machine polishing to improve swirl marks, light scratches, and dull paint. The team needs to see the paint before promising a result.' },
  { test: /wash|foam/i, reply: 'The premium car wash is a paint-safe foam wash aimed at dirt, grime, and a clean shine. It is not a substitute for coating or film.' },
  { test: /detail/i, reply: 'Detailing covers exterior finish and a deep interior clean. Book a visit if you want the team to inspect the car first.' },
  { test: /book|appointment|slot/i, reply: 'You can send a booking request from the Book page. The studio confirms the time with you. A request is not a confirmed appointment until the team replies.' },
];

export function assistantReply(message: string) {
  const text = message.trim();
  if (!text) return 'Tell me what you want to know about wash, detailing, coatings, PPF, wraps, or booking.';
  const hit = FACTS.find((item) => item.test.test(text));
  if (hit) return hit.reply;
  const faq = FAQS.find((item) => item.q.toLowerCase().includes(text.toLowerCase().slice(0, 18)));
  if (faq) return faq.a;
  return 'Please contact our team on WhatsApp for the latest information.';
}
