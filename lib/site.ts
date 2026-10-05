import { getDb } from '@/lib/db';
import type { ContactInfo, GalleryImage, HomepageSection, SeoSettings, Service, Testimonial } from '@/lib/types';

export type { ContactInfo };

export function getSiteData() {
  const db = getDb();
  const homepage: Record<string, HomepageSection> = {};
  const rows = db.prepare('SELECT section, data FROM homepage_content').all() as { section: string; data: string }[];
  rows.forEach((row) => {
    try {
      homepage[row.section] = JSON.parse(row.data);
    } catch {
      homepage[row.section] = {};
    }
  });

  const services = db.prepare('SELECT * FROM services WHERE is_active = 1 ORDER BY display_order ASC, id ASC').all() as Service[];
  const gallery = db.prepare('SELECT * FROM gallery_images WHERE is_active = 1 ORDER BY display_order ASC, id ASC').all() as GalleryImage[];
  const testimonials = db.prepare('SELECT * FROM testimonials WHERE is_active = 1 ORDER BY id DESC').all() as Testimonial[];
  const contact = (db.prepare('SELECT phone, email, whatsapp, address, maps_url, hours FROM contact_settings LIMIT 1').get() || {}) as ContactInfo;
  const seo = db.prepare('SELECT title, description, keywords, og_image, canonical_url FROM seo_settings WHERE page = ?').get('home') as SeoSettings | undefined;

  return { homepage, services, gallery, testimonials, contact, seo };
}
