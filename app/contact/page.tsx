import type { Metadata } from 'next';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import LocationSection from '@/components/public/LocationSection';
import ContactSection from '@/components/public/ContactSection';
import ScrollReveal from '@/components/public/ScrollReveal';
import { getSiteData } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Contact' };

export default function ContactPage() {
  const { contact, homepage } = getSiteData();

  return (
    <>
      <Navbar contact={contact} />
      <ScrollReveal />
      <FloatingContact contact={contact} />
      <main>
      <section className="page-banner">
        <div className="container">
          <div className="label-text">{homepage.contact_intro?.label || 'Get In Touch'}</div>
          <h1 className="section-heading">{homepage.contact_intro?.heading || 'Book Your Service'}</h1>
          <p className="section-subheading">{homepage.contact_intro?.description}</p>
        </div>
      </section>
      <LocationSection contact={contact} location={homepage.location} />
      <ContactSection contact={contact} intro={homepage.contact_intro} />
      </main>
      <Footer contact={contact} />
    </>
  );
}
