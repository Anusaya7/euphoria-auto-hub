'use client';

import { useEffect, useState } from 'react';

type PackageRow = {
  id?: number;
  name: string;
  short_description: string;
  included: string;
  benefits: string;
  price: string;
  show_price: number;
  cta: string;
  cta_link: string;
  is_featured: number;
  display_order: number;
  is_active: number;
};

const EMPTY: PackageRow = { name: '', short_description: '', included: '', benefits: '', price: '', show_price: 0, cta: 'Get a quote', cta_link: '/contact', is_featured: 0, display_order: 0, is_active: 1 };

export default function PackagesAdminPage() {
  const [rows, setRows] = useState<PackageRow[]>([]);
  const [draft, setDraft] = useState<PackageRow>(EMPTY);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  const load = () => fetch('/api/packages').then((res) => res.json()).then((body) => { if (Array.isArray(body)) setRows(body); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    setMessage('');
    const res = await fetch('/api/packages', { method: draft.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    setMessage(body.message || body.error || 'Unable to save changes. Please try again.');
    if (res.ok) { setDraft(EMPTY); load(); }
  };

  const remove = async (id?: number) => {
    if (!id || !window.confirm('Are you sure you want to delete this item?')) return;
    await fetch(`/api/packages?id=${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="admin-page-head"><div><h1>Packages</h1><p>Leave the price hidden unless the studio has confirmed a public price.</p></div></div>
      {message && <div className="admin-alert admin-alert-success">{message}</div>}
      <div className="admin-card">
        <div className="admin-form-group"><label className="admin-form-label">Name</label><input className="admin-form-input" value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} /></div>
        <div className="admin-form-group"><label className="admin-form-label">Description</label><textarea className="admin-form-textarea" value={draft.short_description} onChange={(event) => setDraft({ ...draft, short_description: event.target.value })} /></div>
        <div className="admin-form-group"><label className="admin-form-label">Included services</label><textarea className="admin-form-textarea" value={draft.included} onChange={(event) => setDraft({ ...draft, included: event.target.value })} /></div>
        <div className="admin-form-grid">
          <div className="admin-form-group"><label className="admin-form-label">Price</label><input className="admin-form-input" value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></div>
          <div className="admin-form-group"><label className="admin-form-label">Order</label><input className="admin-form-input" type="number" value={draft.display_order} onChange={(event) => setDraft({ ...draft, display_order: Number(event.target.value) })} /></div>
        </div>
        <label className="admin-check"><input type="checkbox" checked={Boolean(draft.show_price)} onChange={(event) => setDraft({ ...draft, show_price: event.target.checked ? 1 : 0 })} /> Show price publicly</label>
        <label className="admin-check"><input type="checkbox" checked={Boolean(draft.is_active)} onChange={(event) => setDraft({ ...draft, is_active: event.target.checked ? 1 : 0 })} /> Active</label>
        <button className="admin-btn admin-btn-primary" type="button" disabled={saving} onClick={save}>{saving ? 'Saving...' : draft.id ? 'Update package' : 'Add package'}</button>
      </div>
      {rows.length === 0 ? <p className="admin-empty">No packages added yet.</p> : rows.map((row) => (
        <div key={row.id} className="admin-card">
          <strong>{row.name}</strong>
          <p>{row.show_price && row.price ? row.price : 'Contact us for pricing'}</p>
          <button className="admin-btn admin-btn-secondary" type="button" onClick={() => setDraft(row)}>Edit</button>
          <button className="admin-btn admin-btn-danger" type="button" onClick={() => remove(row.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
