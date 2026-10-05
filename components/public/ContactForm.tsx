'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', mobile: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.email.trim() || !form.mobile.trim() || form.message.trim().length < 5) {
      setStatus('error');
      setErrorMsg('Please enter your name, a valid email, mobile number, and message.');
      return;
    }
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setStatus('success');
        setForm({ first_name: '', last_name: '', email: '', mobile: '', message: '' });
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Something went wrong. Please try again.');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit} noValidate>
      {status === 'success' && (
        <div className="form-success">
          Enquiry submitted successfully. We&apos;ll get back to you shortly.
        </div>
      )}
      {status === 'error' && (
        <div className="form-error">✕ {errorMsg}</div>
      )}
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="first_name">First Name *</label>
          <input id="first_name" name="first_name" type="text" className="form-input" placeholder="Your first name" value={form.first_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="last_name">Last Name</label>
          <input id="last_name" name="last_name" type="text" className="form-input" placeholder="Your last name" value={form.last_name} onChange={handleChange} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="email">Email Address *</label>
          <input id="email" name="email" type="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="mobile">Mobile Number *</label>
          <input id="mobile" name="mobile" type="tel" className="form-input" placeholder="+91 94224 45556" value={form.mobile} onChange={handleChange} required />
        </div>
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="message">Message *</label>
        <textarea id="message" name="message" className="form-textarea" placeholder="Tell us about your vehicle and what service you're interested in..." value={form.message} onChange={handleChange} required />
      </div>
      <div className="form-submit">
        <button id="submit-enquiry" type="submit" className="btn-primary w-full" disabled={status === 'loading'} style={{ justifyContent: 'center', opacity: status === 'loading' ? 0.7 : 1 }}>
          <span>{status === 'loading' ? 'Sending...' : 'Send Enquiry'}</span>
          {status !== 'loading' && <span>→</span>}
        </button>
      </div>
    </form>
  );
}
