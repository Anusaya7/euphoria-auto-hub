import { getDb } from '@/lib/db';
import type { ContactInfo, GalleryImage, HomepageSection, SeoSettings, Service, Testimonial } from '@/lib/types';

export type PackageItem = {
  id: number;
  name: string;
  short_description: string;
  included: string;
  benefits: string;
  price: string;
  show_price: number;
  cta: string;
  cta_link: string;
  is_featured: number;
  display_order: number;
  is_active: number;
};

export type FaqItem = { id: number; question: string; answer: string; category: string; display_order: number; is_active: number };
export type BeforeAfterItem = { id: number; title: string; description: string; category: string; before_image: string; after_image: string; display_order: number; is_active: number };
export type SocialItem = { platform: string; display_name: string; url: string; enabled: number; display_order: number };

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
  const testimonials = db.prepare('SELECT * FROM testimonials WHERE is_active = 1 AND is_verified = 1 ORDER BY id DESC').all() as Testimonial[];
  const contact = (db.prepare('SELECT * FROM contact_settings LIMIT 1').get() || {}) as ContactInfo;
  const seo = db.prepare('SELECT title, description, keywords, og_image, canonical_url FROM seo_settings WHERE page = ?').get('home') as SeoSettings | undefined;
  const packages = db.prepare('SELECT * FROM packages WHERE is_active = 1 ORDER BY display_order ASC, id ASC').all() as PackageItem[];
  const faqs = db.prepare('SELECT * FROM faqs WHERE is_active = 1 ORDER BY display_order ASC, id ASC').all() as FaqItem[];
  const beforeAfter = db.prepare('SELECT * FROM before_after WHERE is_active = 1 ORDER BY display_order ASC, id ASC').all() as BeforeAfterItem[];
  const social = db.prepare('SELECT platform, display_name, url, enabled, display_order FROM social_links WHERE enabled = 1 AND url != \'\' ORDER BY display_order ASC, id ASC').all() as SocialItem[];

  return { homepage, services, gallery, testimonials, contact, seo, packages, faqs, beforeAfter, social };
}
