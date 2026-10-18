import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Shield, Wrench } from 'lucide-react';
import SiteChrome from '@/components/public/sport/SiteChrome';
import { getSiteData } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'About Euphoria Auto Hub, Bavdhan, Pune',
  description: 'Euphoria Auto Hub is a dedicated automotive detailing studio in Bavdhan, Pune specializing in foam wash, interior restoration, ceramic coatings, PPF, and wraps.',
  alternates: { canonical: 'https://euphoriaautohub.in/about' },
};

export default function AboutPage() {
  const { contact, homepage, social } = getSiteData();
  const about = homepage.about || {};

  return (
    <SiteChrome contact={contact} social={social}>
      <section className="eh-section eh-wrap">
        <p className="eh-kicker">ABOUT EUPHORIA AUTO HUB</p>
        <h1 style={{ fontSize: 'clamp(36px, 5.2vw, 68px)' }}>{about.heading || 'CARE DRIVEN BY PRECISION.'}</h1>
        <p style={{ maxWidth: 740, fontSize: 16, lineHeight: 1.75 }}>
          {about.description || 'We believe every vehicle deserves more than a hurried wash. Our approach combines certified detailing methods, premium international formulations, and uncompromising attention to every panel and surface from our single dedicated studio in Bavdhan, Pune.'}
        </p>

        <div className="eh-hero-visual" style={{ minHeight: 460, margin: '32px 0' }}>
          <Image src="/images/about-detailing.jpg" alt="Detailing at Euphoria Auto Hub" fill sizes="100vw" style={{ objectFit: 'cover' }} />
        </div>

        <div className="eh-why-grid" style={{ marginTop: 24 }}>
          <article className="eh-card" style={{ padding: 24, borderLeft: '3px solid #D71920' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Shield size={20} color="#D71920" />
              <h3 style={{ margin: 0, fontSize: 18 }}>Paint-Safe Standards</h3>
            </div>
            <p style={{ fontSize: 14 }}>We employ clean grit-guard wash buckets, pH-neutral foams, and micro-fiber drying towels to safeguard automotive clear coats.</p>
          </article>
          <article className="eh-card" style={{ padding: 24, borderLeft: '3px solid #D71920' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <Wrench size={20} color="#D71920" />
              <h3 style={{ margin: 0, fontSize: 18 }}>Engineered Surface Defense</h3>
            </div>
            <p style={{ fontSize: 14 }}>From optical-clarity PPF installations to multi-stage hydrophobic ceramic coatings, our materials are chosen for proven real-world durability.</p>
          </article>
          <article className="eh-card" style={{ padding: 24, borderLeft: '3px solid #D71920' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <CheckCircle2 size={20} color="#D71920" />
              <h3 style={{ margin: 0, fontSize: 18 }}>Bavdhan Studio Location</h3>
            </div>
            <p style={{ fontSize: 14 }}>One dedicated facility with controlled bay lighting and experienced technicians. No rushed bay cycles or outsourced labor.</p>
          </article>
        </div>

        <div className="eh-actions" style={{ marginTop: 32 }}>
          <Link className="eh-btn" href="/booking">
            BOOK A STUDIO SERVICE <ArrowRight size={16} />
          </Link>
          <Link className="eh-btn-ghost" href="/service-area">
            VIEW PUNE SERVICE AREA
          </Link>
          <Link className="eh-btn-line" href="/contact">
            CONTACT STUDIO TEAM
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
