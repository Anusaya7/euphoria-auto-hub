import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import ScrollReveal from '@/components/public/ScrollReveal';
import GallerySection from '@/components/public/GallerySection';
import WrapFinishes from '@/components/public/WrapFinishes';
import Footer from '@/components/public/Footer';
import LocationSection from '@/components/public/LocationSection';
import ContactSection from '@/components/public/ContactSection';
import FloatingContact from '@/components/public/FloatingContact';
import ServiceCard from '@/components/public/ServiceCard';
import BeforeAfter from '@/components/public/BeforeAfter';
import { localImage } from '@/lib/links';
import { getSiteData } from '@/lib/site';

export const dynamic = 'force-dynamic';

const WHY = [
  { number: '01', title: 'Premium Products', text: 'Coatings, films and washes chosen for gloss, durability and a finish that holds.' },
  { number: '02', title: 'Expert Detailing', text: 'Careful work on paint, wheels, glass and the cabin, not a rushed wash bay pass.' },
  { number: '03', title: 'Paint-Safe Process', text: 'Surfaces are prepared and protected so the correction never comes at the paint’s expense.' },
  { number: '04', title: 'Exceptional Finish', text: 'The car leaves with depth, clarity and a surface that is easier to keep that way.' },
];

const DEFAULT_STEPS = [
  { number: '01', title: 'Inspect', description: 'We assess the paint, interior and your priorities before any work begins.' },
  { number: '02', title: 'Prepare', description: 'Surfaces are washed, decontaminated and masked so the work stays paint-safe.' },
  { number: '03', title: 'Detail', description: 'Every panel, wheel and cabin surface is cleaned and corrected with care.' },
  { number: '04', title: 'Protect', description: 'Coatings, film or wraps are applied to lock in the result.' },
  { number: '05', title: 'Perfect', description: 'A final inspection and handover, so the car leaves finished.' },
];

export async function generateMetadata(): Promise<Metadata> {
  try {
    const { seo } = getSiteData();
    const title = seo?.title || 'Euphoria Auto Hub | Premium Car Wash, PPF, Ceramic & Detailing in Pune';
    const description = seo?.description || "Euphoria Auto Hub — Your Car's Best Friend. Premium car wash, PPF, Ceramic & Graphene Coatings, Detailing, Wrap Jobs in Pune, Bavdhan.";
    return {
      title: { absolute: title },
      description,
      keywords: seo?.keywords || undefined,
      alternates: { canonical: seo?.canonical_url || 'https://euphoriaautohub.in' },
      openGraph: {
        title,
        description,
        url: seo?.canonical_url || 'https://euphoriaautohub.in',
        images: seo?.og_image ? [seo.og_image] : ['/images/hero-car.jpg'],
      },
    };
  } catch {
    return { title: 'Euphoria Auto Hub' };
  }
}

function lines(value?: string) {
  return (value || '').split('\n').filter(Boolean);
}

