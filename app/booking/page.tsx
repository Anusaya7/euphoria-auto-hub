import type { Metadata } from 'next';
import SiteChrome from '@/components/public/sport/SiteChrome';
import BookingWizard from '@/components/public/sport/BookingWizard';
import { getSiteData } from '@/lib/site';
import { VEHICLE_TYPES } from '@/lib/serviceCatalog';

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: 'Book a Detailing Appointment | Euphoria Auto Hub, Bavdhan, Pune',
  description: 'Request a car care appointment at Euphoria Auto Hub, Bavdhan. The studio verifies bay availability and confirms the appointment with you.',
  alternates: { canonical: 'https://euphoriaautohub.in/booking' },
};

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string; vehicle?: string; date?: string }>;
}) {
  const { service, vehicle, date } = await searchParams;
  const { services, contact, social } = getSiteData();
  const selected = services.find((item) => item.name === service)?.name || '';
  const vehicleType = VEHICLE_TYPES.find((item) => item === vehicle) || '';
  const today = new Date().toISOString().slice(0, 10);
  const preferredDate = date && /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= today ? date : '';

  return (
    <SiteChrome contact={contact} social={social}>
      <section className="eh-section eh-wrap" style={{ maxWidth: 900 }}>
        <p className="eh-kicker">STUDIO SCHEDULING</p>
        <h1 style={{ fontSize: 'clamp(36px, 5.2vw, 68px)' }}>REQUEST A STUDIO TIME</h1>
        <p style={{ fontSize: 16, maxWidth: 740, color: '#626873' }}>
          Preferred studio hours are between 9:00 AM and 7:00 PM, 7 days a week. Select your desired service and preferred timing; our master technician reviews the bay schedule and confirms your slot.
        </p>
        <BookingWizard
          services={services}
          initialService={selected}
          initialVehicle={vehicleType}
          initialDate={preferredDate}
          whatsapp={contact?.whatsapp}
        />
      </section>
    </SiteChrome>
  );
}
