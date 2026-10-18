import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import SiteChrome from '@/components/public/sport/SiteChrome';
import { getSiteData } from '@/lib/site';
import { localImage } from '@/lib/links';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Car Detailing, Ceramic Coating and PPF in Pune | Euphoria Auto Hub',
  description: 'Foam wash, detailing, machine polishing, ceramic and graphene coatings, paint protection film and vehicle wraps at Euphoria Auto Hub, Bavdhan, Pune.',
  alternates: { canonical: 'https://euphoriaautohub.in/services' },
};

export default function ServicesPage() {
  const { services, contact, social } = getSiteData();
  return (
    <SiteChrome contact={contact} social={social}>
      <section className="eh-section eh-wrap">
        <p className="eh-kicker">PERFORMANCE & PROTECTION</p>
        <h1 style={{ fontSize: 'clamp(36px, 5vw, 68px)' }}>BUILT FOR THE WAY YOU DRIVE.</h1>
        <p style={{ maxWidth: 720, fontSize: 16 }}>
          From a clean, refined finish to advanced multi-year paint protection, choose the exact care your vehicle needs from our Bavdhan studio.
        </p>

        <div className="eh-services" style={{ marginTop: 36 }}>
          {services.map((service, index) => (
            <article key={service.id} className="eh-service">
              <div className="eh-service-photo">
                <Image
                  src={localImage(service.image, '/images/service-car-wash.jpg')}
                  alt={service.name}
                  fill
                  sizes="(max-width: 720px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </div>
              <div className="eh-service-body">
                <div className="eh-service-meta">
                  <span className="eh-index">{String(index + 1).padStart(2, '0')}</span>
                  <span className="eh-service-category">{service.slug.replace(/-/g, ' ')}</span>
                </div>
                <h3>{service.name}</h3>
                <p>{service.short_description}</p>
                {service.benefits && (
                  <ul className="eh-service-benefits">
                    {service.benefits.split(/\r?\n/).map((b) => b.trim()).filter(Boolean).slice(0, 3).map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                )}
                <div style={{ marginTop: 'auto' }}>
                  <span className="eh-quote">
                    {service.show_price && service.price ? service.price : 'CONTACT US FOR PRICING'}
                  </span>
                  <div className="eh-service-actions">
                    <Link href={`/services/${service.slug}`}>
                      Learn More →
                    </Link>
                    <Link href={`/booking?service=${encodeURIComponent(service.name)}`}>
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </SiteChrome>
  );
}
