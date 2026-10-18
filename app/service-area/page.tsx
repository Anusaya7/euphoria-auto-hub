import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import SiteChrome from '@/components/public/sport/SiteChrome';
import { getSiteData } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Car Detailing Studio in Bavdhan, Pune | Euphoria Auto Hub',
  description: 'Euphoria Auto Hub is located in Bavdhan, Pune. Vehicle owners visit our studio from Kothrud, Warje, Baner, Aundh, Pashan and Paud Road.',
  alternates: { canonical: 'https://euphoriaautohub.in/service-area' },
};

const AREAS = [
  { name: 'Bavdhan', desc: 'Home to our dedicated automotive studio on MNO 30/2, near Ganpati Mandir.' },
  { name: 'Kothrud', desc: 'Convenient 10–15 min drive via Paud Road for full-day detailing or coating.' },
  { name: 'Baner', desc: 'Quick access via the Mumbai–Pune Bypass Highway for PPF and protection work.' },
  { name: 'Aundh', desc: 'Accessible drive for owners seeking certified multi-stage surface correction.' },
  { name: 'Pashan', desc: 'Directly neighboring Bavdhan for routine foam washing and maintenance details.' },
  { name: 'Warje', desc: 'Short highway drive for owners looking for long-term ceramic and wrap jobs.' },
  { name: 'Paud Road', desc: 'Connecting directly to our studio bay for swift arrival and pickup.' },
  { name: 'Hinjewadi', desc: 'Popular weekend detailing destination for IT park professionals and enthusiasts.' },
];

export default function ServiceAreaPage() {
  const { contact, social } = getSiteData();
  return (
    <SiteChrome contact={contact} social={social}>
      <section className="eh-section eh-wrap">
        <p className="eh-kicker">ONE DEDICATED STUDIO</p>
        <h1 style={{ fontSize: 'clamp(36px, 5.2vw, 68px)' }}>BAVDHAN STUDIO & PUNE ROADS</h1>
        <p style={{ maxWidth: 740, fontSize: 16, lineHeight: 1.75, marginBottom: 36 }}>
          Euphoria Auto Hub operates from a single, specialized studio at MNO 30/2, near Ganpati Mandir, Next to True Value Showroom, Bavdhan, Pune – 411021. We do not operate secondary franchise branches; all precision work is performed directly under our master technician&apos;s oversight.
        </p>

        <div className="eh-why-grid">
          {AREAS.map((area) => (
            <article key={area.name} className="eh-card" style={{ padding: 22, borderLeft: '3px solid #D71920' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <MapPin size={18} color="#D71920" />
                <h3 style={{ margin: 0, fontSize: 18 }}>{area.name}</h3>
              </div>
              <p style={{ fontSize: 13, margin: 0 }}>{area.desc}</p>
            </article>
          ))}
        </div>

        <div className="eh-actions" style={{ marginTop: 36 }}>
          <Link className="eh-btn" href="/booking">
            BOOK A STUDIO VISIT <ArrowRight size={16} />
          </Link>
          <Link className="eh-btn-ghost" href="/contact">
            STUDIO MAP & DIRECTIONS
          </Link>
        </div>
      </section>
    </SiteChrome>
  );
}
