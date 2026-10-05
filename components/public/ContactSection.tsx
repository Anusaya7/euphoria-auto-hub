import ContactForm from '@/components/public/ContactForm';
import { BUSINESS, mailHref, phoneHref, whatsappHref } from '@/lib/links';
import type { ContactInfo, HomepageSection } from '@/lib/types';

export default function ContactSection({ contact, intro }: { contact?: ContactInfo; intro?: HomepageSection }) {
  const phone = contact?.phone || BUSINESS.phone;
  const email = contact?.email || BUSINESS.email;
  const wa = whatsappHref(contact?.whatsapp);

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="contact-inner">
          <div className="contact-info reveal">
            <div>
              <div className="label-text">{intro?.label || 'Get In Touch'}</div>
              <h2 className="section-heading" style={{ fontSize: 'clamp(32px, 4vw, 48px)', marginTop: 12 }}>{intro?.heading || 'Book Your Service'}</h2>
              <p className="section-subheading" style={{ marginTop: 16, fontSize: 15 }}>
                {intro?.description || 'Share your requirements and we will get back to you promptly with all the details you need.'}
              </p>
            </div>
            <div className="contact-channels">
              <a href={phoneHref(phone)} className="contact-channel">
                <div>
                  <div className="contact-channel-label">Call Us</div>
                  <div className="contact-channel-value">{phone}</div>
                </div>
              </a>
              <a href={mailHref(email)} className="contact-channel">
                <div>
                  <div className="contact-channel-label">Email Us</div>
                  <div className="contact-channel-value">{email}</div>
                </div>
              </a>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="contact-channel">
                  <div>
                    <div className="contact-channel-label">WhatsApp</div>
                    <div className="contact-channel-value">Chat with us</div>
                  </div>
                </a>
              )}
            </div>
          </div>
          <div className="reveal reveal-delay-2">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
