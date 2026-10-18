'use client';
import { useState, useEffect } from 'react';
import type { AlertState } from '@/lib/types';

export default function ContactAdminPage() {
  const [form, setForm] = useState({ phone: '', email: '', whatsapp: '', address: '', maps_url: '', hours: '', business_name: '', maps_embed: '', copyright_text: '', logo: '', favicon: '', default_cta: '' });
  const [alert, setAlert] = useState<AlertState>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contact').then(r => r.json()).then(d => { if (d) setForm({ phone: d.phone || '', email: d.email || '', whatsapp: d.whatsapp || '', address: d.address || '', maps_url: d.maps_url || '', hours: d.hours || '', business_name: d.business_name || '', maps_embed: d.maps_embed || '', copyright_text: d.copyright_text || '', logo: d.logo || '', favicon: d.favicon || '', default_cta: d.default_cta || '' }); setLoading(false); });
  }, []);

  const showAlert = (type: 'success' | 'error', msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 3000); };

  const handleSave = async () => {
    const res = await fetch('/api/contact', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    if (res.ok) showAlert('success', 'Contact details updated successfully!');
    else showAlert('error', 'Failed to update. Please try again.');
  };

  if (loading) return <div style={{ padding: 48, color: 'var(--soft-grey)', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--white)' }}>Contact Details</h1>
        <p style={{ color: 'var(--soft-grey)', fontSize: 14, marginTop: 4 }}>Update business contact information shown on the website.</p>
      </div>
      {alert && <div className={`admin-alert admin-alert-${alert.type}`}>{alert.msg}</div>}
      <div className="admin-card">
        <div className="admin-card-title">Business Information</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div className="admin-form-group">
            <label className="admin-form-label">Phone Number</label>
            <input className="admin-form-input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91 9422445556" />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Email Address</label>
            <input type="email" className="admin-form-input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="pranit.more007@gmail.com" />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">WhatsApp Number</label>
            <input className="admin-form-input" value={form.whatsapp} onChange={e => setForm(p => ({ ...p, whatsapp: e.target.value }))} placeholder="919422445556 (no + or spaces)" />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Business Hours</label>
            <input className="admin-form-input" value={form.hours} onChange={e => setForm(p => ({ ...p, hours: e.target.value }))} placeholder="All Day: 9:00 AM – 7:00 PM" />
          </div>
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Full Address</label>
          <textarea className="admin-form-textarea" style={{ minHeight: 80 }} value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Mno 30/2, Euphoria Auto Hub, Pune, Bavdhan, Pune - 411021..." />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Business name</label>
          <input className="admin-form-input" value={form.business_name} onChange={e => setForm(p => ({ ...p, business_name: e.target.value }))} />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Google Maps URL</label>
          <input className="admin-form-input" value={form.maps_url} onChange={e => setForm(p => ({ ...p, maps_url: e.target.value }))} placeholder="https://maps.app.goo.gl/..." />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Google Maps embed URL</label>
          <input className="admin-form-input" value={form.maps_embed} onChange={e => setForm(p => ({ ...p, maps_embed: e.target.value }))} placeholder="https://" />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Footer copyright</label>
          <input className="admin-form-input" value={form.copyright_text} onChange={e => setForm(p => ({ ...p, copyright_text: e.target.value }))} />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Default booking button</label>
          <input className="admin-form-input" value={form.default_cta} onChange={e => setForm(p => ({ ...p, default_cta: e.target.value }))} />
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
          <button className="admin-btn admin-btn-primary" onClick={handleSave}>Save Changes</button>
          {form.maps_url && <a href={form.maps_url} target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-secondary">Preview Maps Link ↗</a>}
        </div>
      </div>
    </div>
  );
}
