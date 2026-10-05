'use client';
import { useState, useEffect } from 'react';
import type { AlertState, Enquiry } from '@/lib/types';

export default function EnquiriesAdminPage() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState('All');
  const [alert, setAlert] = useState<AlertState>(null);

  const load = async () => { const r = await fetch('/api/enquiries'); setItems(await r.json()); };
  useEffect(() => { load(); }, []);
  const showAlert = (type: 'success' | 'error', msg: string) => { setAlert({ type, msg }); setTimeout(() => setAlert(null), 3000); };

  const handleStatus = async (id: number, status: string) => {
    await fetch(`/api/enquiries/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    showAlert('success', `Marked as ${status}`);
    load();
  };

  const markRead = async (id: number) => {
    await fetch(`/api/enquiries/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_read: true }) });
    showAlert('success', 'Enquiry marked as read.');
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this enquiry?')) return;
    await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
    showAlert('success', 'Enquiry deleted.');
    load();
  };

  const [query, setQuery] = useState('');
  const filters = ['All', 'NEW', 'CONTACTED', 'IN PROGRESS', 'COMPLETED', 'CANCELLED', 'CLOSED'];
  const filtered = items.filter((item) => (filter === 'All' || item.status === filter) && `${item.first_name} ${item.last_name} ${item.email} ${item.mobile} ${item.message}`.toLowerCase().includes(query.toLowerCase()));
  const newCount = items.filter(i => i.status === 'NEW').length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 700, color: 'var(--white)' }}>
            Enquiries
            {newCount > 0 && <span style={{ marginLeft: 12, background: '#c0392b', color: '#fff', fontSize: 14, padding: '2px 10px', borderRadius: 100 }}>{newCount} New</span>}
          </h1>
          <p style={{ color: 'var(--soft-grey)', fontSize: 14, marginTop: 4 }}>Customer enquiries submitted through the website contact form.</p>
        </div>
      </div>
      {alert && <div className={`admin-alert admin-alert-${alert.type}`}>{alert.msg}</div>}

      <input className="admin-form-input" placeholder="Search name, phone, email or message" value={query} onChange={(event) => setQuery(event.target.value)} style={{ maxWidth: 420, marginBottom: 16 }} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '8px 20px', borderRadius: 100, border: '1px solid', cursor: 'pointer', fontSize: 13, fontFamily: 'var(--font-heading)', fontWeight: 500, transition: 'all 0.2s', background: filter === f ? 'rgba(192,57,43,0.15)' : 'transparent', borderColor: filter === f ? 'var(--red)' : 'var(--dark-grey)', color: filter === f ? 'var(--red)' : 'var(--soft-grey)' }}>
            {f}
          </button>
        ))}
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--soft-grey)', padding: '48px 0' }}>No {filter !== 'All' ? filter.toLowerCase() : ''} enquiries.</p>
        ) : (
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Mobile</th><th>Message</th><th>Status</th><th>Date</th><th>Actions</th></tr></thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className={e.status === 'NEW' ? 'admin-row-new' : ''}>
                  <td style={{ color: 'var(--white)', fontWeight: 600 }}>{e.first_name} {e.last_name}</td>
                  <td><a href={`mailto:${e.email}`} style={{ color: 'var(--light-grey)', textDecoration: 'none' }}>{e.email || '—'}</a></td>
                  <td><a href={`tel:${e.mobile}`} style={{ color: 'var(--light-grey)', textDecoration: 'none' }}>{e.mobile || '—'}</a></td>
                  <td style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={e.message}>{e.message}</td>
                  <td>
                    <select
                      value={e.status}
                      onChange={ev => handleStatus(e.id, ev.target.value)}
                      style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 4, color: e.status === 'NEW' ? '#81C784' : e.status === 'CONTACTED' ? '#64B5F6' : 'var(--soft-grey)', padding: '4px 8px', fontSize: 13, cursor: 'pointer' }}
                    >
                      {['NEW', 'CONTACTED', 'IN PROGRESS', 'COMPLETED', 'CANCELLED', 'CLOSED'].map((status) => <option key={status} value={status}>{status}</option>)}
                    </select>
                  </td>
                  <td style={{ whiteSpace: 'nowrap' }}>{new Date(e.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {!e.is_read && <button className="admin-btn admin-btn-secondary" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => markRead(e.id)}>Mark read</button>}
                      {e.email && <a href={`mailto:${e.email}?subject=Euphoria Auto Hub - Your Enquiry`} className="admin-btn admin-btn-secondary" style={{ fontSize: 12, padding: '6px 12px', textDecoration: 'none' }}>Reply</a>}
                      <button className="admin-btn admin-btn-danger" style={{ fontSize: 12, padding: '6px 12px' }} onClick={() => handleDelete(e.id)}>Delete</button>
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
