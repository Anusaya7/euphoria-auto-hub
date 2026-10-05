import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import FloatingContact from '@/components/public/FloatingContact';
import { getDb } from '@/lib/db';
import type { Service } from '@/lib/types';
import { localImage } from '@/lib/links';
import { getSiteData } from '@/lib/site';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const db = getDb();
  const service = db.prepare('SELECT name, short_description FROM services WHERE slug = ? AND is_active = 1').get(slug) as { name: string; short_description: string } | undefined;
  if (!service) notFound();
  return { title: service.name, description: service.short_description };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDb();
  const service = db.prepare('SELECT * FROM services WHERE slug = ? AND is_active = 1').get(slug) as Service | undefined;
  if (!service) notFound();
  const { contact } = getSiteData();

  return (
    <>
      <Navbar contact={contact} />
      <FloatingContact contact={contact} />
      <main>
      <article className="service-detail">
        <div className="service-detail-hero">
          <Image src={localImage(service.image, '/images/service-car-wash.jpg')} alt={service.name} fill priority sizes="100vw" style={{ objectFit: 'cover' }} />
          <div className="service-detail-shade" />
          <div className="container service-detail-title">
            <div className="label-text">Service</div>
            <h1>{service.name}</h1>
          </div>
        </div>
        <div className="container service-detail-body">
          <p className="service-detail-lead">{service.short_description}</p>
          <p className="service-detail-copy">{service.full_description}</p>
          <div className="hero-actions">
            <Link href="/contact" className="btn-primary"><span>Book This Service</span><span aria-hidden="true">→</span></Link>
            <Link href="/services" className="btn-outline"><span>All Services</span></Link>
          </div>
        </div>
      </article>
      </main>
      <Footer contact={contact} />
    </>
  );
}
