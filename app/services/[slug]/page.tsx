import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowRight, CheckCircle2, MessageCircle, Shield } from 'lucide-react';
import SiteChrome from '@/components/public/sport/SiteChrome';
import { getDb } from '@/lib/db';
import { getSiteData } from '@/lib/site';
import type { Service } from '@/lib/types';
import { localImage } from '@/lib/links';
import { FAQS, SERVICE_ALIASES, resolveServiceSlug } from '@/lib/serviceCatalog';
import { enquiryMessage, whatsappLink } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const label = SERVICE_ALIASES[slug]?.label;
  const service = getDb().prepare('SELECT name, short_description FROM services WHERE slug = ? AND is_active = 1').get(resolveServiceSlug(slug)) as { name: string; short_description: string } | undefined;
  if (!service) notFound();
  const title = `${label || service.name} in Bavdhan, Pune | Euphoria Auto Hub`;
  return {
    title,
    description: service.short_description,
    alternates: { canonical: `https://euphoriaautohub.in/services/${slug}` },
    openGraph: { title, description: service.short_description, images: ['/images/hero-car.jpg'] },
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getDb().prepare('SELECT * FROM services WHERE slug = ? AND is_active = 1').get(resolveServiceSlug(slug)) as Service | undefined;
  if (!service) notFound();
  const { contact, testimonials, social } = getSiteData();
  const title = SERVICE_ALIASES[slug]?.label || service.name;
  const wa = whatsappLink(enquiryMessage(title), contact?.whatsapp);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    provider: { '@type': 'AutomotiveBusiness', name: 'Euphoria Auto Hub', telephone: '+91 9422445556' },
    areaServed: 'Pune',
    description: service.short_description,
  };

  return (
    <SiteChrome contact={contact} social={social}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <article className="eh-wrap eh-section" style={{ maxWidth: 1000 }}>
        <p className="eh-kicker">STUDIO SPECIALISM · BAVDHAN, PUNE</p>
        <h1 style={{ fontSize: 'clamp(36px, 5.5vw, 64px)' }}>{title}</h1>
        <p style={{ fontSize: 18, color: '#626873', lineHeight: 1.6 }}>{service.short_description}</p>

        <div className="eh-hero-visual" style={{ minHeight: 420, margin: '28px 0' }}>
          <Image
            src={localImage(service.image, '/images/service-car-wash.jpg')}
            alt={title}
            fill
            priority
            sizes="100vw"
            style={{ objectFit: 'cover' }}
          />
        </div>

        <div className="eh-book" style={{ margin: '28px 0', borderLeft: '4px solid #D71920' }}>
          <h2 style={{ fontSize: 24, margin: '0 0 12px' }}>SERVICE OVERVIEW & SCOPE</h2>
          <p style={{ color: '#141414', fontSize: 16, lineHeight: 1.75 }}>
            {service.full_description}
          </p>

          {service.benefits && (
            <div style={{ marginTop: 20 }}>
              <strong style={{ display: 'block', fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#141414', marginBottom: 10 }}>Key Features & Benefits:</strong>
              <ul className="eh-service-benefits" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', display: 'grid', gap: 10 }}>
                {service.benefits.split(/\r?\n/).map((benefit) => benefit.trim()).filter(Boolean).map((benefit) => (
                  <li key={benefit} style={{ fontSize: 14, fontWeight: 500 }}>
                    <CheckCircle2 size={16} color="#D71920" style={{ flexShrink: 0 }} />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid #E1E4E8', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
            <span className="eh-quote" style={{ margin: 0 }}>
              {service.show_price && service.price ? service.price : 'DURATION & PRICING: CONFIRMED BY STUDIO'}
            </span>
            <div className="eh-actions" style={{ margin: 0 }}>
              <Link className="eh-btn" href={`/booking?service=${encodeURIComponent(service.name)}`}>
                BOOK APPOINTMENT <ArrowRight size={16} />
              </Link>
              <a className="eh-btn-wa" href={wa} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} color="#128C7E" /> CHAT ON WHATSAPP
              </a>
            </div>
          </div>
        </div>

        <h2 style={{ marginTop: 44 }}>FREQUENT QUESTIONS</h2>
        <div style={{ display: 'grid', gap: 12, marginTop: 16 }}>
          {FAQS.slice(0, 3).map((item) => (
            <article key={item.q} className="eh-book" style={{ padding: '18px 22px' }}>
              <h3 style={{ fontSize: 18, color: '#141414', margin: '0 0 6px' }}>{item.q}</h3>
              <p style={{ margin: 0 }}>{item.a}</p>
            </article>
          ))}
        </div>

        {testimonials[0] && (
          <article className="eh-review" style={{ marginTop: 32, borderLeft: '3px solid #D71920' }}>
            <div className="eh-stars">{'★'.repeat(testimonials[0].rating || 5)}</div>
            <p>&ldquo;{testimonials[0].review}&rdquo;</p>
            <strong>{testimonials[0].customer_name}</strong>
          </article>
        )}
      </article>
    </SiteChrome>
  );
}
