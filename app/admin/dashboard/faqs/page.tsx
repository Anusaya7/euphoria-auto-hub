'use client';

import { useEffect, useState } from 'react';

type Faq = { id?: number; question: string; answer: string; category: string; display_order: number; is_active: number };
const EMPTY: Faq = { question: '', answer: '', category: 'General', display_order: 0, is_active: 1 };

export default function FaqsAdminPage() {
  const [rows, setRows] = useState<Faq[]>([]);
  const [draft, setDraft] = useState<Faq>(EMPTY);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const load = () => fetch('/api/faqs').then((res) => res.json()).then((body) => { if (Array.isArray(body)) setRows(body); });
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    const res = await fetch('/api/faqs', { method: draft.id ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(draft) });
    const body = await res.json().catch(() => ({}));
    setSaving(false);
    setMessage(body.message || body.error || 'Unable to save changes. Please try again.');
    if (res.ok) { setDraft(EMPTY); load(); }
  };

  const remove = async (id?: number) => {
    if (!id || !window.confirm('Are you sure you want to delete this item?')) return;
    await fetch(`/api/faqs?id=${id}`, { method: 'DELETE' });
    load();
  };

  return (
    <div>
      <div className="admin-page-head"><div><h1>FAQs</h1><p>Active answers appear on the public homepage.</p></div></div>
      {message && <div className="admin-alert admin-alert-success">{message}</div>}
      <div className="admin-card">
        <div className="admin-form-group"><label className="admin-form-label">Question</label><input className="admin-form-input" value={draft.question} onChange={(event) => setDraft({ ...draft, question: event.target.value })} /></div>
        <div className="admin-form-group"><label className="admin-form-label">Answer</label><textarea className="admin-form-textarea" value={draft.answer} onChange={(event) => setDraft({ ...draft, answer: event.target.value })} /></div>
        <div className="admin-form-group"><label className="admin-form-label">Category</label><input className="admin-form-input" value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })} /></div>
        <label className="admin-check"><input type="checkbox" checked={Boolean(draft.is_active)} onChange={(event) => setDraft({ ...draft, is_active: event.target.checked ? 1 : 0 })} /> Active</label>
        <button className="admin-btn admin-btn-primary" type="button" disabled={saving} onClick={save}>{saving ? 'Saving...' : draft.id ? 'Update FAQ' : 'Add FAQ'}</button>
      </div>
      {rows.length === 0 ? <p className="admin-empty">No FAQs added yet.</p> : rows.map((row) => (
        <div key={row.id} className="admin-card">
          <strong>{row.question}</strong>
          <p>{row.answer}</p>
          <button className="admin-btn admin-btn-secondary" type="button" onClick={() => setDraft(row)}>Edit</button>
          <button className="admin-btn admin-btn-danger" type="button" onClick={() => remove(row.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
