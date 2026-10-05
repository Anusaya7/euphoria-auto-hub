import type { Metadata } from 'next';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import GallerySection from '@/components/public/GallerySection';
import ScrollReveal from '@/components/public/ScrollReveal';
import { getSiteData } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Gallery' };

export default function GalleryPage() {
  const { gallery, contact, homepage } = getSiteData();
  const intro = homepage.gallery_intro || {};

  return (
    <>
      <Navbar contact={contact} />
      <ScrollReveal />
      <FloatingContact contact={contact} />
      <main>
      <section className="page-banner">
        <div className="container">
          <div className="label-text">{intro.label || 'Our Work'}</div>
          <h1 className="section-heading">{intro.heading || 'From The Studio'}</h1>
          <p className="section-subheading">{intro.description}</p>
        </div>
      </section>
      <section className="gallery-section">
        <div className="container">
          <GallerySection images={gallery} />
        </div>
      </section>
      </main>
      <Footer contact={contact} />
    </>
  );
}
