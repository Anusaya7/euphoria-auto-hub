import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import SiteChrome from '@/components/public/sport/SiteChrome';
import { getSiteData } from '@/lib/site';
import { PACKAGES } from '@/lib/serviceCatalog';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Detailing & Protection Packages in Pune | Euphoria Auto Hub',
  description: 'Essential, Performance, Protection and Ultimate plans at Euphoria Auto Hub, Bavdhan. Contact the studio for confirmed vehicle pricing.',
  alternates: { canonical: 'https://euphoriaautohub.in/packages' },
};

export default function PackagesPage() {
  const { contact, social, packages } = getSiteData();
  const cards = packages.length ? packages : PACKAGES.map((item, index) => ({
    id: index,
    name: item.name,
    short_description: item.text,
    price: '',
    show_price: 0,
    cta: 'Get a Quote',
    cta_link: `/contact?package=${encodeURIComponent(item.name)}`,
  }));

  return (
    <SiteChrome contact={contact} social={social}>
      <section className="eh-section eh-wrap">
        <p className="eh-kicker">STRUCTURED VEHICLE CARE</p>
        <h1 style={{ fontSize: 'clamp(36px, 5.2vw, 68px)' }}>STUDIO PACKAGES</h1>
        <p style={{ maxWidth: 720, fontSize: 16, marginBottom: 36 }}>
          Whether you need a pristine deep clean or long-term multi-layer ceramic and film protection, our four tiered packages offer structured solutions for every vehicle.
        </p>

        <div className="eh-packages">
          {cards.map((item, idx) => (
            <article key={item.name} className={`eh-package${idx === 2 ? ' featured' : ''}`}>
              <h3>{item.name}</h3>
              <p>{item.short_description}</p>
              <div className="eh-quote">
                {item.show_price && item.price ? item.price : 'CONTACT US FOR PRICING'}
              </div>
              <Link className="eh-btn" href={item.cta_link || `/contact?package=${encodeURIComponent(item.name)}`}>
                {item.cta || 'Get a Quote'} <ArrowRight size={14} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </SiteChrome>
  );
}
