import type { Metadata } from 'next';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import ScrollReveal from '@/components/public/ScrollReveal';
import ServiceCard from '@/components/public/ServiceCard';
import { getSiteData } from '@/lib/site';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = { title: 'Services' };

export default function ServicesPage() {
  const { services, contact, homepage } = getSiteData();
  const intro = homepage.services_intro || {};
  const list = services;

  return (
    <>
      <Navbar contact={contact} />
      <ScrollReveal />
      <FloatingContact contact={contact} />
      <main>
        <section className="page-banner">
          <div className="container">
            <div className="label-text">{intro.label || 'Services'}</div>
            <h1 className="section-heading">{intro.heading || 'Premium Care For Every Detail'}</h1>
            <p className="section-subheading">{intro.description}</p>
          </div>
        </section>
        <section className="services-section">
          <div className="container">
            {list.length === 0 ? <p className="empty-note">No services yet.</p> : (
              <div className="services-grid">
                {list.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer contact={contact} />
    </>
  );
}
