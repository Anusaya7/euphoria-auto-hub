'use client';
import { useState, useEffect } from 'react';
import AdminImage from '@/components/admin/AdminImage';
import type { AlertState } from '@/lib/types';

export default function SeoAdminPage() {
  const [form, setForm] = useState({ title: '', description: '', keywords: '', og_image: '', canonical_url: '' });
  const [alert, setAlert] = useState<AlertState>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/seo').then(r => r.json()).then(d => { if (d) setForm({ title: d.title || '', description: d.description || '', keywords: d.keywords || '', og_image: d.og_image || '', canonical_url: d.canonical_url || '' }); setLoading(false); });
  }, []);

  const showAlert = (type: 'success' | 'error', msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 3000); };

  const handleSave = async () => {
    const res = await fetch('/api/seo', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: 'home', ...form }) });
    if (res.ok) showAlert('success', 'SEO settings saved successfully.');
    else showAlert('error', 'Failed to save SEO settings.');
  };

  if (loading) return <div style={{ padding: 48, color: 'var(--soft-grey)', textAlign: 'center' }}>Loading...</div>;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--white)' }}>SEO Settings</h1>
        <p style={{ color: 'var(--soft-grey)', fontSize: 14, marginTop: 4 }}>Manage search engine optimisation for the homepage.</p>
      </div>
      {alert && <div className={`admin-alert admin-alert-${alert.type}`}>{alert.msg}</div>}
      <div className="admin-card">
        <div className="admin-card-title">Homepage SEO</div>

        <div style={{ padding: '12px 16px', background: '#1a1a1a', borderRadius: 6, border: '1px solid #2a2a2a', marginBottom: 24 }}>
          <div style={{ fontSize: 11, color: 'var(--soft-grey)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>Preview in Google Search</div>
          <div style={{ color: '#8ab4f8', fontSize: 18, marginBottom: 2 }}>{form.title || 'Euphoria Auto Hub | Premium Car Wash...'}</div>
          <div style={{ color: '#34a853', fontSize: 13, marginBottom: 4 }}>euphoriaautohub.in</div>
          <div style={{ fontSize: 13, color: '#bdc1c6' }}>{form.description?.slice(0, 160) || 'Enter a meta description...'}</div>
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Page Title <span style={{ color: 'var(--soft-grey)', fontWeight: 400 }}>({form.title.length}/60 chars)</span></label>
          <input className="admin-form-input" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Euphoria Auto Hub | Premium Car Wash, PPF, Ceramic & Detailing in Pune" maxLength={70} />
          {form.title.length > 60 && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>⚠ Title is longer than 60 characters — may be truncated in search results.</div>}
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Meta Description <span style={{ color: 'var(--soft-grey)', fontWeight: 400 }}>({form.description.length}/160 chars)</span></label>
          <textarea className="admin-form-textarea" style={{ minHeight: 80 }} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Euphoria Auto Hub — Your Car's Best Friend. Premium car wash, PPF, Ceramic Coatings, Detailing in Pune..." maxLength={170} />
          {form.description.length > 160 && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>⚠ Description is longer than 160 characters — may be truncated.</div>}
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Keywords (comma-separated)</label>
          <input className="admin-form-input" value={form.keywords} onChange={e => setForm(p => ({ ...p, keywords: e.target.value }))} placeholder="car wash pune, PPF pune, ceramic coating pune, euphoria auto hub" />
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">OG Image URL (for social sharing)</label>
          <input className="admin-form-input" value={form.og_image} onChange={e => setForm(p => ({ ...p, og_image: e.target.value }))} placeholder="/images/hero-car.jpg" />
          <label className="admin-upload" style={{ marginTop: 8 }}>
            <span>{uploading ? 'Uploading...' : 'Upload OG image'}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" disabled={uploading} onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              const fd = new FormData();
              fd.append('file', file);
              const res = await fetch('/api/upload', { method: 'POST', body: fd });
              const data = await res.json().catch(() => ({}));
              if (res.ok) setForm(p => ({ ...p, og_image: data.url }));
              else showAlert('error', data.error || 'Image must be JPG, PNG or WEBP.');
              setUploading(false);
            }} />
          </label>
          {form.og_image && <AdminImage src={form.og_image} alt="Open Graph preview" />}
        </div>

        <div className="admin-form-group">
          <label className="admin-form-label">Canonical URL</label>
          <input className="admin-form-input" value={form.canonical_url} onChange={e => setForm(p => ({ ...p, canonical_url: e.target.value }))} placeholder="https://euphoriaautohub.in" />
        </div>

        <button className="admin-btn admin-btn-primary" onClick={handleSave}>Save SEO Settings</button>
      </div>
    </div>
  );
}
