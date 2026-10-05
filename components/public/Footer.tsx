import Link from 'next/link';
import { getDb } from '@/lib/db';
import { BUSINESS, mailHref, phoneHref, whatsappHref } from '@/lib/links';
import type { ContactInfo } from '@/lib/types';

export default function Footer({ contact }: { contact?: ContactInfo }) {
  const phone = contact?.phone || BUSINESS.phone;
  const email = contact?.email || BUSINESS.email;
  const address = contact?.address || BUSINESS.address;
  const wa = whatsappHref(contact?.whatsapp);
  const social = getDb().prepare('SELECT platform, display_name, url FROM social_links WHERE enabled = 1 AND url != \'\' ORDER BY display_order ASC').all() as { platform: string; display_name: string; url: string }[];

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-inner">
          <div>
            <div className="footer-brand-name">EUPHORIA <span>AUTO</span> HUB</div>
            <div className="footer-brand-desc">Your Car&apos;s Best Friend</div>
            <div className="footer-brand-contact">
              <a href={phoneHref(phone)} className="footer-contact-link">{phone}</a>
              <a href={mailHref(email)} className="footer-contact-link">{email}</a>
              <div className="footer-contact-link">{address}</div>
              <div className="footer-contact-link">{contact?.hours || BUSINESS.hours}</div>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Quick Links</div>
            <div className="footer-links">
              <Link href="/" className="footer-link">Home</Link>
              <Link href="/services" className="footer-link">Services</Link>
              <Link href="/gallery" className="footer-link">Gallery</Link>
              <Link href="/#about" className="footer-link">About</Link>
              <Link href="/contact" className="footer-link">Contact</Link>
            </div>
          </div>
          <div>
            <div className="footer-col-title">Services</div>
            <div className="footer-links">
              <Link href="/services/premium-car-wash" className="footer-link">Premium Car Wash</Link>
              <Link href="/services/ceramic-graphene-coatings" className="footer-link">Ceramic & Graphene</Link>
              <Link href="/services/paint-protection-film" className="footer-link">Paint Protection Film</Link>
              <Link href="/services/wrap-jobs" className="footer-link">Wrap Jobs</Link>
              <Link href="/services/detailing-interior-cleaning" className="footer-link">Detailing</Link>
              <Link href="/services/polishing" className="footer-link">Polishing</Link>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copyright">© {new Date().getFullYear()} Euphoria Auto Hub. All Rights Reserved.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {social.map((link) => (
              <a key={link.platform} href={link.url} className="footer-bottom-link" target="_blank" rel="noopener noreferrer">{link.display_name}</a>
            ))}
            {wa && <a href={wa} className="footer-bottom-link" target="_blank" rel="noopener noreferrer">WhatsApp</a>}
            <Link href="/admin/login" className="footer-bottom-link" style={{ opacity: 0.4, fontSize: '0.75rem' }}>Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
