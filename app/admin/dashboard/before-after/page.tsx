'use client';

import { useEffect, useState } from 'react';

type Pair = { id?: number; title: string; description: string; category: string; before_image: string; after_image: string; display_order: number; is_active: number };
const EMPTY: Pair = { title: '', description: '', category: 'Detailing', before_image: '', after_image: '', display_order: 0, is_active: 1 };
const CATEGORIES = ['Detailing', 'Paint Correction', 'Ceramic Coating', 'PPF', 'Interior', 'Polishing'];

export default function BeforeAfterAdminPage() {
  const [rows, setRows] = useState<Pair[]>([]);
  const [draft, setDraft] = useState<Pair>(EMPTY);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const load = () => fetch('/api/before-after').then((res) => res.json()).then((body) => { if (Array.isArray(body)) setRows(body); });
  useEffect(() => { load(); }, []);

  const upload = async (field: 'before_image' | 'after_image', file?: File) => {
    if (!file) return;
    const data = new FormData();
    data.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: data });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) { setMessage(body.error || 'Invalid image format.'); return; }
    setDraft((current) => ({ ...current, [field]: body.url }));
  };

  const save = async () => {
    setSaving(true);
    const res = await fetch('/api/before-after', { method: draft.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    setMessage(body.message || body.error || 'Unable to save changes. Please try again.');
    if (res.ok) { setDraft(EMPTY); load(); }
  };

  const remove = async (id?: number) => {
    if (!id || !window.confirm('Are you sure you want to delete this item?')) return;
    await fetch(`/api/before-after?id=${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="admin-page-head"><div><h1>Before / After</h1><p>Only photographs you upload are shown. Do not label studio photos as a customer transformation unless they are.</p></div></div>
      {message && <div className="admin-alert admin-alert-success">{message}</div>}
      <div className="admin-card">
        <div className="admin-form-group"><label className="admin-form-label">Title</label><input className="admin-form-input" value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} /></div>
        <div className="admin-form-group"><label className="admin-form-label">Description</label><textarea className="admin-form-textarea" value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} /></div>
        <div className="admin-form-group"><label className="admin-form-label">Category</label><select className="admin-form-select" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></div>
        <div className="admin-form-group"><label className="admin-form-label">Before image</label><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => upload('before_image', event.target.files?.[0])} /><input className="admin-form-input" value={draft.before_image} onChange={(event) => setDraft({ ...draft, before_image: event.target.value })} /></div>
        <div className="admin-form-group"><label className="admin-form-label">After image</label><input type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => upload('after_image', event.target.files?.[0])} /><input className="admin-form-input" value={draft.after_image} onChange={(event) => setDraft({ ...draft, after_image: event.target.value })} /></div>
        <label className="admin-check"><input type="checkbox" checked={Boolean(draft.is_active)} onChange={(event) => setDraft({ ...draft, is_active: event.target.checked ? 1 : 0 })} /> Visible</label>
        <button className="admin-btn admin-btn-primary" type="button" disabled={saving} onClick={save}>{saving ? 'Saving...' : draft.id ? 'Update pair' : 'Add pair'}</button>
      </div>
      {rows.length === 0 ? <p className="admin-empty">No before/after images yet.</p> : rows.map((row) => (
        <div key={row.id} className="admin-card">
          <strong>{row.title || row.category}</strong>
          <p>{row.description}</p>
          <button className="admin-btn admin-btn-secondary" type="button" onClick={() => setDraft(row)}>Edit</button>
          <button className="admin-btn admin-btn-danger" type="button" onClick={() => remove(row.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
