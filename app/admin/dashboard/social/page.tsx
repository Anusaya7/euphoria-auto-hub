'use client';

import { useEffect, useState } from 'react';

type LinkRow = { platform: string; display_name: string; url: string; enabled: number; display_order: number };

export default function SocialAdminPage() {
  const [links, setLinks] = useState<LinkRow[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/social').then((res) => res.json()).then((body) => { if (Array.isArray(body)) setLinks(body); });
  }, []);

  const update = (platform: string, patch: Partial<LinkRow>) => {
    setLinks((rows) => rows.map((row) => (row.platform === platform ? { ...row, ...patch } : row)));
  };

  const save = async () => {
    setSaving(true);
    setMessage('');
    setError('');
    const res = await fetch('/api/social', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ links }),
    });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    if (res.ok) setMessage(body.message || 'Social links updated successfully.');
    else setError(body.error || 'Unable to save changes. Please try again.');
  };

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Social Media</h1>
          <p>Enabled links appear in the public footer. Leave a URL empty to hide that platform.</p>
        </div>
        <button className="admin-btn admin-btn-primary" type="button" onClick={save} disabled={saving}>{saving ? 'Saving...' : 'Save Social Links'}</button>
      </div>
      {message && <div className="admin-alert admin-alert-success">{message}</div>}
      {error && <div className="admin-alert admin-alert-error">{error}</div>}
      {links.map((link) => (
        <div key={link.platform} className="admin-card">
          <div className="admin-card-title">{link.display_name || link.platform}</div>
          <div className="admin-form-group">
            <label className="admin-form-label">Display name</label>
            <input className="admin-form-input" value={link.display_name} onChange={(event) => update(link.platform, { display_name: event.target.value })} />
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">URL</label>
            <input className="admin-form-input" value={link.url} placeholder="https://" onChange={(event) => update(link.platform, { url: event.target.value })} />
          </div>
          <label className="admin-check">
            <input type="checkbox" checked={Boolean(link.enabled)} onChange={(event) => update(link.platform, { enabled: event.target.checked ? 1 : 0 })} />
            Show on the website
          </label>
        </div>
      ))}
    </div>
  );
}
