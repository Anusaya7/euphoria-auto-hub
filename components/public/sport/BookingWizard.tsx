'use client';

import { useMemo, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, MessageCircle, Phone, ShieldCheck } from 'lucide-react';
import type { Service } from '@/lib/types';
import { TIME_SLOTS, VEHICLE_TYPES } from '@/lib/serviceCatalog';
import { bookingMessage, whatsappLink } from '@/lib/whatsapp';
import { BUSINESS, phoneHref } from '@/lib/links';
import { track } from '@/lib/analytics';

export default function BookingWizard({
  services,
  initialService,
  initialVehicle,
  initialDate,
  whatsapp,
}: {
  services: Service[];
  initialService?: string;
  initialVehicle?: string;
  initialDate?: string;
  whatsapp?: string;
}) {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [code, setCode] = useState('');
  const [form, setForm] = useState({
    service: initialService || services[0]?.name || '',
    vehicle_type: initialVehicle || 'Hatchback',
    booking_date: initialDate || '',
    booking_time: '10:00',
    name: '',
    phone: '',
    email: '',
    vehicle_make: '',
    vehicle_model: '',
    registration_number: '',
    notes: '',
  });

  const today = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async () => {
    setStatus('saving');
    setError('');
    try {
      const res = await fetch('/api/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setError(data.error || 'Something went wrong. Please try again or contact us directly on WhatsApp.');
        return;
      }
      setCode(data.booking_code);
      setStatus('done');
      track('booking_completed', { service: form.service });
    } catch {
      setStatus('error');
      setError('Connection issue. Please try again or chat with us on WhatsApp.');
    }
  };

  if (status === 'done') {
    const message = bookingMessage({
      service: form.service,
      vehicle: `${form.vehicle_type} ${form.vehicle_make} ${form.vehicle_model}`.trim(),
      date: form.booking_date,
      time: form.booking_time,
      name: form.name,
      phone: form.phone,
    });

    return (
      <div className="eh-book" style={{ borderLeft: '4px solid #D71920', marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <CheckCircle2 size={24} color="#D71920" />
          <p className="eh-kicker" style={{ margin: 0 }}>REQUEST RECEIVED</p>
        </div>
        <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 40px)', margin: '4px 0 12px' }}>
          BOOKING REQUEST SUBMITTED
        </h2>
        <p style={{ fontSize: 16 }}>
          Thank you, <strong>{form.name}</strong>. Your request has been logged in our studio queue. Our team will verify time-slot availability and confirm your final booking.
        </p>

        <div style={{ background: '#F4F5F7', border: '1px solid #E1E4E8', borderRadius: 10, padding: 18, margin: '16px 0 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <span style={{ fontSize: 12, color: '#626873', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Booking Reference</span>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#D71920', fontFamily: 'var(--font-grotesk)' }}>{code}</div>
            </div>
            <div>
              <span style={{ fontSize: 12, color: '#626873', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Requested Service</span>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#141414' }}>{form.service}</div>
            </div>
            <div>
              <span style={{ fontSize: 12, color: '#626873', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 700 }}>Date & Time</span>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#141414' }}>{form.booking_date} at {form.booking_time}</div>
            </div>
          </div>
        </div>

        <p style={{ fontSize: 14, color: '#626873' }}>
          Need faster confirmation? Connect with our master detailer directly on WhatsApp using your reference ID.
        </p>

        <div className="eh-actions">
          <a className="eh-btn" href={whatsappLink(message, whatsapp)} target="_blank" rel="noopener noreferrer">
            <MessageCircle size={16} /> FAST CONFIRM ON WHATSAPP
          </a>
          <a className="eh-btn-ghost" href={phoneHref(BUSINESS.phone)}>
            <Phone size={14} /> CALL STUDIO: {BUSINESS.phone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      className="eh-book"
      style={{ marginTop: 24 }}
      onSubmit={(event) => {
        event.preventDefault();
        if (step === 4) submit();
        else setStep((value) => value + 1);
      }}
    >
      <div className="eh-steps" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {['Service Selection', 'Vehicle Segment', 'Select Date', 'Preferred Time', 'Owner Details'].map((label, index) => (
          <button
            key={label}
            type="button"
            className={step === index ? 'on' : ''}
            onClick={() => setStep(index)}
          >
            {index + 1}. {label}
          </button>
        ))}
      </div>

      {step === 0 && (
        <div>
          <label style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
            Choose Required Service
            <select
              value={form.service}
              onChange={(event) => set('service', event.target.value)}
              style={{ fontSize: 15, padding: '12px 14px', marginTop: 6 }}
            >
              {services.map((service) => (
                <option key={service.id} value={service.name}>
                  {service.name}
                </option>
              ))}
            </select>
          </label>
          <p style={{ marginTop: 8, fontSize: 13, color: '#626873' }}>
            Not sure? Select what seems closest; our detailing studio inspects every vehicle and confirms the exact scope upon arrival.
          </p>
        </div>
      )}

      {step === 1 && (
        <div>
          <label style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            Select Vehicle Segment
          </label>
          <div className="eh-finder" style={{ marginTop: 8 }}>
            {VEHICLE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                className={form.vehicle_type === type ? 'on' : ''}
                onClick={() => set('vehicle_type', type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <label style={{ fontSize: 15, fontWeight: 700 }}>
            Preferred Studio Date
            <input
              type="date"
              min={today}
              required
              value={form.booking_date}
              onChange={(event) => set('booking_date', event.target.value)}
              style={{ marginTop: 8, maxWidth: 360 }}
            />
          </label>
          <p style={{ marginTop: 8, fontSize: 13, color: '#626873' }}>
            Studio is open Monday to Sunday from 9:00 AM to 7:00 PM.
          </p>
        </div>
      )}

      {step === 3 && (
        <div>
          <label style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>
            Preferred Arrival Slot
          </label>
          <div className="eh-finder" style={{ marginTop: 8 }}>
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                type="button"
                className={form.booking_time === slot ? 'on' : ''}
                onClick={() => set('booking_time', slot)}
              >
                {slot}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <div className="eh-grid-2">
            <label>
              Owner Name *
              <input required placeholder="Your full name" value={form.name} onChange={(event) => set('name', event.target.value)} />
            </label>
            <label>
              Phone / WhatsApp *
              <input required placeholder="+91 98765 43210" value={form.phone} onChange={(event) => set('phone', event.target.value)} />
            </label>
            <label>
              Email Address
              <input type="email" placeholder="name@example.com" value={form.email} onChange={(event) => set('email', event.target.value)} />
            </label>
            <label>
              Vehicle Make
              <input placeholder="e.g. BMW, Mercedes, Tata, Hyundai" value={form.vehicle_make} onChange={(event) => set('vehicle_make', event.target.value)} />
            </label>
            <label>
              Vehicle Model
              <input placeholder="e.g. 3 Series, Harrier, Creta" value={form.vehicle_model} onChange={(event) => set('vehicle_model', event.target.value)} />
            </label>
            <label>
              Vehicle Registration No.
              <input placeholder="e.g. MH 12 AB 1234" value={form.registration_number} onChange={(event) => set('registration_number', event.target.value)} />
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              Specific Concerns or Special Instructions
              <textarea placeholder="e.g. Swirl marks on bonnet, coffee stain on rear seat, interested in ceramic coating on alloys..." value={form.notes} onChange={(event) => set('notes', event.target.value)} />
            </label>
          </div>
        </div>
      )}

      {error && <p className="eh-error" style={{ marginTop: 14 }}>{error}</p>}

      <div className="eh-actions" style={{ marginTop: 24 }}>
        {step > 0 && (
          <button className="eh-btn-ghost" type="button" onClick={() => setStep((value) => value - 1)}>
            <ArrowLeft size={16} /> Back
          </button>
        )}
        <button className="eh-btn" type="submit" disabled={status === 'saving'}>
          {status === 'saving' ? (
            'Submitting Request...'
          ) : step === 4 ? (
            <>SUBMIT BOOKING REQUEST <ArrowRight size={16} /></>
          ) : (
            <>Continue <ArrowRight size={16} /></>
          )}
        </button>
      </div>
    </form>
  );
}
