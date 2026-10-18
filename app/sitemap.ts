import type { MetadataRoute } from 'next';
import { getDb } from '@/lib/db';
import { SERVICE_ALIASES } from '@/lib/serviceCatalog';

export const dynamic = 'force-dynamic';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://euphoriaautohub.in';
  const services = getDb().prepare('SELECT slug FROM services WHERE is_active = 1 ORDER BY display_order ASC').all() as { slug: string }[];
  return [
    { url: base, changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/services`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/gallery`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/booking`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/packages`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/service-area`, changeFrequency: 'monthly', priority: 0.5 },
    ...services.map((service) => ({
      url: `${base}/services/${service.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    ...Object.keys(SERVICE_ALIASES).map((slug) => ({
      url: `${base}/services/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.55,
    })),
  ];
}
