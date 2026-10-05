'use client';
import { useEffect, useState } from 'react';
import AdminImage from '@/components/admin/AdminImage';
import type { Benefit, HomepageSection } from '@/lib/types';

const TABS = [
  { id: 'hero', label: 'Hero' },
  { id: 'about', label: 'About' },
  { id: 'featured_ceramic', label: 'Ceramic' },
  { id: 'featured_ppf', label: 'PPF' },
  { id: 'featured_wrap', label: 'Wraps' },
  { id: 'featured_detailing', label: 'Detailing' },
  { id: 'process', label: 'Process' },
  { id: 'sections', label: 'Section Headings' },
  { id: 'trust', label: 'Trust' },
  { id: 'why', label: 'Why Us' },
  { id: 'compare', label: 'Before / After' },
  { id: 'final_cta', label: 'Final CTA' },
];

export default function HomepageAdminPage() {
  const [data, setData] = useState<Record<string, HomepageSection>>({});
  const [alert, setAlert] = useState<{ type: string; msg: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('hero');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch('/api/homepage')
      .then(async (r) => {
        const body = await r.json();
        if (!r.ok) throw new Error(body.error);
        setData(body);
      })
      .catch(() => setAlert({ type: 'error', msg: 'Something went wrong. Please try again.' }))
      .finally(() => setLoading(false));
  }, []);

  const showAlert = (type: string, msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  };

  const update = (section: string, field: string, value: HomepageSection[keyof HomepageSection]) => {
    setData((prev) => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await fetch('/api/homepage', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
    const body = await res.json().catch(() => ({}));
    showAlert(res.ok ? 'success' : 'error', body.message || body.error || 'Failed to save changes.');
    setSaving(false);
  };

  const handleUpload = async (section: string, field: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const body = await res.json().catch(() => ({}));
    if (res.ok) {
      update(section, field, body.url);
      showAlert('success', 'Image uploaded successfully.');
    } else showAlert('error', body.error || 'Image must be JPG, PNG or WEBP.');
    setUploading(false);
    e.target.value = '';
  };

  if (loading) return <div style={{ padding: 48, color: 'var(--soft-grey)', textAlign: 'center' }}>Loading...</div>;

  const hero = data.hero || {};
  const about = data.about || {};
  const ceramic = data.featured_ceramic || {};
  const ppf = data.featured_ppf || {};
  const wrap = data.featured_wrap || {};
  const detailing = data.featured_detailing || {};

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Home Page</h1>
          <p>Edit the homepage, then save. The public site updates immediately.</p>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-secondary">Preview Website</a>
          <button className="admin-btn admin-btn-primary" onClick={handleSave} disabled={saving} type="button">{saving ? 'Saving...' : 'Save Changes'}</button>
        </div>
      </div>
      {alert && <div className={`admin-alert admin-alert-${alert.type}`}>{alert.msg}</div>}

      <div className="admin-tabs">
        {TABS.map((tab) => (
          <button key={tab.id} type="button" className={activeTab === tab.id ? 'active' : ''} onClick={() => setActiveTab(tab.id)}>{tab.label}</button>
        ))}
      </div>

      {activeTab === 'hero' && (
        <div className="admin-card">
          <Field label="Label" value={hero.label} onChange={(v) => update('hero', 'label', v)} />
          <Field label="Heading" value={hero.heading} onChange={(v) => update('hero', 'heading', v)} />
          <Field label="Subtitle" value={hero.subheading} onChange={(v) => update('hero', 'subheading', v)} />
          <Area label="Description" value={hero.description} onChange={(v) => update('hero', 'description', v)} />
          <div className="admin-form-grid">
            <Field label="Primary CTA" value={hero.cta_primary} onChange={(v) => update('hero', 'cta_primary', v)} />
            <Field label="Primary link" value={hero.cta_primary_link} onChange={(v) => update('hero', 'cta_primary_link', v)} />
            <Field label="Secondary CTA" value={hero.cta_secondary} onChange={(v) => update('hero', 'cta_secondary', v)} />
            <Field label="Secondary link" value={hero.cta_secondary_link} onChange={(v) => update('hero', 'cta_secondary_link', v)} />
          </div>
          <Field label="Hero image alt text" value={hero.image_alt} onChange={(v) => update('hero', 'image_alt', v)} />
          <Field label="Hero image path" value={hero.image} onChange={(v) => update('hero', 'image', v)} />
          <Upload label="Upload hero image" uploading={uploading} onChange={(e) => handleUpload('hero', 'image', e)} />
          {hero.image && <AdminImage src={hero.image} alt="Hero preview" />}
          <Field label="Hero video URL (optional)" value={hero.video} onChange={(v) => update('hero', 'video', v)} />
        </div>
      )}

      {activeTab === 'about' && (
        <div className="admin-card">
          <Field label="Heading" value={about.heading} onChange={(v) => update('about', 'heading', v)} />
          <Field label="Subtitle" value={about.subheading} onChange={(v) => update('about', 'subheading', v)} />
          <Area label="Description" value={about.description} onChange={(v) => update('about', 'description', v)} />
          <div className="admin-form-grid">
            <Field label="Quality badge" value={about.quality_badge} onChange={(v) => update('about', 'quality_badge', v)} />
            <Field label="Trust badge" value={about.trust_badge} onChange={(v) => update('about', 'trust_badge', v)} />
          </div>
          <Field label="Image path" value={about.image} onChange={(v) => update('about', 'image', v)} />
          <Upload label="Upload about image" uploading={uploading} onChange={(e) => handleUpload('about', 'image', e)} />
          {about.image && <AdminImage src={about.image} alt="About preview" />}
        </div>
      )}

      {activeTab === 'featured_ceramic' && (
        <FeatureFields section="featured_ceramic" data={ceramic} update={update} uploading={uploading} onUpload={handleUpload} benefitsAsLines />
      )}
      {activeTab === 'featured_ppf' && (
        <div className="admin-card">
          <Field label="Label" value={ppf.label} onChange={(v) => update('featured_ppf', 'label', v)} />
          <Field label="Heading" value={ppf.heading} onChange={(v) => update('featured_ppf', 'heading', v)} />
          <Area label="Description" value={ppf.description} onChange={(v) => update('featured_ppf', 'description', v)} />
          <Field label="CTA" value={ppf.cta} onChange={(v) => update('featured_ppf', 'cta', v)} />
          <Field label="Image path" value={ppf.image} onChange={(v) => update('featured_ppf', 'image', v)} />
          <Upload label="Upload image" uploading={uploading} onChange={(e) => handleUpload('featured_ppf', 'image', e)} />
          {(ppf.benefits || []).map((item: Benefit, i: number) => { if (typeof item === 'string') return null; return (
            <div key={i} className="admin-step">
              <Field label="Benefit title" value={item.title} onChange={(v) => {
                const benefits = [...(ppf.benefits || [])];
                const current = benefits[i];
                benefits[i] = { ...(typeof current === 'string' ? { title: current } : current), title: v };
                update('featured_ppf', 'benefits', benefits);
              }} />
              <Area label="Benefit description" value={item.description} onChange={(v) => {
                const benefits = [...(ppf.benefits || [])];
                const current = benefits[i];
                benefits[i] = { ...(typeof current === 'string' ? { title: current } : current), description: v };
                update('featured_ppf', 'benefits', benefits);
              }} />
            </div>
          ); })}
        </div>
      )}
      {activeTab === 'featured_wrap' && (
        <div className="admin-card">
          <Field label="Label" value={wrap.label} onChange={(v) => update('featured_wrap', 'label', v)} />
          <Field label="Heading" value={wrap.heading} onChange={(v) => update('featured_wrap', 'heading', v)} />
          <Area label="Description" value={wrap.description} onChange={(v) => update('featured_wrap', 'description', v)} />
          <Field label="CTA" value={wrap.cta} onChange={(v) => update('featured_wrap', 'cta', v)} />
          {(wrap.finishes || []).map((item, i: number) => (
            <div key={i} className="admin-form-grid">
              <Field label="Finish" value={item.label} onChange={(v) => {
                const finishes = [...(wrap.finishes || [])];
                finishes[i] = { ...finishes[i], label: v };
                update('featured_wrap', 'finishes', finishes);
              }} />
              <Field label="Description" value={item.description || item.desc} onChange={(v) => {
                const finishes = [...(wrap.finishes || [])];
                finishes[i] = { ...finishes[i], description: v };
                update('featured_wrap', 'finishes', finishes);
              }} />
            </div>
          ))}
        </div>
      )}
      {activeTab === 'featured_detailing' && (
        <FeatureFields section="featured_detailing" data={detailing} update={update} uploading={uploading} onUpload={handleUpload} benefitsAsLines />
      )}

      {activeTab === 'process' && (
        <div className="admin-card">
          <Field label="Heading" value={data.process?.heading} onChange={(v) => update('process', 'heading', v)} />
          <Field label="Subheading" value={data.process?.subheading} onChange={(v) => update('process', 'subheading', v)} />
          {(data.process?.steps || []).map((step, i: number) => (
            <div key={i} className="admin-step">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, marginBottom: 8 }}>
                <strong style={{ color: 'var(--white)' }}>Step {String(i + 1).padStart(2, '0')}</strong>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" className="admin-btn admin-btn-secondary" onClick={() => moveStep(data, update, i, -1)}>Up</button>
                  <button type="button" className="admin-btn admin-btn-secondary" onClick={() => moveStep(data, update, i, 1)}>Down</button>
                </div>
              </div>
              <Field label="Title" value={step.title} onChange={(v) => patchStep(data, update, i, { title: v })} />
              <Area label="Description" value={step.description} onChange={(v) => patchStep(data, update, i, { description: v })} />
              <label className="admin-check">
                <input type="checkbox" checked={step.active !== false} onChange={(e) => patchStep(data, update, i, { active: e.target.checked })} />
                Active
              </label>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'trust' && (
        <ListEditor section="trust" data={data} update={update} fields={['number', 'title']} addLabel="Add statistic" />
      )}
      {activeTab === 'why' && (
        <ListEditor section="why" data={data} update={update} fields={['number', 'title', 'text']} addLabel="Add feature" />
      )}
      {activeTab === 'compare' && (
        <div className="admin-card">
          <label className="admin-check"><input type="checkbox" checked={data.compare?.enabled !== false} onChange={(e) => update('compare', 'enabled', e.target.checked)} /> Show this section</label>
          <Field label="Heading" value={data.compare?.heading} onChange={(v) => update('compare', 'heading', v)} />
          <Area label="Description" value={data.compare?.description} onChange={(v) => update('compare', 'description', v)} />
          <Field label="Before image" value={data.compare?.before_image} onChange={(v) => update('compare', 'before_image', v)} />
          <Upload label="Upload before image" uploading={uploading} onChange={(e) => handleUpload('compare', 'before_image', e)} />
          <Field label="After image" value={data.compare?.after_image} onChange={(v) => update('compare', 'after_image', v)} />
          <Upload label="Upload after image" uploading={uploading} onChange={(e) => handleUpload('compare', 'after_image', e)} />
        </div>
      )}
      {activeTab === 'final_cta' && (
        <div className="admin-card">
          <Field label="Heading" value={data.final_cta?.heading} onChange={(v) => update('final_cta', 'heading', v)} />
          <Area label="Description" value={data.final_cta?.description} onChange={(v) => update('final_cta', 'description', v)} />
          <Field label="Primary button" value={data.final_cta?.cta} onChange={(v) => update('final_cta', 'cta', v)} />
          <Field label="Primary link" value={data.final_cta?.cta_primary_link} onChange={(v) => update('final_cta', 'cta_primary_link', v)} />
          <Field label="Secondary button" value={data.final_cta?.cta_secondary} onChange={(v) => update('final_cta', 'cta_secondary', v)} />
          <Field label="Secondary link" value={data.final_cta?.cta_secondary_link} onChange={(v) => update('final_cta', 'cta_secondary_link', v)} />
        </div>
      )}

      {activeTab === 'sections' && (
        <div className="admin-card">
          {(['services_intro', 'gallery_intro', 'location', 'contact_intro'] as const).map((key) => (
            <div key={key} className="admin-step">
              <div className="admin-card-title">{key.replace('_', ' ')}</div>
              <Field label="Label" value={data[key]?.label} onChange={(v) => update(key, 'label', v)} />
              <Field label="Heading" value={data[key]?.heading} onChange={(v) => update(key, 'heading', v)} />
              {key !== 'location' && <Area label="Description" value={data[key]?.description} onChange={(v) => update(key, 'description', v)} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function patchStep(data: Record<string, HomepageSection>, update: (s: string, f: string, v: HomepageSection[keyof HomepageSection]) => void, index: number, patch: object) {
  const steps = [...(data.process?.steps || [])];
  steps[index] = { ...steps[index], ...patch, number: String(index + 1).padStart(2, '0') };
  update('process', 'steps', steps);
}

function moveStep(data: Record<string, HomepageSection>, update: (s: string, f: string, v: HomepageSection[keyof HomepageSection]) => void, index: number, dir: number) {
  const steps = [...(data.process?.steps || [])];
  const target = index + dir;
  if (target < 0 || target >= steps.length) return;
  const [item] = steps.splice(index, 1);
  steps.splice(target, 0, item);
  update('process', 'steps', steps.map((step, i) => ({ ...step, number: String(i + 1).padStart(2, '0') })));
}

function Field({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="admin-form-group">
      <label className="admin-form-label">{label}</label>
      <input className="admin-form-input" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Area({ label, value, onChange }: { label: string; value?: string; onChange: (v: string) => void }) {
  return (
    <div className="admin-form-group">
      <label className="admin-form-label">{label}</label>
      <textarea className="admin-form-textarea" value={value || ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function Upload({ label, uploading, onChange }: { label: string; uploading: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <label className="admin-upload">
      <span>{uploading ? 'Uploading...' : label}</span>
      <input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={onChange} disabled={uploading} />
    </label>
  );
}

function ListEditor({ section, data, update, fields, addLabel }: {
  section: string;
  data: Record<string, HomepageSection>;
  update: (section: string, field: string, value: HomepageSection[keyof HomepageSection]) => void;
  fields: Array<'number' | 'title' | 'text'>;
  addLabel: string;
}) {
  const items = data[section]?.items || [];
  const setItems = (next: HomepageSection['items']) => update(section, 'items', next);
  return (
    <div className="admin-card">
      {items.map((item, index) => (
        <div key={index} className="admin-step">
          {fields.map((field) => (
            <Field key={field} label={field} value={item[field]} onChange={(value) => {
              const next = [...items];
              next[index] = { ...next[index], [field]: value };
              setItems(next);
            }} />
          ))}
          <button type="button" className="admin-btn admin-btn-danger" onClick={() => setItems(items.filter((_, itemIndex) => itemIndex !== index))}>Delete</button>
        </div>
      ))}
      <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setItems([...items, { number: String(items.length + 1).padStart(2, '0'), title: '', text: '' }])}>{addLabel}</button>
    </div>
  );
}

function FeatureFields({ section, data, update, uploading, onUpload, benefitsAsLines }: {
  section: string;
  data: HomepageSection;
  update: (section: string, field: string, value: HomepageSection[keyof HomepageSection]) => void;
  uploading: boolean;
  onUpload: (section: string, field: string, e: React.ChangeEvent<HTMLInputElement>) => void;
  benefitsAsLines?: boolean;
}) {
  return (
    <div className="admin-card">
      <Field label="Label" value={data.label} onChange={(v) => update(section, 'label', v)} />
      <Field label="Heading" value={data.heading} onChange={(v) => update(section, 'heading', v)} />
      <Field label="Subheading" value={data.subheading} onChange={(v) => update(section, 'subheading', v)} />
      <Area label="Description" value={data.description} onChange={(v) => update(section, 'description', v)} />
      {benefitsAsLines && (
        <Area label="Benefits (one per line)" value={(data.benefits || []).join('\n')} onChange={(v) => update(section, 'benefits', v.split('\n'))} />
      )}
      <Field label="CTA" value={data.cta} onChange={(v) => update(section, 'cta', v)} />
      <Field label="Image path" value={data.image} onChange={(v) => update(section, 'image', v)} />
      <Upload label="Upload image" uploading={uploading} onChange={(e) => onUpload(section, 'image', e)} />
      {data.image && <AdminImage src={data.image} alt="Section preview" />}
    </div>
  );
}
