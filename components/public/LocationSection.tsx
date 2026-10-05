import { BUSINESS, httpsHref, mailHref, mapsEmbedSrc, phoneHref } from '@/lib/links';
import type { ContactInfo, HomepageSection } from '@/lib/types';

export default function LocationSection({ contact, location }: { contact?: ContactInfo; location?: HomepageSection }) {
  const phone = contact?.phone || BUSINESS.phone;
  const email = contact?.email || BUSINESS.email;
  const address = contact?.address || BUSINESS.address;
  const maps = httpsHref(contact?.maps_url, BUSINESS.maps);
  const hours = contact?.hours || BUSINESS.hours;

  return (
    <section id="location" className="location-section">
      <div className="container">
        <div className="reveal" style={{ marginBottom: 56, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="label-text">{location?.label || 'Find Us'}</div>
          <h2 className="section-heading">{location?.heading || 'Visit Our Studio'}</h2>
        </div>
        <div className="location-inner">
          <div className="location-content reveal">
            <div className="location-detail">
              <div className="location-detail-info">
                <div className="location-detail-label">Address</div>
                <div className="location-detail-value">{address}</div>
              </div>
            </div>
            <div className="location-detail">
              <div className="location-detail-info">
                <div className="location-detail-label">Phone</div>
                <div className="location-detail-value"><a href={phoneHref(phone)}>{phone}</a></div>
              </div>
            </div>
            <div className="location-detail">
              <div className="location-detail-info">
                <div className="location-detail-label">Email</div>
                <div className="location-detail-value"><a href={mailHref(email)}>{email}</a></div>
              </div>
            </div>
            <div className="location-detail">
              <div className="location-detail-info">
                <div className="location-detail-label">Business Hours</div>
                <div className="location-detail-value">{hours}</div>
              </div>
            </div>
            <a href={maps} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ marginTop: 8 }}>
              <span>Get Directions</span><span>→</span>
            </a>
          </div>
          <div className="location-map reveal reveal-delay-2">
            <iframe
              className="map-frame"
              title="Euphoria Auto Hub on Google Maps"
              src={mapsEmbedSrc(address)}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
