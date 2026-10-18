import type { Metadata } from 'next';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import SiteChrome from '@/components/public/sport/SiteChrome';
import SportContact from '@/components/public/sport/SportContact';
import { getSiteData } from '@/lib/site';
import { BUSINESS, mailHref, mapsEmbedSrc, phoneHref } from '@/lib/links';
import { enquiryMessage, whatsappLink } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Contact Euphoria Auto Hub | Bavdhan, Pune Detailing Studio',
  description: 'Call, WhatsApp or visit Euphoria Auto Hub at MNO 30/2, near Ganpati Mandir, Next to True Value Showroom, Bavdhan, Pune 411021. Open 9:00 AM to 7:00 PM all 7 days.',
  alternates: { canonical: 'https://euphoriaautohub.in/contact' },
};

export default function ContactPage() {
  const { contact, services, social } = getSiteData();
  const phone = contact?.phone || BUSINESS.phone;
  const email = contact?.email || BUSINESS.email;
  const address = contact?.address || BUSINESS.address;
  const hours = contact?.hours || BUSINESS.hours;
  const wa = whatsappLink(enquiryMessage('a service'), contact?.whatsapp);

  return (
    <SiteChrome contact={contact} social={social}>
      <div className="eh-wrap" style={{ paddingTop: 28 }}>
        {/* Top Sporty Breadcrumb & Header */}
        <div style={{ maxWidth: 840 }}>
          <p className="eh-kicker">
            <span style={{ color: '#D71920', fontWeight: 800 }}>PERFORMANCE AUTOMOTIVE STUDIO</span> · BAVDHAN, PUNE
          </p>
          <h1 style={{ fontSize: 'clamp(34px, 4.8vw, 60px)', lineHeight: 1.1, margin: '8px 0 16px' }}>
            CONTACT &amp; VISIT OUR STUDIO
          </h1>
          <p style={{ fontSize: 16, color: '#4B5563', lineHeight: 1.6, margin: 0 }}>
            Experience concourse-grade vehicle detailing and paint protection film in Bavdhan, Pune. Visit our studio for a complimentary paint depth evaluation, live material demonstrations, and an itemized package quotation.
          </p>
        </div>

        {/* 4 Sport Quick-Stat Cards */}
        <div className="eh-contact-stats">
          <div className="eh-contact-stat-card">
            <div className="eh-stat-head">
              <div className="eh-stat-icon">
                <MapPin size={16} />
              </div>
              <h3>Studio Location</h3>
            </div>
            <p>Bavdhan, Pune (Near Ganpati Mandir, Next to True Value)</p>
          </div>

          <div className="eh-contact-stat-card">
            <div className="eh-stat-head">
              <div className="eh-stat-icon">
                <Phone size={16} />
              </div>
              <h3>Studio Hotline</h3>
            </div>
            <p>
              <a href={phoneHref(phone)}>{phone}</a>
              <span style={{ display: 'block', fontSize: 11, color: '#16A34A', fontWeight: 700, marginTop: 2 }}>Direct Supervisor</span>
            </p>
          </div>

          <div className="eh-contact-stat-card">
            <div className="eh-stat-head">
              <div className="eh-stat-icon">
                <MessageCircle size={16} color="#16A34A" />
              </div>
              <h3>Instant WhatsApp</h3>
            </div>
            <p>
              <a href={wa} target="_blank" rel="noopener noreferrer" style={{ color: '#16A34A' }}>
                Chat on WhatsApp &rarr;
              </a>
              <span style={{ display: 'block', fontSize: 11, color: '#6B7280', marginTop: 2 }}>Share car photos for fast quote</span>
            </p>
          </div>

          <div className="eh-contact-stat-card">
            <div className="eh-stat-head">
              <div className="eh-stat-icon">
                <Clock size={16} />
              </div>
              <h3>Studio Schedule</h3>
            </div>
            <p>
              <strong>9:00 AM – 7:00 PM</strong>
              <span style={{ display: 'block', fontSize: 11, color: '#D71920', fontWeight: 700, marginTop: 2 }}>Open All 7 Days</span>
            </p>
          </div>
        </div>

        {/* Main 2-Column Split */}
        <div className="eh-contact-split">
          {/* Left Column: Studio Details, Navigation & Perks */}
          <div>
            <div className="eh-contact-panel with-red-bar">
              <div className="eh-contact-badge-live">
                <span className="eh-pulse-dot" /> Studio Open Today · 9:00 AM – 7:00 PM
              </div>

              <h2 style={{ fontSize: 22, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
                STUDIO HEADQUARTERS &amp; ACCESS
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div className="eh-contact-detail-row">
                  <div className="eh-row-icon">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <strong>Studio Address</strong>
                    <p style={{ lineHeight: 1.5 }}>{address}</p>
                    <span style={{ fontSize: 12, color: '#6B7280', marginTop: 4, display: 'block' }}>
                      Landmark: Next to True Value Showroom, near Bavdhan Ganpati Mandir
                    </span>
                  </div>
                </div>

                <div className="eh-contact-detail-row">
                  <div className="eh-row-icon">
                    <Navigation size={18} />
                  </div>
                  <div>
                    <strong>Access Routes</strong>
                    <p style={{ fontSize: 13, color: '#4B5563' }}>
                      5 mins from Kothrud &amp; Chandani Chowk · 8 mins from Baner &amp; Pashan · Direct access off Mumbai-Bangalore Highway.
                    </p>
                  </div>
                </div>

                <div className="eh-contact-detail-row">
                  <div className="eh-row-icon">
                    <Phone size={18} />
                  </div>
                  <div>
                    <strong>Workshop &amp; Booking Phone</strong>
                    <p>
                      <a href={phoneHref(phone)} style={{ color: '#D71920', fontWeight: 700, fontSize: 15 }}>
                        {phone}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="eh-contact-detail-row">
                  <div className="eh-row-icon">
                    <Mail size={18} />
                  </div>
                  <div>
                    <strong>Email Correspondence</strong>
                    <p>
                      <a href={mailHref(email)}>{email}</a>
                    </p>
                  </div>
                </div>

                <div className="eh-contact-detail-row">
                  <div className="eh-row-icon">
                    <Clock size={18} />
                  </div>
                  <div>
                    <strong>Working Hours</strong>
                    <p>{hours} (Monday through Sunday)</p>
                  </div>
                </div>
              </div>

              <div className="eh-actions" style={{ marginTop: 24, gap: 10 }}>
                <a
                  className="eh-btn"
                  href={contact?.maps_url || BUSINESS.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <MapPin size={16} /> GOOGLE MAPS ROUTE
                </a>
                <a
                  className="eh-btn-wa"
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ flex: 1, justifyContent: 'center' }}
                >
                  <MessageCircle size={16} color="#128C7E" /> CHAT ON WHATSAPP
                </a>
              </div>
            </div>

            {/* Interactive Map Box */}
            <div className="eh-map-card">
              <div
                style={{
                  padding: '12px 18px',
                  background: '#F9FAFB',
                  borderBottom: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 700, color: '#17191D' }}>
                  <MapPin size={15} color="#D71920" />
                  <span>Interactive Studio Location Map</span>
                </div>
                <a
                  href={contact?.maps_url || BUSINESS.maps}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#D71920', fontWeight: 600, textDecoration: 'none' }}
                >
                  <span>Open Fullscreen</span>
                  <ExternalLink size={12} />
                </a>
              </div>
              <iframe
                title="Google Maps Location of Euphoria Auto Hub, Bavdhan, Pune"
                src={contact?.maps_embed && /^https:\/\//i.test(contact.maps_embed) ? contact.maps_embed : mapsEmbedSrc(address)}
                style={{ width: '100%', height: 280, border: 0 }}
                loading="lazy"
                allowFullScreen
              />
            </div>

            {/* In-Studio Inspection Perks */}
            <div className="eh-contact-perks-box">
              <h4>
                <ShieldCheck size={16} color="#D71920" /> COMPLIMENTARY ON-SITE INSPECTION
              </h4>
              <div className="eh-contact-perk-item">
                <CheckCircle2 size={15} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  <strong>Digital Paint Depth Gauge Check:</strong> We measure clear coat thickness in microns across every metal panel before recommending treatment.
                </span>
              </div>
              <div className="eh-contact-perk-item">
                <CheckCircle2 size={15} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  <strong>Dual-Color Swirl Inspection:</strong> High-CRI lighting reveals micro-scratches, buffer trails, and oxidation invisible under sunlight.
                </span>
              </div>
              <div className="eh-contact-perk-item">
                <CheckCircle2 size={15} color="#16A34A" style={{ flexShrink: 0, marginTop: 2 }} />
                <span>
                  <strong>Live Material Demonstration:</strong> Touch &amp; see self-healing TPU PPF, matte film, and 10H hydrophobic ceramic coatings on real panels.
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Direct Online Enquiry Card */}
          <div>
            <div className="eh-contact-panel with-red-bar">
              <span className="eh-kicker">SEND AN ONLINE MESSAGE</span>
              <h2 style={{ fontSize: 24, margin: '4px 0 8px', letterSpacing: '-0.01em' }}>
                DIRECT ENQUIRY FORM
              </h2>
              <p style={{ fontSize: 14, color: '#4B5563', margin: '0 0 20px', lineHeight: 1.5 }}>
                Share your vehicle make, model, and the care it requires. Our studio supervisor will promptly respond with tailored recommendations and available slots.
              </p>

              <SportContact services={services.map((service) => service.name)} />

              <div
                style={{
                  marginTop: 22,
                  paddingTop: 18,
                  borderTop: '1px solid #E5E7EB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 12,
                  fontSize: 12,
                  color: '#6B7280',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <ShieldCheck size={14} color="#16A34A" />
                  <span>100% Privacy · No Spam Guarantee</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Star size={14} color="#F59E0B" fill="#F59E0B" />
                  <span>4.9/5 Rating in Bavdhan, Pune</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Studio Visit FAQ Section */}
        <section style={{ marginTop: 64, marginBottom: 40 }}>
          <p className="eh-kicker">FREQUENTLY ASKED QUESTIONS</p>
          <h2 style={{ fontSize: 'clamp(26px, 3.2vw, 36px)', margin: '4px 0 10px' }}>
            STUDIO VISITS &amp; DETAILING QUESTIONS
          </h2>
          <p style={{ color: '#4B5563', fontSize: 15, maxWidth: 640 }}>
            Common questions from vehicle owners across Pune visiting Euphoria Auto Hub for the first time.
          </p>

          <div className="eh-contact-faq-grid">
            <div className="eh-contact-faq-card">
              <h4>Do I need an advance appointment for vehicle inspection?</h4>
              <p>
                Walk-ins are always welcome during studio hours (9:00 AM – 7:00 PM) for quick paint inspections and wash evaluations. For multi-day services like Paint Protection Film or Ceramic Coating, pre-booking guarantees an immediate detailing bay.
              </p>
            </div>

            <div className="eh-contact-faq-card">
              <h4>How long does a complete PPF or Ceramic Coating take?</h4>
              <p>
                A full-body TPU PPF installation typically requires 2 to 3 days to allow precise edge-wrapping and post-application curing. Multi-layer Ceramic or Graphene Coating takes 24 to 36 hours including paint correction and infrared heating.
              </p>
            </div>

            <div className="eh-contact-faq-card">
              <h4>Can I inspect materials and finishes before deciding?</h4>
              <p>
                Yes! We maintain live demonstration hoods in our Bavdhan studio showing ultra-gloss TPU PPF, satin matte PPF, and the hydrophobic contact-angle bead of our ceramic formulations so you can make an informed choice.
              </p>
            </div>

            <div className="eh-contact-faq-card">
              <h4>Do you offer vehicle pick-up and drop-off in Pune?</h4>
              <p>
                Yes. For booked detailing, coating, and PPF packages, we provide secure and insured vehicle pick-up and drop-off across Bavdhan, Kothrud, Baner, Pashan, Wakad, and Hinjewadi upon request.
              </p>
            </div>
          </div>
        </section>
      </div>
    </SiteChrome>
  );
}
