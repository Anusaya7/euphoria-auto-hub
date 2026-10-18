'use client';
import { useState, useEffect } from 'react';
import type { AlertState, Testimonial } from '@/lib/types';

export default function TestimonialsAdminPage() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [editing, setEditing] = useState<Partial<Testimonial> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [alert, setAlert] = useState<AlertState>(null);

  const load = async () => { const r = await fetch('/api/testimonials'); setItems(await r.json()); };
  useEffect(() => { load(); }, []);
  const showAlert = (type: 'success' | 'error', msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 3000); };

  const handleSave = async () => {
    if (!editing) return;
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? '/api/testimonials' : `/api/testimonials/${editing.id}`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    if (res.ok) { showAlert('success', isNew ? 'Testimonial created successfully.' : 'Testimonial updated successfully.'); setEditing(null); load(); }
    else showAlert('error', 'Failed to save testimonial.');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
    if (res.ok) { showAlert('success', 'Testimonial deleted successfully.'); load(); }
    else showAlert('error', 'Failed to delete testimonial.');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--white)' }}>Testimonials</h1>
          <p style={{ color: 'var(--soft-grey)', fontSize: 14, marginTop: 4 }}>Manage customer reviews shown on the website.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => { setEditing({ customer_name: '', review: '', rating: 5, is_active: 1, show_on_home: 1 }); setIsNew(true); }}>
          + Add Testimonial
        </button>
      </div>
      {alert && <div className={`admin-alert admin-alert-${alert.type}`}>{alert.msg}</div>}

      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#161616', border: '1px solid #1e1e1e', borderRadius: 12, padding: 32, width: '100%', maxWidth: 560 }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--white)', marginBottom: 24 }}>
              {isNew ? 'New Testimonial' : 'Edit Testimonial'}
            </h2>
            <div className="admin-form-group">
              <label className="admin-form-label">Customer Name *</label>
              <input className="admin-form-input" value={editing.customer_name || ''} onChange={e => setEditing((p) => ({ ...p, customer_name: e.target.value }))} placeholder="Customer name" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Service</label>
              <input className="admin-form-input" value={editing.service_name || ''} onChange={e => setEditing((p) => ({ ...p, service_name: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Service</label>
              <input className="admin-form-input" value={editing.service_name || ''} onChange={e => setEditing((p) => ({ ...p, service_name: e.target.value }))} />
            </div>
            <label className="admin-check"><input type="checkbox" checked={Boolean(editing.is_verified)} onChange={e => setEditing((p) => ({ ...p, is_verified: e.target.checked ? 1 : 0 }))} /> Verified review</label>
            <div className="admin-form-group">
              <label className="admin-form-label">Review *</label>
              <textarea className="admin-form-textarea" value={editing.review || ''} onChange={e => setEditing((p) => ({ ...p, review: e.target.value }))} placeholder="Customer review..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Rating (1–5)</label>
                <select className="admin-form-select" value={editing.rating || 5} onChange={e => setEditing((p) => ({ ...p, rating: +e.target.value }))}>
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{'★'.repeat(r)} ({r})</option>)}
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Active</label>
                <select className="admin-form-select" value={editing.is_active} onChange={e => setEditing((p) => ({ ...p, is_active: +e.target.value }))}>
                  <option value={1}>Approved</option><option value={0}>Hidden</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Home page</label>
                <select className="admin-form-select" value={editing.show_on_home ?? 1} onChange={e => setEditing((p) => ({ ...p, show_on_home: +e.target.value }))}>
                  <option value={1}>Show on home</option><option value={0}>Hide from home</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button className="admin-btn admin-btn-primary" onClick={handleSave}>Save</button>
              <button className="admin-btn admin-btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-card">
        {items.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--soft-grey)', padding: '32px 0' }}>No testimonials yet.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Customer</th><th>Review</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {items.map(t => (
                <tr key={t.id}>
                  <td style={{ color: 'var(--white)', fontWeight: 600 }}>{t.customer_name}</td>
                  <td style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.review}</td>
                  <td style={{ color: '#F5A623' }}>{'★'.repeat(t.rating)}</td>
                  <td><span className={`admin-badge admin-badge-${t.is_active ? 'active' : 'inactive'}`}>{t.is_active ? 'Visible' : 'Hidden'}</span></td>
                  <td>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button className="admin-btn admin-btn-secondary" onClick={() => { setEditing(t); setIsNew(false); }}>Edit</button>
                      <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(t.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