function safeHref(value: string | undefined, fallback: string) {
  if (!value) return fallback;
  if (value.startsWith('/') && !value.includes('..')) return value;
  if (/^https?:\/\//i.test(value)) return value;
  return fallback;
}

export default async function HomePage() {
  const { homepage, services, gallery, testimonials, contact } = getSiteData();
  const hero = homepage.hero || {};
  const about = homepage.about || {};
  const ceramic = homepage.featured_ceramic || {};
  const ppf = homepage.featured_ppf || {};
  const wrap = homepage.featured_wrap || {};
  const detailing = homepage.featured_detailing || {};
  const process = homepage.process || {};
  const servicesIntro = homepage.services_intro || {};
  const galleryIntro = homepage.gallery_intro || {};
  const steps = (process.steps || []).filter((step: { active?: boolean }) => step.active !== false);
  const processSteps = steps.length ? steps : DEFAULT_STEPS;
  const coating = services.find((service) => /ceramic|graphene/i.test(service.slug));
  const ppfService = services.find((service) => /ppf|paint-protection/i.test(service.slug));
  const wrapService = services.find((service) => /wrap/i.test(service.slug));
  const detailingService = services.find((service) => /detail/i.test(service.slug));
  const heroHeading = lines(hero.heading || 'Premium Care.\nExceptional Finish.');
  const primaryHref = safeHref(hero.cta_primary_link, '/contact');
  const secondaryHref = safeHref(hero.cta_secondary_link, '/services');
  const trustItems = (homepage.trust?.items || []).filter((item) => item.title || item.number);
  const whyItems = (homepage.why?.items || []).filter((item) => item.title);
  const compare = homepage.compare || {};
  const finalCta = homepage.final_cta || {};
  const homeGallery = gallery.filter((image) => image.show_on_home !== 0);
  const homeTestimonials = testimonials.filter((item) => item.show_on_home !== 0);
  const rating = homeTestimonials.length
    ? Math.round(homeTestimonials.reduce((sum, item) => sum + (item.rating || 5), 0) / homeTestimonials.length)
    : 5;
  const benefits = (ceramic.benefits || []).filter((benefit): benefit is string => typeof benefit === 'string' && benefit.length > 0);

  return (
    <>
      <Navbar contact={contact} />
      <ScrollReveal />
      <FloatingContact contact={contact} />
      <main>
        <section id="home" className="hero">
          <div className="container hero-layout">
            <div className="hero-content">
              <div className="hero-label">
                <div className="hero-label-line" />
                <div className="hero-label-text">{hero.label || 'EUPHORIA AUTO HUB'}</div>
              </div>
              <h1 className="hero-title">
                {heroHeading.map((line) => <span key={line}>{line}</span>)}
              </h1>
              <p className="hero-description">
                {hero.description || 'Professional car detailing, paint protection and premium automotive care designed to keep your vehicle looking its absolute best.'}
              </p>
              <p className="hero-services">{hero.subheading || 'Car Wash • Ceramic Coating • Graphene Coating • Paint Protection • Detailing • Wraps'}</p>
              <div className="hero-actions">
                <Link href={primaryHref} className="btn-primary"><span>{hero.cta_primary || 'Book Your Service'}</span></Link>
                <Link href={secondaryHref} className="btn-outline"><span>{hero.cta_secondary || 'Explore Services'}</span><span aria-hidden="true">→</span></Link>
              </div>
            </div>
            <div className="hero-visual">
              {hero.video && /\.(mp4|webm)$/i.test(hero.video) && hero.video.startsWith('/uploads/') ? (
                <video className="hero-video" src={hero.video} autoPlay muted loop playsInline poster={localImage(hero.image, '/images/hero-car.jpg')} />
              ) : (
                <Image src={localImage(hero.image, '/images/hero-car.jpg')} alt={hero.image_alt || 'Luxury car finished at Euphoria Auto Hub'} fill priority sizes="(max-width: 900px) 100vw, 52vw" style={{ objectFit: 'cover' }} />
              )}
              <div className="hero-visual-frame" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="trust-strip" aria-label="Studio standards">
          <div className="container trust-grid">
            {(trustItems.length ? trustItems : [
              { number: 'Premium', title: 'Products' },
              { number: 'Expert', title: 'Detailing' },
              { number: 'Paint-Safe', title: 'Process' },
              { number: `${rating}★`, title: 'Customer Experience' },
            ]).map((item) => (
              <div key={`${item.number}-${item.title}`}><strong>{item.number}</strong><span>{item.title}</span></div>
            ))}
          </div>
        </section>

        <section id="services" className="services-section">
          <div className="container">
            <div className="section-intro reveal">
              <div className="label-text">{servicesIntro.label || 'Services'}</div>
              <h2 className="section-heading">{servicesIntro.heading || 'Premium Care For Every Detail'}</h2>
              <p className="section-subheading">{servicesIntro.description || 'From deep cleaning to advanced surface protection, we treat every vehicle with precision.'}</p>
            </div>
            {services.length === 0 ? (
              <p className="empty-note">Services will appear here.</p>
            ) : (
              <div className="services-grid">
                {services.map((service, index) => (
                  <ServiceCard key={service.id} service={service} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="featured-section band-dark">
          <div className="container">
            <div className="featured-inner">
              <div className="featured-image-wrap reveal">
                <Image src={localImage(ceramic.image, '/images/service-ceramic.jpg')} alt="Ceramic coating applied in the studio" fill sizes="(max-width: 968px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
              </div>
              <div className="featured-content reveal">
                <div className="label-text">{ceramic.subheading || ceramic.label || 'Ceramic & Graphene Coatings'}</div>
                <h2 className="featured-title">{ceramic.heading || 'Protection That Lasts'}</h2>
                <p className="featured-description">{ceramic.description}</p>
                <ul className="benefit-list">
                  {benefits.map((benefit) => (
                    <li key={benefit}>{benefit}</li>
                  ))}
                </ul>
                <div>
                  <Link href={coating ? `/services/${coating.slug}` : '/services'} className="btn-primary">
                    <span>{ceramic.cta || 'Explore Coatings'}</span><span aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="why-section">
          <div className="container">
            <div className="section-intro reveal">
              <div className="label-text">Why Euphoria Auto Hub</div>
              <h2 className="section-heading">More Than A Car Wash.</h2>
              <p className="section-subheading">Precision, protection and passion in every detail.</p>
            </div>
            <div className="why-grid">
              {(whyItems.length ? whyItems.map((item, index) => ({ number: item.number || String(index + 1).padStart(2, '0'), title: item.title || '', text: item.text || '' })) : WHY).map((item) => (
                <article key={item.number} className="why-card reveal">
                  <span className="why-number">{item.number}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {compare.enabled !== false && (
        <section className="compare-section">
          <div className="container">
            <div className="section-intro reveal">
              <div className="label-text">Results</div>
              <h2 className="section-heading">{compare.heading || 'See The Difference.'}</h2>
              {compare.description && <p className="section-subheading">{compare.description}</p>}
            </div>
            <BeforeAfter before={localImage(compare.before_image, '/images/service-car-wash.jpg')} after={localImage(compare.after_image || hero.image, '/images/hero-car.jpg')} />
          </div>
        </section>
        )}

        {(ppf.heading || wrap.heading) && (
          <section className="studio-pair">
            <div className="container studio-pair-grid">
              {ppf.heading && (
                <article className="studio-card reveal">
                  <div className="studio-card-image">
                    <Image src={localImage(ppf.image, '/images/service-ppf.jpg')} alt="Paint protection film" fill sizes="(max-width: 800px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div className="label-text">{ppf.label || 'Paint Protection Film'}</div>
                    <h2>{ppf.heading}</h2>
                    <p>{ppf.description}</p>
                    <Link href={ppfService ? `/services/${ppfService.slug}` : '/services'} className="text-link">Enquire about PPF <span aria-hidden="true">→</span></Link>
                  </div>
                </article>
              )}
              {wrap.heading && (
                <article className="studio-card reveal">
                  <div className="studio-card-image">
                    <Image src={localImage(wrap.image, '/images/service-wrap.jpg')} alt="Vehicle wrap at Euphoria Auto Hub" fill sizes="(max-width: 800px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                  </div>
                  <div>
                    <div className="label-text">{wrap.label || 'Vehicle Wraps'}</div>
                    <h2>{wrap.heading}</h2>
                    <p>{wrap.description}</p>
                    <WrapFinishes finishes={wrap.finishes} />
                    <Link href={wrapService ? `/services/${wrapService.slug}` : '/services'} className="text-link">{wrap.cta || 'Explore Wrap Jobs'} <span aria-hidden="true">→</span></Link>
                  </div>
                </article>
              )}
            </div>
          </section>
        )}

        {detailing.heading && (
          <section className="featured-section detailing-section">
            <div className="container">
              <div className="featured-inner">
                <div className="featured-content reveal">
                  <div className="label-text">{detailing.label || 'Detailing & Interior'}</div>
                  <h2 className="featured-title">{detailing.heading}</h2>
                  <p className="featured-description">{detailing.description}</p>
                  <Link href={detailingService ? `/services/${detailingService.slug}` : '/services'} className="btn-primary">
                    <span>{detailing.cta || 'Book Detailing'}</span><span aria-hidden="true">→</span>
                  </Link>
                </div>
                <div className="featured-image-wrap reveal">
                  <Image src={localImage(detailing.image, '/images/service-detailing.jpg')} alt="Interior detailing at Euphoria Auto Hub" fill sizes="(max-width: 968px) 100vw, 50vw" style={{ objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          </section>
        )}

        <section id="gallery" className="gallery-section">
          <div className="container">
            <div className="section-intro reveal">
              <div className="label-text">{galleryIntro.label || 'Gallery'}</div>
              <h2 className="section-heading">{galleryIntro.heading || 'Our Recent Work'}</h2>
              <p className="section-subheading">{galleryIntro.description}</p>
            </div>
            <GallerySection images={homeGallery} />
            <div className="gallery-more reveal">
              <Link href="/gallery" className="btn-outline"><span>View Gallery</span><span aria-hidden="true">→</span></Link>
            </div>
          </div>
        </section>

        <section id="about" className="about-section">
          <div className="container">
            <div className="about-inner">
              <div className="about-image-wrap reveal">
                <Image src={localImage(about.image, '/images/about-detailing.jpg')} alt="Detailing at Euphoria Auto Hub" fill sizes="(max-width: 900px) 100vw, 46vw" style={{ objectFit: 'cover' }} />
              </div>
              <div className="about-content reveal">
                <div className="label-text">About</div>
                <h2 className="section-heading">{about.heading || 'Care Driven By Precision.'}</h2>
                <p className="about-description">{about.description || 'We believe every vehicle deserves more than a basic wash. Our approach combines professional detailing techniques, premium products and attention to every surface.'}</p>
                <div className="about-badges">
                  {about.quality_badge ? <div className="badge"><div className="badge-dot" />{about.quality_badge}</div> : null}
                  {about.trust_badge ? <div className="badge"><div className="badge-dot" />{about.trust_badge}</div> : null}
                </div>
                <Link href="/contact" className="btn-primary"><span>Book Your Service</span></Link>
              </div>
            </div>
          </div>
        </section>

        <section className="process-section">
          <div className="container">
            <div className="section-intro reveal">
              <div className="label-text">Process</div>
              <h2 className="section-heading">{process.heading || 'Our Detailing Process'}</h2>
              {process.subheading ? <p className="section-subheading">{process.subheading}</p> : null}
            </div>
            <ol className="process-grid">
              {processSteps.map((step, index) => (
                <li key={`${step.number}-${step.title}`} className="process-step reveal">
                  <div className="process-step-dot">{step.number || String(index + 1).padStart(2, '0')}</div>
                  <div className="process-step-title">{step.title}</div>
                  <div className="process-step-desc">{step.description}</div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {testimonials.length > 0 && (
          <section className="testimonial-section">
            <div className="container">
              <div className="section-intro reveal">
                <div className="label-text">Clients</div>
                <h2 className="section-heading">What Owners Say</h2>
              </div>
              <div className="testimonial-grid">
                {homeTestimonials.map((item) => (
                  <figure key={item.id} className="testimonial-card reveal">
                    <div className="testimonial-stars" aria-label={`${item.rating || 5} star rating`}>{'★'.repeat(item.rating || 5)}</div>
                    <blockquote className="testimonial-text">{item.review}</blockquote>
                    <figcaption className="testimonial-author-name">{item.customer_name}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="final-cta band-dark">
          <div className="container final-cta-inner">
            <div className="label-text">Book</div>
            <h2>{finalCta.heading || 'Your Car Deserves Better.'}</h2>
            <p>{finalCta.description || 'Give your vehicle the finish and protection it deserves.'}</p>
            <div className="hero-actions">
              <Link href={safeHref(finalCta.cta_primary_link, '/contact')} className="btn-primary"><span>{finalCta.cta || 'Book Your Service'}</span></Link>
              <Link href={safeHref(finalCta.cta_secondary_link, '/contact')} className="btn-outline"><span>{finalCta.cta_secondary || 'Contact Us'}</span></Link>
            </div>
          </div>
        </section>

        <LocationSection contact={contact} location={homepage.location} />
        <ContactSection contact={contact} intro={homepage.contact_intro} />
      </main>
      <Footer contact={contact} />
    </>
  );
}
