import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, ChevronRight, Clock, Droplets, HelpCircle, MapPin, MessageCircle, Phone, Shield, ShieldCheck, Sparkles, Star, Wrench, Zap } from 'lucide-react';
import SiteChrome from '@/components/public/sport/SiteChrome';
import Finder from '@/components/public/sport/Finder';
import Reveal from '@/components/public/sport/Reveal';
import CompareSlider from '@/components/public/sport/CompareSlider';
import SportContact from '@/components/public/sport/SportContact';
import BrandLogos from '@/components/public/sport/BrandLogos';
import { getSiteData } from '@/lib/site';
import { BUSINESS, isStoredImage, localImage, mailHref, mapsEmbedSrc, phoneHref } from '@/lib/links';
import { enquiryMessage, whatsappLink } from '@/lib/whatsapp';
import { FAQS, PACKAGES } from '@/lib/serviceCatalog';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const { seo } = getSiteData();
  const title = seo?.title || 'Euphoria Auto Hub | Premium Automotive Care & Detailing in Pune';
  const description = seo?.description || 'Premium car detailing, ceramic and graphene coatings, paint protection film (PPF), wraps and professional foam wash at Euphoria Auto Hub, Bavdhan, Pune.';
  return {
    title: { absolute: title },
    description,
    keywords: seo?.keywords || 'car detailing pune, ceramic coating pune, graphene coating pune, ppf pune, car wash bavdhan, car wrap pune',
    alternates: { canonical: 'https://euphoriaautohub.in' },
    openGraph: { title, description, url: 'https://euphoriaautohub.in', images: ['/images/hero-car.jpg'] },
  };
}

const WHY_BLOCKS = [
  { title: 'Premium Automotive Care', text: 'Tailored multi-stage care planned around the specific paint, finish, and condition of your vehicle.' },
  { title: 'Attention to Detail', text: 'Every body line, alloy crevice, glass panel, and cabin surface is treated with methodical studio precision.' },
  { title: 'Paint-Safe Preparation', text: 'Decontamination washes, pH-balanced formulas, and ultra-plush microfiber protocols to protect your clear coat.' },
  { title: 'Protection-Focused Services', text: 'Engineered ceramic, graphene, and high-tensile paint protection films for real-world environmental defense.' },
  { title: 'A Considered Studio Process', text: 'A transparent five-step workflow: inspect, prepare, detail, protect, and thorough final inspection.' },
  { title: 'Customer-Focused Enquiries', text: 'Clear scopes of work, honest recommendations, and confirmed timing with no rushed bay turnaround.' },
];

const PROCESS_STEPS = [
  { step: '01', title: 'INSPECT', text: 'Understand the vehicle’s condition and the customer’s requirements before recommending the appropriate scope.' },
  { step: '02', title: 'PREPARE', text: 'Prepare the vehicle and relevant surfaces with multi-stage paint-safe decontamination and masking.' },
  { step: '03', title: 'DETAIL', text: 'Perform the agreed precision cleaning, cabin sanitization, and machine paint correction.' },
  { step: '04', title: 'PROTECT', text: 'Apply the selected ceramic coating, graphene layer, protective film, or wrap under controlled studio conditions.' },
  { step: '05', title: 'FINAL CHECK', text: 'Review the work under multi-angle inspection lighting and complete a comprehensive handover.' },
];

