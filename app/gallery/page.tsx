import type { Metadata } from 'next';
import SiteChrome from '@/components/public/sport/SiteChrome';
import GalleryBoard from '@/components/public/sport/GalleryBoard';
import { getSiteData } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Automotive Gallery & Portfolio | Euphoria Auto Hub, Pune',
  description: 'Studio photographs of foam wash, ceramic coating, PPF, wraps, interior detailing and polishing at Euphoria Auto Hub, Bavdhan, Pune.',
  alternates: { canonical: 'https://euphoriaautohub.in/gallery' },
};

export default function GalleryPage() {
  const { gallery, contact, social } = getSiteData();
  return (
    <SiteChrome contact={contact} social={social}>
      <section className="eh-section eh-wrap">
        <p className="eh-kicker">AUTHENTIC STUDIO WORK</p>
        <h1 style={{ fontSize: 'clamp(36px, 5.2vw, 68px)' }}>AUTOMOTIVE PORTFOLIO</h1>
        <p style={{ maxWidth: 720, fontSize: 16, marginBottom: 32 }}>
          Genuine studio photographs from Euphoria Auto Hub in Bavdhan, Pune. Filter by service to see verified finishes across wash, ceramic, graphene, PPF, wraps, and cabin detailing.
        </p>
        <GalleryBoard images={gallery} />
      </section>
    </SiteChrome>
  );
}
