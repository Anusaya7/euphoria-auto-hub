'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, ChevronRight, Clock, MapPin, Menu, MessageCircle, Phone, ShieldCheck, Sparkles, Star, X } from 'lucide-react';
import { track } from '@/lib/analytics';
import type { ContactInfo, PublicSocial } from '@/lib/types';
import { BUSINESS, mailHref, phoneHref } from '@/lib/links';
import { bookingMessage, enquiryMessage, whatsappLink } from '@/lib/whatsapp';

const LINKS = [
  ['/#home', 'Home'],
  ['/#services', 'Services'],
  ['/#why', 'Why Us'],
  ['/#gallery', 'Gallery'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

export default function SiteChrome({ contact, social = [], children }: { contact?: ContactInfo; social?: PublicSocial[]; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [chat, setChat] = useState(false);
  const phone = contact?.phone || BUSINESS.phone;
  const email = contact?.email || BUSINESS.email;
  const address = contact?.address || BUSINESS.address;
  const hours = contact?.hours || BUSINESS.hours;
  const wa = whatsappLink(enquiryMessage('a service'), contact?.whatsapp);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="eh-site">
      <header className={`eh-nav${scrolled ? ' scrolled' : ''}${open ? ' open' : ''}`}>
        <Link href="/" className="eh-brand" onClick={() => setOpen(false)}>
          <span className="eh-brand-name">EUPHORIA <span>AUTO</span> HUB</span>
          <span className="eh-brand-tagline">PREMIUM AUTOMOTIVE CARE · PUNE</span>
        </Link>
        <nav className="eh-links" aria-label="Primary">
          {LINKS.map(([href, label]) => (
            <Link key={label} href={href} onClick={() => setOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
        <div className="eh-nav-cta">
          <Link className="eh-btn eh-nav-book" href="/booking" aria-label="Book appointment">
            <span className="eh-nav-book-label">BOOK APPOINTMENT</span>
            <span className="eh-nav-book-short" aria-hidden="true">BOOK</span>
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <button
            className="eh-menu"
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      <main>{children}</main>

      <footer className="eh-footer-wrap">
        <div className="eh-footer-strip">
          <div className="eh-wrap eh-footer-strip-inner">
            <div className="eh-footer-trust-pills">
              <div className="eh-footer-pill">
                <ShieldCheck size={14} color="#D71920" />
                <span>CERTIFIED DETAILING STUDIO</span>
                <span className="red">· BAVDHAN, PUNE</span>
              </div>
              <div className="eh-footer-pill">
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <span>4.9 / 5 RATED</span>
                <span className="red">· 3,500+ CARS PROTECTED</span>
              </div>
              <div className="eh-footer-pill">
                <Sparkles size={14} color="#D71920" />
                <span>GARWARE & 3M APPLICATORS</span>
              </div>
            </div>

            <div className="eh-footer-fast-actions">
              <a className="eh-footer-call-btn" href={phoneHref(phone)}>
                <Phone size={14} /> CALL: {phone}
              </a>
              <a className="eh-footer-wa-btn" href={wa} target="_blank" rel="noopener noreferrer">
                <WhatsAppIcon /> WHATSAPP DIRECT
              </a>
            </div>
          </div>
        </div>

        <div className="eh-wrap eh-footer">
          <div>
            <div className="eh-brand">
              <span className="eh-brand-name">EUPHORIA <span>AUTO</span> HUB</span>
              <span className="eh-brand-tagline">Automotive Detailing & Paint Protection Studio</span>
            </div>
            <p style={{ marginTop: 14 }}>
              Pune&apos;s specialist studio for high-grade TPU paint protection film (PPF), 10H ceramic & graphene coatings, color change wraps, and concourse interior restoration.
            </p>

            <div className="eh-footer-loc-card">
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 6 }}>
                <MapPin size={15} color="#D71920" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ margin: 0 }}>{address}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Clock size={15} color="#D71920" style={{ flexShrink: 0 }} />
                <p style={{ margin: 0 }}>All 7 Days: {hours}</p>
              </div>
            </div>

            {social.filter((item) => /^https?:\/\//i.test(item.url)).length > 0 && (
              <div className="eh-social">
                {social.filter((item) => /^https?:\/\//i.test(item.url)).map((item) => (
                  <a key={item.platform} href={item.url} target="_blank" rel="noopener noreferrer">
                    {item.display_name}
                  </a>
                ))}
              </div>
            )}
          </div>

          <div>
            <strong>Specialist Services</strong>
            <Link href="/services/paint-protection-film">
              <ChevronRight size={13} className="eh-chevron" /> Paint Protection Film (PPF)
            </Link>
            <Link href="/services/ceramic-graphene-coatings">
              <ChevronRight size={13} className="eh-chevron" /> Ceramic & Graphene Coating
            </Link>
            <Link href="/services/detailing-interior-cleaning">
              <ChevronRight size={13} className="eh-chevron" /> Concourse Detailing & Spa
            </Link>
            <Link href="/services/polishing">
              <ChevronRight size={13} className="eh-chevron" /> Paint Correction & Swirls
            </Link>
            <Link href="/services/wrap-jobs">
              <ChevronRight size={13} className="eh-chevron" /> Vehicle Wraps & Roofs
            </Link>
            <Link href="/services/premium-car-wash">
              <ChevronRight size={13} className="eh-chevron" /> Premium Car Wash
            </Link>
            <Link href="/service-area">
              <ChevronRight size={13} className="eh-chevron" /> Pune Service Areas
            </Link>
          </div>

          <div>
            <strong>Quick Navigation</strong>
            <Link href="/">
              <ChevronRight size={13} className="eh-chevron" /> Studio Home
            </Link>
            <Link href="/services">
              <ChevronRight size={13} className="eh-chevron" /> All Services & Rates
            </Link>
            <Link href="/#why">
              <ChevronRight size={13} className="eh-chevron" /> Why Choose Euphoria
            </Link>
            <Link href="/gallery">
              <ChevronRight size={13} className="eh-chevron" /> Studio Work Portfolio
            </Link>
            <Link href="/packages">
              <ChevronRight size={13} className="eh-chevron" /> Value Service Packages
            </Link>
            <Link href="/about">
              <ChevronRight size={13} className="eh-chevron" /> About Detailing Studio
            </Link>
            <Link href="/contact">
              <ChevronRight size={13} className="eh-chevron" /> Contact & Studio Map
            </Link>
            <Link href="/booking">
              <ChevronRight size={13} className="eh-chevron" /> Book Slot Online
            </Link>
          </div>

          <div>
            <strong>Studio Contact</strong>
            <div className="eh-footer-contact-box">
              <a href={phoneHref(phone)} className="eh-contact-item">
                <div className="eh-contact-icon">
                  <Phone size={14} />
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#9CA3AF', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Direct Phone</span>
                  <strong style={{ color: '#FFFFFF', fontSize: 13, margin: 0, padding: 0 }}>{phone}</strong>
                </div>
              </a>

              <a href={wa} target="_blank" rel="noopener noreferrer" className="eh-contact-item">
                <div className="eh-contact-icon" style={{ background: 'rgba(37, 211, 102, 0.15)', color: '#25D366' }}>
                  <WhatsAppIcon />
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#9CA3AF', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Instant WhatsApp</span>
                  <strong style={{ color: '#FFFFFF', fontSize: 13, margin: 0, padding: 0 }}>Chat with Studio</strong>
                </div>
              </a>

              <a href={contact?.maps_url || BUSINESS.maps} target="_blank" rel="noopener noreferrer" className="eh-contact-item">
                <div className="eh-contact-icon">
                  <MapPin size={14} />
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#9CA3AF', display: 'block', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Studio Directions</span>
                  <strong style={{ color: '#FFFFFF', fontSize: 13, margin: 0, padding: 0 }}>Google Maps Route</strong>
                </div>
              </a>

              <div style={{ padding: '6px 8px 0', borderTop: '1px solid rgba(255, 255, 255, 0.08)', fontSize: 12, color: '#9CA3AF' }}>
                Email: <span style={{ color: '#FFFFFF' }}>{email}</span>
              </div>
            </div>

            <Link href="/booking" className="eh-footer-call-btn" style={{ width: '100%', justifyContent: 'center', marginTop: 14 }}>
              SCHEDULE APPOINTMENT <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        <div className="eh-wrap eh-footer-bottom">
          <span>{contact?.copyright_text || `© ${new Date().getFullYear()} Euphoria Auto Hub. All Rights Reserved. Bavdhan, Pune, Maharashtra.`}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span>Crafted for Automotive Precision</span>
            <Link href="/admin/login" style={{ opacity: 0.45 }}>Admin Portal</Link>
          </div>
        </div>
      </footer>

      <nav className="eh-dock" aria-label="Quick contact">
        <a href={phoneHref(phone)}>CALL NOW</a>
        <a href={wa} target="_blank" rel="noopener noreferrer">WHATSAPP</a>
        <Link href="/booking">BOOK NOW</Link>
      </nav>

      <a className="eh-wa" href={wa} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Euphoria Auto Hub" onClick={() => track('whatsapp_clicked')}>
        <WhatsAppIcon />
      </a>
      <button className="eh-chat-launcher" type="button" aria-label="Open Euphoria assistant" onClick={() => { setChat((v) => !v); track('chatbot_opened'); }}>
        <MessageCircle size={22} />
      </button>
      {chat && <ChatPanel phone={contact?.whatsapp} onClose={() => setChat(false)} />}
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
      <path d="M20.5 3.5A11 11 0 0 0 2.1 16.8L1 23l6.4-1.1A11 11 0 0 0 20.5 3.5zM12 20.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3.8.6.6-3.7-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.6-.8s-.4-.1-.5.1-.6.8-.7.9-.3.2-.5.1a6.7 6.7 0 0 1-2-1.2 7.4 7.4 0 0 1-1.4-1.7c-.1-.2 0-.4.1-.5l.4-.4.2-.3a.5.5 0 0 0 0-.5c-.1-.5-1.2-.7-1.6-.4h-.5a1 1 0 0 0-.7.3 2.9 2.9 0 0 0-.9 2.2 5 5 0 0 0 1.1 2.7 11.4 11.4 0 0 0 4.4 3.9 4.8 4.8 0 0 0 2.1.4 2.5 2.5 0 0 0 1.6-1.1 2 2 0 0 0 .1-1.1c-.1-.2-.2-.2-.4-.3z" />
    </svg>
  );
}

function ChatPanel({ phone, onClose }: { phone?: string; onClose: () => void }) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [log, setLog] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    { role: 'bot', text: 'Welcome to Euphoria Auto Hub. How can our studio help care for your vehicle today?' },
  ]);
  const [busy, setBusy] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [leadAsk, setLeadAsk] = useState(false);
  const [leadNote, setLeadNote] = useState('');
  const [lead, setLead] = useState({ name: '', phone: '', vehicle: '', service: '', date: '', time: '' });
  const chips = ['Book a service', 'View services', 'PPF info', 'Ceramic coating', 'Studio location', 'WhatsApp team'];

  const ask = async (message: string) => {
    const value = message.trim();
    if (!value || busy) return;
    setLog((rows) => [...rows, { role: 'user', text: value }]);
    setText('');
    setBusy(true);
    try {
      const res = await fetch('/api/chatbot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: value }) });
      const data = await res.json().catch(() => ({}));
      setLog((rows) => [...rows, { role: 'bot', text: data.reply || data.error || 'The assistant is temporarily offline. Please chat with us directly on WhatsApp.' }]);
    } catch {
      setLog((rows) => [...rows, { role: 'bot', text: 'Something went wrong. Please connect with our team on WhatsApp.' }]);
    }
    setBusy(false);
  };

  const sendLead = async () => {
    setLeadNote('');
    setBusy(true);
    const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(lead) }).catch(() => null);
    const data = await res?.json().catch(() => ({}));
    setBusy(false);
    if (!res || !res.ok) {
      setLeadNote(data?.error || 'Something went wrong. Please try again or message us on WhatsApp.');
      return;
    }
    track('chatbot_lead');
    setLeadOpen(false);
    setLeadAsk(false);
    setLog((rows) => [...rows, { role: 'bot', text: 'Thank you! Your enquiry has been received. Our team will contact you shortly.' }]);
  };

  return (
    <section className="eh-chat" aria-label="Euphoria Auto Assistant">
      <header>
        <strong>Euphoria Concierge</strong>
        <button type="button" onClick={onClose} aria-label="Close chat" style={{ background: 'transparent', color: '#fff', border: 0, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>✕</button>
      </header>
      <div className="eh-log">
        {log.map((item, index) => (
          <div key={index} className={`eh-bubble${item.role === 'user' ? ' user' : ''}`}>{item.text}</div>
        ))}
      </div>
      <div className="eh-chips">
        {chips.map((chip) => (
          <button key={chip} type="button" onClick={() => {
            if (chip === 'WhatsApp team') { track('whatsapp_clicked'); window.open(whatsappLink(enquiryMessage('a service'), phone), '_blank', 'noopener'); return; }
            if (chip === 'Book a service') { track('booking_started'); router.push('/booking'); return; }
            if (chip === 'View services') { router.push('/#services'); return; }
            ask(chip);
          }}>{chip}</button>
        ))}
      </div>
      {leadOpen && !leadAsk && (
        <form className="eh-lead" onSubmit={(event) => { event.preventDefault(); setLeadAsk(true); }}>
          <input required aria-label="Name" placeholder="Your Name" value={lead.name} onChange={(event) => setLead({ ...lead, name: event.target.value })} />
          <input required aria-label="Phone" placeholder="Mobile Number" value={lead.phone} onChange={(event) => setLead({ ...lead, phone: event.target.value })} />
          <input aria-label="Vehicle" placeholder="Vehicle Make & Model" value={lead.vehicle} onChange={(event) => setLead({ ...lead, vehicle: event.target.value })} />
          <input aria-label="Service" placeholder="Service Needed" value={lead.service} onChange={(event) => setLead({ ...lead, service: event.target.value })} />
          <button className="eh-btn" type="submit" style={{ minHeight: 40, fontSize: 13 }}>Continue</button>
        </form>
      )}
      {leadAsk && (
        <div className="eh-lead">
          <p style={{ fontSize: 13, margin: 0 }}>Send this enquiry to Euphoria Auto Hub team?</p>
          <div className="eh-actions" style={{ marginTop: 8, gap: 8 }}>
            <button className="eh-btn" type="button" style={{ minHeight: 36, padding: '0 14px', fontSize: 12 }} disabled={busy} onClick={sendLead}>Yes, send enquiry</button>
            <button className="eh-btn-ghost" type="button" style={{ minHeight: 36, padding: '0 14px', fontSize: 12 }} onClick={() => {
              track('whatsapp_clicked');
              const message = bookingMessage({ service: lead.service, vehicle: lead.vehicle, date: lead.date, time: lead.time, name: lead.name, phone: lead.phone });
              window.open(whatsappLink(message, phone), '_blank', 'noopener');
            }}>WhatsApp</button>
            <button className="eh-btn-line" type="button" style={{ minHeight: 36, padding: '0 12px', fontSize: 12 }} onClick={() => { setLeadOpen(false); setLeadAsk(false); }}>Cancel</button>
          </div>
          {leadNote && <p className="eh-error" style={{ margin: 0 }}>{leadNote}</p>}
        </div>
      )}
      <form onSubmit={(event) => { event.preventDefault(); ask(text); }}>
        <input aria-label="Message" value={text} onChange={(event) => setText(event.target.value)} placeholder="Ask about PPF, ceramic, wash..." />
        <button className="eh-btn" type="submit" disabled={busy} style={{ minHeight: 40, padding: '0 16px', fontSize: 13 }}>{busy ? '...' : 'Send'}</button>
      </form>
    </section>
  );
}