export default function HomePage() {
  const { homepage, services, gallery, testimonials, contact, packages, faqs, beforeAfter, social } = getSiteData();
  const hero = homepage.hero || {};
  const pair = beforeAfter.find((item) => isStoredImage(item.before_image) && isStoredImage(item.after_image));
  const compareBefore = pair?.before_image || homepage.compare?.before_image;
  const compareAfter = pair?.after_image || homepage.compare?.after_image;
  const showCompare = isStoredImage(compareBefore) && isStoredImage(compareAfter);
  const heroImage = localImage(hero.image, '/images/hero-car.jpg');
  const requestedVideo = typeof hero.video === 'string' ? hero.video.trim() : '';
  const validLocalVideo = /^\/(?:uploads|videos)\/[A-Za-z0-9._-]+\.(?:mp4|webm)$/i.test(requestedVideo);
  const validRemoteVideo = /^https:\/\/[^\s]+$/i.test(requestedVideo) && /\.(?:mp4|webm)(?:[?#].*)?$/i.test(requestedVideo);
  const heroVideo = validLocalVideo || validRemoteVideo ? requestedVideo : '/videos/euphoria-hero.mp4';
  const heroVideoType = /\.webm(?:[?#]|$)/i.test(heroVideo) ? 'video/webm' : 'video/mp4';
  const questions = faqs.length ? faqs.map((item) => ({ q: item.question, a: item.answer })) : FAQS;
  const packageCards = packages.length ? packages : PACKAGES.map((item, index) => ({ id: index, name: item.name, short_description: item.text, price: '', show_price: 0, cta: 'Get a Quote', cta_link: '/contact' }));
  const homeGallery = gallery.filter((item) => item.show_on_home !== 0).slice(0, 8);
  const phone = contact?.phone || BUSINESS.phone;
  const email = contact?.email || BUSINESS.email;
  const address = contact?.address || BUSINESS.address;
  const hours = contact?.hours || BUSINESS.hours;
  const wa = whatsappLink(enquiryMessage('a service'), contact?.whatsapp);
  const reviews = testimonials.filter((item) => item.show_on_home !== 0);

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    name: 'Euphoria Auto Hub',
    url: 'https://euphoriaautohub.in',
    telephone: phone,
    email,
    image: 'https://euphoriaautohub.in/images/hero-car.jpg',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'MNO 30/2, Near Ganpati Mandir, Next to True Value Showroom',
      addressLocality: 'Bavdhan',
      addressRegion: 'Maharashtra',
      postalCode: '411021',
      addressCountry: 'IN',
    },
    openingHours: 'Mo-Su 09:00-19:00',
    areaServed: ['Bavdhan', 'Kothrud', 'Warje', 'Baner', 'Aundh', 'Pashan', 'Paud Road', 'Pune'],
    hasMap: contact?.maps_url || BUSINESS.maps,
  };

  return (
    <SiteChrome contact={contact} social={social}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      {/* ---------------- 3. CINEMATIC SPORTY HERO SECTION WITH VIDEO BACKGROUND ---------------- */}
      <section className="eh-hero" id="home">
        {/* Full-bleed background video of car */}
        <div className="eh-hero-bg-video-wrap" aria-hidden="true">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            poster="/images/hero-car.jpg"
            className="eh-hero-bg-video"
          >
            <source src="/videos/hero-car.mp4" type="video/mp4" />
          </video>
          <div className="eh-hero-gradient-overlay" />
          <div className="eh-hero-grid-pattern" />
        </div>

        <div className="eh-wrap eh-hero-grid">
          <div className="eh-hero-copy">
            <Reveal>
              <div className="eh-kicker-pill">
                <span className="eh-kicker-dot" />
                <span>BAVDHAN, PUNE · PERFORMANCE DETAILING STUDIO</span>
              </div>
              <h1 className="eh-hero-title">
                <span className="title-line">YOUR CAR.</span>
                <span className="title-line red">YOUR STYLE.</span>
                <span className="title-line">YOUR PRECISION.</span>
              </h1>
              <div className="eh-hero-subheading">
                <Sparkles size={18} color="#E31B23" /> MORE THAN A WASH. IT&apos;S A MASTERPIECE FINISH.
              </div>
              <p className="eh-hero-description">
                Concourse-grade paint restoration, 10H ceramic &amp; graphene coatings, self-healing TPU PPF, and bespoke styling wraps engineered specifically for Pune&apos;s driving conditions.
              </p>
              <div className="eh-actions">
                <Link className="eh-btn" href="/booking">
                  BOOK A SERVICE <ArrowRight size={16} />
                </Link>
                <a className="eh-btn-ghost-dark" href="#services">
                  EXPLORE SERVICES
                </a>
                <a className="eh-btn-wa" href={wa} target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={16} color="#128C7E" /> CHAT ON WHATSAPP
                </a>
              </div>

              <div className="eh-hero-trust-grid">
                <div className="eh-hero-trust-badge">
                  <div className="badge-icon">
                    <MapPin size={15} color="#E31B23" />
                  </div>
                  <div>
                    <strong>Studio in Bavdhan</strong>
                    <span>Pune · Dedicated Detailing Bay</span>
                  </div>
                </div>

                <div className="eh-hero-trust-badge">
                  <div className="badge-icon">
                    <ShieldCheck size={15} color="#E31B23" />
                  </div>
                  <div>
                    <strong>Specialist Protection</strong>
                    <span>PPF, Ceramic &amp; Graphene</span>
                  </div>
                </div>

                <div className="eh-hero-trust-badge">
                  <div className="badge-icon">
                    <Sparkles size={15} color="#E31B23" />
                  </div>
                  <div>
                    <strong>Precision Standards</strong>
                    <span>Multi-Stage Decontamination</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Floating Detailing HUD Video Card */}
          <div className="eh-hero-hud" aria-label="Live detailing studio showcase">
            <div className="eh-hud-header">
              <div className="eh-hud-rec">
                <span className="eh-hud-rec-dot" />
                <span>STUDIO REEL · DETAILING BAY 01</span>
              </div>
              <span className="eh-hud-quality">4K · 60FPS</span>
            </div>

            <div className="eh-hud-video-frame">
              <video
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                poster="/images/about-detailing.jpg"
              >
                <source src="/videos/trailer-2.mp4" type="video/mp4" />
              </video>
              <div className="eh-hud-video-badge">
                <Sparkles size={12} color="#E31B23" />
                <span>ACTIVE PAINT RESTORATION</span>
              </div>
            </div>

            <div className="eh-hud-telemetry">
              <div className="eh-hud-stat">
                <div className="eh-hud-stat-icon">
                  <Shield size={14} />
                </div>
                <div>
                  <span className="eh-hud-stat-label">Protection</span>
                  <span className="eh-hud-stat-value">10H GRAPHENE</span>
                </div>
              </div>

              <div className="eh-hud-stat">
                <div className="eh-hud-stat-icon">
                  <Sparkles size={14} />
                </div>
                <div>
                  <span className="eh-hud-stat-label">Gloss Meter</span>
                  <span className="eh-hud-stat-value">98+ GU CONCOURSE</span>
                </div>
              </div>

              <div className="eh-hud-stat">
                <div className="eh-hud-stat-icon">
                  <Zap size={14} />
                </div>
                <div>
                  <span className="eh-hud-stat-label">Film Spec</span>
                  <span className="eh-hud-stat-value">195µm TPU PPF</span>
                </div>
              </div>

              <div className="eh-hud-stat">
                <div className="eh-hud-stat-icon">
                  <Droplets size={14} />
                </div>
                <div>
                  <span className="eh-hud-stat-label">Hydrophobic</span>
                  <span className="eh-hud-stat-value">115° CONTACT</span>
                </div>
              </div>
            </div>

            <div className="eh-hud-footer">
              <span>Bavdhan Detailing Studio</span>
              <strong>EUPHORIA AUTO HUB · PUNE</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- 3.5 MULTI-BRAND VEHICLE SHOWCASE ---------------- */}
      <BrandLogos />

      {/* ---------------- Studio Standards Bar ---------------- */}
      <div className="eh-trust-bar">
        <div className="eh-wrap eh-trust">
          <div className="eh-trust-item">
            <strong>Premium Detailing</strong>
            <p>Studio-grade correction & finish</p>
          </div>
          <div className="eh-trust-item">
            <strong>Bavdhan, Pune</strong>
            <p>One dedicated studio location</p>
          </div>
          <div className="eh-trust-item">
            <strong>Paint-Safe Care</strong>
            <p>Multi-stage pH-neutral protocol</p>
          </div>
          <div className="eh-trust-item">
            <strong>Ceramic & PPF</strong>
            <p>High-durability clear protection</p>
          </div>
          <div className="eh-trust-item">
            <strong>Considered Process</strong>
            <p>Confirmed scopes & handover check</p>
          </div>
        </div>
      </div>

      {/* ---------------- 6. SPORTY SERVICES SECTION ---------------- */}
      <section className="eh-section eh-wrap" id="services">
        <Reveal>
          <p className="eh-kicker">PERFORMANCE & PROTECTION</p>
          <h2>BUILT FOR THE WAY YOU DRIVE.</h2>
          <p style={{ maxWidth: 720 }}>
            From a clean, refined finish to advanced paint protection, choose the care your vehicle needs.
          </p>
        </Reveal>

        <div className="eh-services" style={{ marginTop: 32 }}>
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

      {/* ---------------- 7. FEATURED PROTECTION EDITORIAL SECTIONS ---------------- */}

      {/* Featured Section 1: Ceramic & Graphene Coatings (Light Grey #F4F5F7) */}
      <section className="eh-section eh-section-alt" id="coatings">
        <div className="eh-wrap eh-feature-split">
          <div>
            <p className="eh-kicker">ADVANCED SURFACE SHIELD</p>
            <h2>CERAMIC & GRAPHENE COATINGS</h2>
            <p>
              A professional ceramic or graphene coating bonds at the molecular level, creating a crystal-clear, durable layer of protection over your clear coat. It enhances gloss depth, provides strong hydrophobic water-repelling properties, and makes everyday maintenance significantly easier.
            </p>
            <div className="eh-feature-bullets">
              <div className="eh-bullet">
                <strong>Hydrophobic Action</strong>
                <p>Water and road grime bead off effortlessly, keeping your paint cleaner for longer.</p>
              </div>
              <div className="eh-bullet">
                <strong>Deep Optical Clarity</strong>
                <p>Enriches paint depth and creates a showroom wet-look reflection.</p>
              </div>
              <div className="eh-bullet">
                <strong>UV & Oxidation Defense</strong>
                <p>Helps protect delicate clear coat from premature fading under harsh sun exposure.</p>
              </div>
              <div className="eh-bullet">
                <strong>Easier Maintenance</strong>
                <p>Reduces wash effort and prevents dirt from bonding directly to the paintwork.</p>
              </div>
            </div>
            <div className="eh-actions">
              <Link className="eh-btn" href="/booking?service=Ceramic%20%26%20Graphene%20Coatings">
                ENQUIRE ABOUT COATINGS
              </Link>
              <Link className="eh-btn-ghost" href="/services/ceramic-graphene-coatings">
                VIEW DETAILS
              </Link>
            </div>
          </div>
          <div className="eh-feature-media">
            <Image src="/images/service-ceramic.jpg" alt="Ceramic coating gloss reflection" fill sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      {/* Featured Section 2: Paint Protection Film (PPF) (Dark Feature Section #17191D) */}
      <section className="eh-section eh-section-dark" id="ppf">
        <div className="eh-wrap eh-feature-split reverse">
          <div>
            <p className="eh-kicker">PERFORMANCE ARMOUR</p>
            <h2>PAINT PROTECTION FILM (PPF)</h2>
            <p>
              Paint Protection Film (PPF) is an optically clear, high-tensile polyurethane film engineered to shield vehicle paintwork from harsh road debris, high-speed stone chips, minor surface scratches, and environmental abrasions without compromising the vehicle&apos;s natural look.
            </p>
            <div className="eh-feature-bullets">
              <div className="eh-bullet">
                <strong>Stone Chip Defense</strong>
                <p>Absorbs kinetic impact from gravel and highway debris to preserve original factory paint.</p>
              </div>
              <div className="eh-bullet">
                <strong>Self-Healing Clarity</strong>
                <p>Light swirl marks and micro-scratches dissipate under warm ambient sunlight.</p>
              </div>
              <div className="eh-bullet">
                <strong>Stain & Chemical Barrier</strong>
                <p>Protects clear coat from bird droppings, bug splatter, and harsh chemical fallout.</p>
              </div>
              <div className="eh-bullet">
                <strong>Resale Value Preservation</strong>
                <p>Guards OEM paint panels in untouched condition for maximum future value.</p>
              </div>
            </div>
            <div className="eh-actions">
              <Link className="eh-btn" href="/booking?service=Paint%20Protection%20Film%20(PPF)">
                GET A PPF QUOTE
              </Link>
              <Link className="eh-btn-ghost" href="/services/paint-protection-film">
                PPF PACKAGES
              </Link>
            </div>
          </div>
          <div className="eh-feature-media">
            <Image src="/images/service-ppf.jpg" alt="Paint Protection Film installation at Euphoria Auto Hub" fill sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      {/* Featured Section 3: Vehicle Wraps (Light Section) */}
      <section className="eh-section eh-wrap" id="wraps">
        <Reveal>
          <p className="eh-kicker">CUSTOM AESTHETICS</p>
          <h2>VEHICLE WRAPS & CUSTOM FINISHES</h2>
          <p style={{ maxWidth: 740 }}>
            Change your car&apos;s character or accentuate individual panels. Professional vinyl wraps provide complete aesthetic transformation while safely preserving the factory paint beneath.
          </p>
        </Reveal>

        <div className="wrap-finishes-grid">
          <div className="wrap-finish-card">
            <div className="wrap-swatch" style={{ background: 'linear-gradient(135deg, #1E293B, #0F172A)' }} />
            <h4>GLOSS FINISH</h4>
            <p>Deep mirror reflection mimicking high-end factory gloss paint.</p>
          </div>
          <div className="wrap-finish-card">
            <div className="wrap-swatch" style={{ background: 'linear-gradient(135deg, #475569, #334155)' }} />
            <h4>MATTE FINISH</h4>
            <p>Non-reflective, stealth aesthetic that highlights car body contour lines.</p>
          </div>
          <div className="wrap-finish-card">
            <div className="wrap-swatch" style={{ background: 'linear-gradient(135deg, #64748B, #475569)' }} />
            <h4>SATIN FINISH</h4>
            <p>The refined sweet spot between gloss and matte with a silky metallic sheen.</p>
          </div>
          <div className="wrap-finish-card">
            <div className="wrap-swatch" style={{ background: 'linear-gradient(135deg, #D71920, #991B1B)' }} />
            <h4>CUSTOM & ACCENTS</h4>
            <p>Roof wraps, de-chroming, racing stripes, and custom two-tone designs.</p>
          </div>
        </div>

        <div className="eh-actions" style={{ justifyContent: 'center', marginTop: 24 }}>
          <Link className="eh-btn" href="/booking?service=Wrap%20Jobs">
            DISCUSS A WRAP PROJECT
          </Link>
          <Link className="eh-btn-ghost" href="/services/wrap-jobs">
            EXPLORE WRAP DETAILS
          </Link>
        </div>
      </section>

      {/* Featured Section 4: Detailing & Interior Care (Light Alternate #F4F5F7) */}
      <section className="eh-section eh-section-alt" id="detailing">
        <div className="eh-wrap eh-feature-split">
          <div>
            <p className="eh-kicker">INTERIOR CRAFTSMANSHIP & CORRECTION</p>
            <h2>DETAILING & INTERIOR RESTORATION</h2>
            <p>
              True automotive detailing restores both the cockpit and exterior body panels. Our interior deep-cleaning protocol includes upholstery extraction, leather conditioning, dashboard sanitization, and antibacterial treatment for a pristine, showroom cabin.
            </p>
            <div className="eh-feature-bullets">
              <div className="eh-bullet">
                <strong>Upholstery Extraction</strong>
                <p>Deep vacuum and steam extraction of carpets, floor mats, and fabric seats.</p>
              </div>
              <div className="eh-bullet">
                <strong>Leather Conditioning</strong>
                <p>Gentle cleaning followed by nourishing conditioners to prevent creasing and drying.</p>
              </div>
              <div className="eh-bullet">
                <strong>Cabin Sanitization</strong>
                <p>Anti-microbial treatment of vents, buttons, center console, and steering controls.</p>
              </div>
              <div className="eh-bullet">
                <strong>Machine Correction</strong>
                <p>Dual-action machine polishing to safely eliminate micro-marring and swirl marks.</p>
              </div>
            </div>
            <div className="eh-actions">
              <Link className="eh-btn" href="/booking?service=Detailing%20%26%20Interior%20Cleaning">
                BOOK CABIN DETAILING
              </Link>
              <Link className="eh-btn-ghost" href="/services/detailing-interior-cleaning">
                SERVICE SCOPE
              </Link>
            </div>
          </div>
          <div className="eh-feature-media">
            <Image src="/images/service-detailing.jpg" alt="Cabin detailing and interior cleaning" fill sizes="(max-width: 1024px) 100vw, 50vw" />
          </div>
        </div>
      </section>

      {/* ---------------- Interactive Service Selector / Finder ---------------- */}
      <section className="eh-section eh-wrap" id="selector">
        <Reveal>
          <p className="eh-kicker">INTERACTIVE SELECTOR</p>
          <h2>WHAT DOES YOUR CAR NEED?</h2>
          <p style={{ maxWidth: 640 }}>
            Select your car’s current condition or main goal to get an instant studio recommendation.
          </p>
        </Reveal>
        <div style={{ marginTop: 24 }}>
          <Finder />
        </div>
      </section>

      {/* ---------------- 9. WHY EUPHORIA ---------------- */}
      <section className="eh-section eh-section-alt" id="why">
        <div className="eh-wrap">
          <Reveal>
            <p className="eh-kicker">STUDIO ETHOS</p>
            <h2>DETAILS MATTER. EVERY PANEL.</h2>
            <p style={{ maxWidth: 720 }}>
              Euphoria Auto Hub was established to deliver precision car care without compromise. We focus on technique, verified products, and clear communication.
            </p>
          </Reveal>
          <div className="eh-why-grid" style={{ marginTop: 32 }}>
            {WHY_BLOCKS.map((item) => (
              <article key={item.title}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Wrench size={18} color="#D71920" />
                  <h3 style={{ margin: 0 }}>{item.title}</h3>
                </div>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 10. DETAILING PROCESS ---------------- */}
      <section className="eh-section eh-wrap" id="process">
        <Reveal>
          <p className="eh-kicker">METHODICAL WORKFLOW</p>
          <h2>OUR FIVE-STEP STUDIO PROCESS</h2>
          <p style={{ maxWidth: 720 }}>
            Every vehicle enters our Bavdhan bay through a disciplined protocol designed to ensure repeatable, pristine outcomes.
          </p>
        </Reveal>
        <div className="eh-process" style={{ marginTop: 36 }}>
          {PROCESS_STEPS.map((item) => (
            <article key={item.step}>
              <div className="eh-process-step-num">{item.step}</div>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- 8. BEFORE & AFTER WORK COMPARE ---------------- */}
      <section className="eh-section eh-section-alt" id="work">
        <div className="eh-wrap">
          <Reveal>
            <p className="eh-kicker">TRANSFORMATION</p>
            <h2>THE EUPHORIA FINISH</h2>
            <p style={{ maxWidth: 720 }}>
              {pair?.description || 'Studio photographs highlighting the difference between a dirty, decontaminated surface and a protected, finished panel.'}
            </p>
          </Reveal>
          <div style={{ marginTop: 28 }}>
            {showCompare ? (
              <CompareSlider
                before={localImage(compareBefore, '/images/hero-car.jpg')}
                after={localImage(compareAfter, '/images/hero-car.jpg')}
                beforeLabel="INITIAL"
                afterLabel="FINISHED"
              />
            ) : (
              <div className="eh-empty" role="status">
                Verified studio before-and-after photograph pairs will appear here as customer projects are documented.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ---------------- 11. PACKAGES AND BOOKING ---------------- */}
      <section className="eh-section eh-wrap" id="packages">
        <Reveal>
          <p className="eh-kicker">TIERED CARE</p>
          <h2>STUDIO CARE PACKAGES</h2>
          <p style={{ maxWidth: 720 }}>
            Structured packages catering to vehicle maintenance, deep restoration, and advanced surface protection.
          </p>
        </Reveal>
        <div className="eh-packages" style={{ marginTop: 32 }}>
          {packageCards.map((item, idx) => (
            <article key={item.name} className={`eh-package${idx === 2 ? ' featured' : ''}`}>
              <h3>{item.name}</h3>
              <p>{item.short_description}</p>
              <div className="eh-quote">
                {item.show_price && item.price ? item.price : 'CONTACT US FOR PRICING'}
              </div>
              <Link className="eh-btn" href={item.cta_link || `/contact?package=${encodeURIComponent(item.name)}`}>
                {item.cta || 'Get a Quote'}
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* ---------------- 8. GALLERY ---------------- */}
      {homeGallery.length > 0 && (
        <section className="eh-section eh-section-alt" id="gallery">
          <div className="eh-wrap">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p className="eh-kicker">STUDIO WORK</p>
                <h2>OUR RECENT WORK</h2>
                <p>Authentic photographs of detailing, ceramic coatings, and wrap jobs completed at our Bavdhan studio.</p>
              </div>
              <Link className="eh-btn-ghost" href="/gallery">
                VIEW FULL GALLERY →
              </Link>
            </div>
            <div className="eh-gallery-grid" style={{ marginTop: 28 }}>
              {homeGallery.map((image) => (
                <Link key={image.id} href="/gallery" className="eh-shot">
                  <Image src={localImage(image.image_url, '/images/hero-car.jpg')} alt={image.alt_text || image.title} fill sizes="(max-width: 720px) 100vw, 25vw" />
                  <div className="eh-shot-caption">
                    <span>{image.category}</span>
                    <strong>{image.title}</strong>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- 12. REVIEWS & TRUST ---------------- */}
      <section className="eh-section eh-wrap" id="reviews">
        <Reveal>
          <p className="eh-kicker">VERIFIED FEEDBACK</p>
          <h2>WHAT CAR OWNERS SAY</h2>
          <p style={{ maxWidth: 640 }}>Genuine feedback from vehicle owners who have experienced Euphoria studio care.</p>
        </Reveal>
        <div style={{ marginTop: 28 }}>
          {reviews.length === 0 ? (
            <div className="eh-empty" role="status">
              Verified customer reviews will appear here once published from the admin panel.
            </div>
          ) : (
            <div className="eh-services" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
              {reviews.map((review) => (
                <article key={review.id} className="eh-review">
                  <div className="eh-stars">{'★'.repeat(review.rating || 5)}</div>
                  <p>&ldquo;{review.review}&rdquo;</p>
                  <strong>{review.customer_name}</strong>
                  {review.service_name && <span style={{ fontSize: 12, color: '#D71920', fontWeight: 600 }}>{review.service_name}</span>}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------- 14. DRAMATIC FINAL CALL TO ACTION ---------------- */}
      <section className="eh-section eh-section-dark">
        <div className="eh-wrap" style={{ textAlign: 'center', maxWidth: 840 }}>
          <p className="eh-kicker" style={{ justifyContent: 'center' }}>BAVDHAN STUDIO</p>
          <h2 style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', color: '#FFFFFF' }}>BOOK YOUR CAR IN FOR PRECISION CARE.</h2>
          <p style={{ color: '#D1D5DB', fontSize: 16, margin: '14px 0 28px' }}>
            Tell our detailing specialists what your car needs. We confirm the exact scope, duration, and quote before any work begins.
          </p>
          <div className="eh-actions" style={{ justifyContent: 'center' }}>
            <Link className="eh-btn" href="/booking">
              BOOK A SERVICE APPOINTMENT <ArrowRight size={16} />
            </Link>
            <a className="eh-btn-wa" href={wa} target="_blank" rel="noopener noreferrer">
              <MessageCircle size={16} color="#128C7E" /> CHAT ON WHATSAPP
            </a>
            <a className="eh-btn-ghost" href={phoneHref(phone)}>
              <Phone size={14} /> CALL {phone}
            </a>
          </div>
        </div>
      </section>

      {/* ---------------- 13. LOCATION & CONTACT ---------------- */}
      <section className="eh-section eh-wrap" id="visit">
        <div className="eh-feature-split">
          <div>
            <p className="eh-kicker">STUDIO LOCATION</p>
            <h2>VISIT OUR STUDIO</h2>
            <p><strong style={{ color: '#141414' }}>Address:</strong> {address}</p>
            <p><strong style={{ color: '#141414' }}>Operating Hours:</strong> {hours}</p>
            <p><strong style={{ color: '#141414' }}>Direct Phone:</strong> <a href={phoneHref(phone)} style={{ color: '#D71920', fontWeight: 600 }}>{phone}</a></p>
            <p><strong style={{ color: '#141414' }}>Email:</strong> <a href={mailHref(email)} style={{ color: '#141414' }}>{email}</a></p>

            <div className="eh-actions" style={{ marginTop: 20 }}>
              <a className="eh-btn" href={contact?.maps_url || BUSINESS.maps} target="_blank" rel="noopener noreferrer">
                <MapPin size={16} /> GET DIRECTIONS
              </a>
              <a className="eh-btn-wa" href={wa} target="_blank" rel="noopener noreferrer">
                <MessageCircle size={16} color="#128C7E" /> WHATSAPP
              </a>
            </div>

            <div className="eh-map-card">
              <iframe
                title="Euphoria Auto Hub on Google Maps"
                src={contact?.maps_embed && /^https:\/\//i.test(contact.maps_embed) ? contact.maps_embed : mapsEmbedSrc(address)}
                style={{ width: '100%', height: 280, border: 0 }}
                loading="lazy"
              />
            </div>
          </div>

          <div>
            <p className="eh-kicker">DIRECT ENQUIRY</p>
            <h3 style={{ fontSize: 26, margin: '6px 0 14px' }}>SEND A MESSAGE TO THE TEAM</h3>
            <p>Share your vehicle model and requested service. We will respond promptly with details.</p>
            <div style={{ marginTop: 18 }}>
              <SportContact services={services.map((service) => service.name)} />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FAQs SECTION ---------------- */}
      <section className="eh-section eh-section-alt" id="faq">
        <div className="eh-wrap" style={{ maxWidth: 900 }}>
          <p className="eh-kicker">CLARITY</p>
          <h2>QUESTIONS, ANSWERED PLAINLY.</h2>
          <div style={{ marginTop: 24, display: 'grid', gap: 12 }}>
            {questions.map((item) => (
              <article key={item.q} className="eh-book" style={{ padding: '20px 24px' }}>
                <h3 style={{ fontSize: 18, color: '#141414', margin: '0 0 6px' }}>{item.q}</h3>
                <p style={{ margin: 0 }}>{item.a}</p>
              </article>
            ))}
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: questions.map((item) => ({
                  '@type': 'Question',
                  name: item.q,
                  acceptedAnswer: { '@type': 'Answer', text: item.a },
                })),
              }),
            }}
          />
        </div>
      </section>
    </SiteChrome>
  );
}
