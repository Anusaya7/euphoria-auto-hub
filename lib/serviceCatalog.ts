export const SERVICE_ALIASES: Record<string, { slug: string; label: string }> = {
  'ceramic-coating': { slug: 'ceramic-graphene-coatings', label: 'Ceramic Coating' },
  'graphene-coating': { slug: 'ceramic-graphene-coatings', label: 'Graphene Coating' },
  ppf: { slug: 'paint-protection-film', label: 'Paint Protection Film' },
  'car-detailing': { slug: 'detailing-interior-cleaning', label: 'Car Detailing' },
  'premium-foam-wash': { slug: 'premium-car-wash', label: 'Premium Foam Wash' },
  'car-wrap': { slug: 'wrap-jobs', label: 'Car Wraps' },
  'paint-correction': { slug: 'polishing', label: 'Paint Correction' },
  'interior-cleaning': { slug: 'detailing-interior-cleaning', label: 'Interior Cleaning' },
};

export const VEHICLE_TYPES = ['Hatchback', 'Sedan', 'SUV', 'Luxury', 'Premium / Exotic', 'Other'] as const;

export const TIME_SLOTS = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

export const PACKAGES = [
  { name: 'Essential', text: 'Premium exterior care for a car that needs a proper clean and finish.' },
  { name: 'Performance', text: 'Exterior and interior detailing for a cabin and body that both feel finished.' },
  { name: 'Protection', text: 'Detailing paired with a protection conversation: ceramic, graphene, or film.' },
  { name: 'Ultimate', text: 'A full plan across wash, correction, protection, and wrap if that is what the car needs.' },
];

export const FINDER = [
  { id: 'clean', label: 'My car needs a deep clean', service: 'Premium Car Wash', slug: 'premium-car-wash' },
  { id: 'shine', label: 'I want more shine', service: 'Polishing', slug: 'polishing' },
  { id: 'protect', label: 'I want paint protection', service: 'Ceramic & Graphene Coatings', slug: 'ceramic-graphene-coatings' },
  { id: 'scratch', label: 'I want scratch protection', service: 'Paint Protection Film (PPF)', slug: 'paint-protection-film' },
  { id: 'interior', label: 'I want interior restoration', service: 'Detailing & Interior Cleaning', slug: 'detailing-interior-cleaning' },
  { id: 'colour', label: 'I want a colour change', service: 'Wrap Jobs', slug: 'wrap-jobs' },
  { id: 'long', label: 'I want long-term protection', service: 'Paint Protection Film (PPF)', slug: 'paint-protection-film' },
  { id: 'unsure', label: "I'm not sure", service: 'Talk to the studio', slug: '' },
];

export const FAQS = [
  { q: 'Where is Euphoria Auto Hub?', a: 'The studio is at MNO 30/2, near Ganpati Mandir, next to the True Value showroom, Bavdhan, Pune 411021.' },
  { q: 'What are the opening hours?', a: 'The studio is open from 9:00 AM to 7:00 PM.' },
  { q: 'Do you publish prices online?', a: 'Prices depend on the vehicle and the condition of the paint or interior. Ask the team for a quote on WhatsApp or by phone.' },
  { q: 'Which areas do you serve?', a: 'The studio is in Bavdhan. Owners also visit from nearby Pune areas including Kothrud, Warje, Baner, Aundh, Pashan, and Paud Road.' },
];

export function resolveServiceSlug(slug: string) {
  return SERVICE_ALIASES[slug]?.slug || slug;
}
