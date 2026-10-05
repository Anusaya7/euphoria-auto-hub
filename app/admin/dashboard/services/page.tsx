'use client';
import { useCallback, useEffect, useState } from 'react';
import AdminImage from '@/components/admin/AdminImage';

interface Service {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  full_description: string;
  image: string;
  icon: string;
  display_order: number;
  is_active: number;
  is_featured: number;
}

const EMPTY: Partial<Service> = { name: '', slug: '', short_description: '', full_description: '', image: '', icon: '', display_order: 0, is_active: 1, is_featured: 0 };

export default function ServicesAdminPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Partial<Service> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const showAlert = useCallback((type: 'success' | 'error', msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3000);
  }, []);

  const load = useCallback(async () => {
    const res = await fetch('/api/services');
    const data = await res.json().catch(() => null);
    if (!res.ok || !Array.isArray(data)) {
      setServices([]);
      showAlert('error', data?.error || 'Something went wrong. Please try again.');
      return;
    }
    setServices(data);
  }, [showAlert]);

  useEffect(() => { load(); }, [load]);

  const handleSave = async () => {
    if (!editing) return;
    const method = isNew ? 'POST' : 'PUT';
    const url = isNew ? '/api/services' : `/api/services/${editing.id}`;
    const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    const data = await res.json().catch(() => ({}));
    if (res.ok) { showAlert('success', data.message || (isNew ? 'Service created successfully.' : 'Service updated successfully.')); setEditing(null); load(); }
    else showAlert('error', data.error || 'Failed to save service.');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
    if (res.ok) { showAlert('success', 'Service deleted successfully.'); load(); }
    else showAlert('error', 'Failed to delete service.');
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    setUploading(true);
    const fd = new FormData(); fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setEditing(prev => prev ? { ...prev, image: data.url } : prev);
      showAlert('success', 'Image uploaded successfully.');
    } else showAlert('error', data.error || 'Image must be JPG, PNG or WEBP.');
    setUploading(false);
  };

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  const move = async (index: number, dir: number) => {
    const sorted = [...services].sort((a, b) => a.display_order - b.display_order || a.id - b.id);
    const target = index + dir;
    if (target < 0 || target >= sorted.length) return;
    const next = [...sorted];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    await Promise.all(next.map((service, order) => fetch(`/api/services/${service.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...service, display_order: order + 1 }),
    })));
    showAlert('success', 'Service order updated.');
    load();
  };

  const ordered = [...services].sort((a, b) => a.display_order - b.display_order || a.id - b.id);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--white)' }}>Services</h1>
          <p style={{ color: 'var(--soft-grey)', fontSize: 14, marginTop: 4 }}>Manage your service offerings.</p>
        </div>
        <button className="admin-btn admin-btn-primary" onClick={() => { setEditing({ ...EMPTY }); setIsNew(true); }}>
          + Add Service
        </button>
      </div>

      {alert && <div className={`admin-alert admin-alert-${alert.type}`}>{alert.msg}</div>}

      {/* Edit Modal */}
      {editing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#161616', border: '1px solid #1e1e1e', borderRadius: 12, padding: 32, width: '100%', maxWidth: 700, maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 20, fontWeight: 700, color: 'var(--white)', marginBottom: 24 }}>
              {isNew ? 'New Service' : `Edit: ${editing.name}`}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Service Name *</label>
                <input className="admin-form-input" value={editing.name || ''} onChange={e => setEditing(p => ({ ...p!, name: e.target.value, slug: autoSlug(e.target.value) }))} placeholder="Premium Car Wash" />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Slug</label>
                <input className="admin-form-input" value={editing.slug || ''} onChange={e => setEditing(p => ({ ...p!, slug: e.target.value }))} placeholder="premium-car-wash" />
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Short Description</label>
              <input className="admin-form-input" value={editing.short_description || ''} onChange={e => setEditing(p => ({ ...p!, short_description: e.target.value }))} placeholder="Brief one-liner for service card" />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Full Description</label>
              <textarea className="admin-form-textarea" style={{ minHeight: 120 }} value={editing.full_description || ''} onChange={e => setEditing(p => ({ ...p!, full_description: e.target.value }))} placeholder="Detailed description..." />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Display Order</label>
                <input type="number" className="admin-form-input" value={editing.display_order || 0} onChange={e => setEditing(p => ({ ...p!, display_order: +e.target.value }))} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Icon</label>
                <input className="admin-form-input" value={editing.icon || ''} onChange={e => setEditing(p => ({ ...p!, icon: e.target.value }))} placeholder="droplets / shield / sparkles" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="admin-form-group">
                <label className="admin-form-label">Active</label>
                <select className="admin-form-select" value={editing.is_active} onChange={e => setEditing(p => ({ ...p!, is_active: +e.target.value }))}>
                  <option value={1}>Yes</option><option value={0}>No</option>
                </select>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Featured</label>
                <select className="admin-form-select" value={editing.is_featured} onChange={e => setEditing(p => ({ ...p!, is_featured: +e.target.value }))}>
                  <option value={0}>No</option><option value={1}>Yes</option>
                </select>
              </div>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Service Image</label>
              <input className="admin-form-input" value={editing.image || ''} onChange={e => setEditing(p => ({ ...p!, image: e.target.value }))} placeholder="/images/service-car-wash.jpg" />
              <div style={{ marginTop: 8 }}>
                <label style={{ display: 'inline-block', padding: '8px 16px', background: '#2a2a2a', borderRadius: 4, cursor: 'pointer', fontSize: 13, color: 'var(--light-grey)' }}>
                  {uploading ? 'Uploading...' : '📎 Upload Image'}
                  <input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
                </label>
              </div>
              {editing.image && <AdminImage src={editing.image} alt="Service preview" />}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button className="admin-btn admin-btn-primary" onClick={handleSave}>Save Service</button>
              <button className="admin-btn admin-btn-secondary" onClick={() => setEditing(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="admin-card">
        <table className="admin-table">
          <thead><tr><th>#</th><th>Service</th><th>Status</th><th>Featured</th><th>Order</th><th>Actions</th></tr></thead>
          <tbody>
            {ordered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--soft-grey)', padding: 32 }}>No services yet.</td></tr>
            )}
            {ordered.map((s, index) => (
              <tr key={s.id}>
                <td style={{ color: 'var(--soft-grey)' }}>{s.id}</td>
                <td>
                  <div style={{ fontWeight: 600, color: 'var(--white)' }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--soft-grey)', marginTop: 2 }}>{s.short_description?.slice(0, 60)}...</div>
                </td>
                <td><span className={`admin-badge admin-badge-${s.is_active ? 'active' : 'inactive'}`}>{s.is_active ? 'Active' : 'Inactive'}</span></td>
                <td><span style={{ color: s.is_featured ? '#F5A623' : 'var(--soft-grey)' }}>{s.is_featured ? '★ Yes' : '—'}</span></td>
                <td>{s.display_order}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <button className="admin-btn admin-btn-secondary" onClick={() => move(index, -1)} type="button">Up</button>
                    <button className="admin-btn admin-btn-secondary" onClick={() => move(index, 1)} type="button">Down</button>
                    <button className="admin-btn admin-btn-secondary" onClick={() => { setEditing(s); setIsNew(false); }} type="button">Edit</button>
                    <button className="admin-btn admin-btn-danger" onClick={() => handleDelete(s.id)} type="button">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
