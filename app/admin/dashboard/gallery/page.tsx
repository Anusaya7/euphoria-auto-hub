'use client';
import { useCallback, useEffect, useState } from 'react';
import AdminImage from '@/components/admin/AdminImage';
import type { GalleryImage } from '@/lib/types';

type GalleryForm = {
  id?: number;
  title: string;
  category: string;
  image_url: string;
  alt_text: string;
  display_order: number;
  is_active: number;
};

const CATEGORIES = ['Car Wash', 'Ceramic', 'Graphene', 'PPF', 'Detailing', 'Wraps', 'Polishing', 'Interior', 'General'];

const emptyForm = { title: '', category: 'Car Wash', image_url: '', alt_text: '', display_order: 0, is_active: 1 };

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState<GalleryForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const showAlert = useCallback((type: 'success' | 'error', msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3500);
  }, []);

  const load = useCallback(async () => {
    const res = await fetch('/api/gallery');
    const data = await res.json().catch(() => null);
    if (!res.ok || !Array.isArray(data)) {
      setImages([]);
      showAlert('error', data?.error || 'Something went wrong. Please try again.');
      return;
    }
    setImages(data);
  }, [showAlert]);

  useEffect(() => { load(); }, [load]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setForm((p) => ({ ...p, image_url: data.url, title: p.title || file.name.replace(/\.[^.]+$/, '') }));
      showAlert('success', 'Image uploaded successfully.');
    } else {
      showAlert('error', data.error || 'Image must be JPG, PNG or WEBP.');
    }
    setUploading(false);
    e.target.value = '';
  };

  const handleSave = async () => {
    if (!form.image_url) { showAlert('error', 'Please upload an image.'); return; }
    const res = await fetch(editingId ? `/api/gallery/${editingId}` : '/api/gallery', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      showAlert('success', data.message || (editingId ? 'Gallery image updated successfully.' : 'Gallery image uploaded successfully.'));
      setForm(emptyForm);
      setEditingId(null);
      load();
    } else showAlert('error', data.error || 'Failed to save image.');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Remove this image from the gallery?')) return;
    const res = await fetch(`/api/gallery/${id}`, { method: 'DELETE' });
    if (res.ok) { showAlert('success', 'Gallery image deleted successfully.'); load(); }
    else showAlert('error', 'Failed to delete image.');
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    const data = await res.json().catch(() => ({}));
    if (res.ok) {
      setForm((p) => ({ ...p, image_url: data.url, title: p.title || file.name.replace(/\.[^.]+$/, '') }));
      showAlert('success', 'Image uploaded successfully.');
    } else {
      showAlert('error', data.error || 'Image must be JPG, PNG or WEBP.');
    }
    setUploading(false);
  };

  const handleToggle = async (img: GalleryImage) => {
    const res = await fetch(`/api/gallery/${img.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...img, is_active: img.is_active ? 0 : 1 }),
    });
    if (res.ok) {
      showAlert('success', img.is_active ? 'Image hidden from the website.' : 'Image is visible on the website.');
      load();
    }
  };

  const move = async (index: number, dir: number) => {
    const target = index + dir;
    if (target < 0 || target >= images.length) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    await Promise.all(next.map((img, order) => fetch(`/api/gallery/${img.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...img, display_order: order + 1 }),
    })));
    showAlert('success', 'Gallery order updated.');
    load();
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--white)' }}>Gallery</h1>
        <p style={{ color: 'var(--soft-grey)', fontSize: 14, marginTop: 4 }}>Upload JPG, PNG, or WEBP images up to 5 MB.</p>
      </div>
      {alert && <div className={`admin-alert admin-alert-${alert.type}`}>{alert.msg}</div>}

      <div className="admin-card">
        <div className="admin-card-title">{editingId ? 'Edit Image' : 'Add New Image'}</div>
        <div className="admin-split">
          <div className="admin-form-group">
            <label className="admin-form-label">Upload Image</label>
            <label
              className="admin-upload"
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();
                const file = event.dataTransfer.files?.[0];
                if (file) uploadFile(file);
              }}
            >
              <span>{uploading ? 'Uploading...' : 'Choose or drop a JPG, PNG, or WEBP'}</span>
              <input type="file" accept="image/jpeg,image/png,image/webp,.jpg,.jpeg,.png,.webp" onChange={handleFileUpload} disabled={uploading} />
            </label>
            {form.image_url && <AdminImage src={form.image_url} alt="Selected gallery preview" />}
          </div>
          <div>
            <div className="admin-form-group">
              <label className="admin-form-label">Title</label>
              <input className="admin-form-input" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Category</label>
              <select className="admin-form-select" value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Alt text</label>
              <input className="admin-form-input" value={form.alt_text} onChange={(e) => setForm((p) => ({ ...p, alt_text: e.target.value }))} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="admin-btn admin-btn-primary" type="button" onClick={handleSave} disabled={uploading || !form.image_url}>
                {editingId ? 'Save Image' : 'Add to Gallery'}
              </button>
              {editingId && <button className="admin-btn admin-btn-secondary" type="button" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
            </div>
          </div>
        </div>
      </div>

      {images.length === 0 ? (
        <p className="empty-note">No gallery images yet.</p>
      ) : (
        <div className="admin-gallery-grid">
          {images.map((img, index) => (
            <div key={img.id} className="admin-gallery-card">
              <AdminImage src={img.image_url} alt={img.alt_text || img.title || 'Gallery image'} tall />
              <div style={{ padding: 12 }}>
                <div style={{ color: 'var(--white)', fontWeight: 600 }}>{img.title || 'Untitled'}</div>
                <div style={{ color: 'var(--red)', fontSize: 12, marginTop: 4 }}>{img.category} · {img.is_active ? 'Visible' : 'Hidden'}</div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                  <button className="admin-btn admin-btn-secondary" type="button" onClick={() => move(index, -1)}>Up</button>
                  <button className="admin-btn admin-btn-secondary" type="button" onClick={() => move(index, 1)}>Down</button>
                  <button className="admin-btn admin-btn-secondary" type="button" onClick={() => { setEditingId(img.id); setForm(img); }}>Edit</button>
                  <button className="admin-btn admin-btn-secondary" type="button" onClick={() => handleToggle(img)}>{img.is_active ? 'Hide' : 'Show'}</button>
                  <button className="admin-btn admin-btn-secondary" type="button" onClick={async () => {
                    const res = await fetch(`/api/gallery/${img.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...img, show_on_home: img.show_on_home === 0 ? 1 : 0 }) });
                    if (res.ok) { showAlert('success', img.show_on_home === 0 ? 'Image will appear on the home page.' : 'Image removed from the home page.'); load(); }
                  }}>{img.show_on_home === 0 ? 'Add to home' : 'On home'}</button>
                  <button className="admin-btn admin-btn-danger" type="button" onClick={() => handleDelete(img.id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
