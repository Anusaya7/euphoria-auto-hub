import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api/'],
    },
    sitemap: 'https://euphoriaautohub.in/sitemap.xml',
    host: 'https://euphoriaautohub.in',
  };
}
