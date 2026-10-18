'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { track } from '@/lib/analytics';

export default function SportContact({ services }: { services: string[] }) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');
  const [error, setError] = useState('');
  const [service, setService] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', mobile: '', message: '' });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('saving');
    setError('');
    const payload = {
      ...form,
      message: [
        service && `Service: ${service}`,
        vehicle && `Vehicle: ${vehicle}`,
        form.message,
      ]
        .filter(Boolean)
        .join('\n'),
    };

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus('error');
        setError(data?.error || 'Something went wrong. Please connect with our team on WhatsApp.');
        return;
      }
      setStatus('done');
      setVehicle('');
      setService('');
      track('contact_form_submitted');
      setForm({ first_name: '', last_name: '', email: '', mobile: '', message: '' });
    } catch {
      setStatus('error');
      setError('Connection failed. Please connect with us directly on WhatsApp.');
    }
  };

  if (status === 'done') {
    return (
      <div className="eh-ok" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <CheckCircle2 size={20} color="#15803D" />
        <div>
          <strong>Message Received!</strong>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: '#166534' }}>
            Thank you. Our studio team will get back to you promptly with details and availability.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form className="eh-book" onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
      <div className="eh-grid-2">
        <label>
          Your Name *
          <input
            required
            placeholder="First and last name"
            value={form.first_name}
            onChange={(event) => setForm({ ...form, first_name: event.target.value })}
          />
        </label>
        <label>
          Mobile / WhatsApp *
          <input
            required
            placeholder="+91 98765 43210"
            value={form.mobile}
            onChange={(event) => setForm({ ...form, mobile: event.target.value })}
          />
        </label>
      </div>

      <div className="eh-grid-2">
        <label>
          Email Address *
          <input
            required
            type="email"
            placeholder="name@example.com"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
          />
        </label>
        <label>
          Vehicle Make & Model
          <input
            value={vehicle}
            onChange={(event) => setVehicle(event.target.value)}
            placeholder="e.g. BMW M340i, Thar, Safari"
          />
        </label>
      </div>

      <label>
        Service Interest
        <select value={service} onChange={(event) => setService(event.target.value)}>
          <option value="">Select a service (optional)</option>
          {services.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>

      <label>
        Message or Specific Questions *
        <textarea
          required
          placeholder="Tell us what care your vehicle requires..."
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
        />
      </label>

      {error && <p className="eh-error">{error}</p>}

      <button className="eh-btn" type="submit" disabled={status === 'saving'} style={{ marginTop: 6 }}>
        {status === 'saving' ? 'Sending Message...' : <>SEND MESSAGE TO STUDIO <ArrowRight size={16} /></>}
      </button>
    </form>
  );
}
