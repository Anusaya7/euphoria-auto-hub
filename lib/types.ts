export type ContactInfo = {
  phone?: string;
  email?: string;
  whatsapp?: string;
  address?: string;
  maps_url?: string;
  hours?: string;
};

export type Service = {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  image: string;
  icon: string;
  display_order: number;
  is_active: number;
  is_featured: number;
};

export type GalleryImage = {
  id: number;
  title: string;
  category: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: number;
  show_on_home?: number;
};

export type Testimonial = {
  id: number;
  customer_name: string;
  review: string;
  rating: number;
  image?: string;
  is_active?: number;
  show_on_home?: number;
};

export type Enquiry = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  message: string;
  status: string;
  is_read?: number;
  created_at: string;
};

export type SeoSettings = {
  title?: string;
  description?: string;
  keywords?: string;
  og_image?: string;
  canonical_url?: string;
};

export type Benefit = string | { title?: string; description?: string };

export type HomepageSection = {
  label?: string;
  heading?: string;
  subheading?: string;
  description?: string;
  image?: string;
  image_alt?: string;
  video?: string;
  cta?: string;
  cta_primary?: string;
  cta_secondary?: string;
  quality_badge?: string;
  trust_badge?: string;
  benefits?: Benefit[];
  finishes?: { label?: string; description?: string; desc?: string }[];
  steps?: { number?: string; title?: string; description?: string; active?: boolean }[];
  cta_primary_link?: string;
  cta_secondary_link?: string;
  before_image?: string;
  after_image?: string;
  enabled?: boolean;
  items?: { number?: string; title?: string; text?: string }[];
};

export type AlertState = { type: 'success' | 'error'; msg: string } | null;

export type CountRow = { c: number };
