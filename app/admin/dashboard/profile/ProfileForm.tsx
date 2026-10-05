'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ name, current_password: '', new_password: '' });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await fetch('/api/auth/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setAlert({ type: res.ok ? 'success' : 'error', msg: data.message || data.error || 'Something went wrong. Please try again.' });
    if (res.ok) {
      setForm((prev) => ({ ...prev, current_password: '', new_password: '' }));
      router.refresh();
    }
    setSaving(false);
  };

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--white)' }}>Admin Profile</h1>
        <p style={{ color: 'var(--soft-grey)', fontSize: 14, marginTop: 4 }}>Update your name or password. Email stays {email}.</p>
      </div>
      {alert && <div className={`admin-alert admin-alert-${alert.type}`}>{alert.msg}</div>}
      <form className="admin-card" onSubmit={save}>
        <div className="admin-form-group">
          <label className="admin-form-label">Name</label>
          <input className="admin-form-input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">Current password</label>
          <input type="password" className="admin-form-input" value={form.current_password} onChange={(e) => setForm((p) => ({ ...p, current_password: e.target.value }))} autoComplete="current-password" />
        </div>
        <div className="admin-form-group">
          <label className="admin-form-label">New password</label>
          <input type="password" className="admin-form-input" value={form.new_password} onChange={(e) => setForm((p) => ({ ...p, new_password: e.target.value }))} autoComplete="new-password" />
        </div>
        <button className="admin-btn admin-btn-primary" disabled={saving} type="submit">{saving ? 'Saving...' : 'Save profile'}</button>
      </form>
    </div>
  );
}
