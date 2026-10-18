'use client';

import { useState, useEffect } from 'react';
import { Mail, Phone, Search, Trash2 } from 'lucide-react';
import type { AlertState, Enquiry } from '@/lib/types';

export default function EnquiriesAdminPage() {
  const [items, setItems] = useState<Enquiry[]>([]);
  const [filter, setFilter] = useState('All');
  const [alert, setAlert] = useState<AlertState>(null);
  const [query, setQuery] = useState('');

  const load = async () => {
    try {
      const r = await fetch('/api/enquiries');
      if (r.ok) setItems(await r.json());
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    load();
  }, []);

  const showAlert = (type: 'success' | 'error', msg: string) => {
    setAlert({ type, msg });
    setTimeout(() => setAlert(null), 3000);
  };

  const handleStatus = async (id: number, status: string) => {
    await fetch(`/api/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    showAlert('success', `Status updated to ${status}`);
    load();
  };

  const markRead = async (id: number) => {
    await fetch(`/api/enquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_read: true }),
    });
    showAlert('success', 'Enquiry marked as read');
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    await fetch(`/api/enquiries/${id}`, { method: 'DELETE' });
    showAlert('success', 'Enquiry deleted successfully');
    load();
  };

  const filters = ['All', 'NEW', 'CONTACTED', 'CONVERTED', 'IN PROGRESS', 'COMPLETED', 'CANCELLED', 'CLOSED'];
  const filtered = items.filter(
    (item) =>
      (filter === 'All' || item.status === filter) &&
      `${item.first_name} ${item.last_name} ${item.email} ${item.mobile} ${item.message}`.toLowerCase().includes(query.toLowerCase())
  );
  const newCount = items.filter((i) => i.status === 'NEW').length;

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>
            Customer Enquiries ({items.length})
            {newCount > 0 && (
              <span style={{ marginLeft: 10, background: '#D71920', color: '#fff', fontSize: 12, padding: '3px 10px', borderRadius: 999, fontWeight: 700 }}>
                {newCount} New
              </span>
            )}
          </h1>
          <p>Messages submitted through the studio contact and service enquiry forms.</p>
        </div>
      </div>

      {alert && (
        <div style={{ background: alert.type === 'success' ? '#DCFCE7' : '#FEE2E2', color: alert.type === 'success' ? '#15803D' : '#991B1B', padding: '10px 14px', borderRadius: 8, marginBottom: 16 }}>
          {alert.msg}
        </div>
      )}

      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center', marginBottom: 18 }}>
        <div style={{ position: 'relative', width: 340, maxWidth: '100%' }}>
          <input
            className="admin-form-input"
            placeholder="Search name, phone, email, or message..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            style={{ paddingLeft: 38 }}
          />
          <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            style={{
              padding: '6px 14px',
              borderRadius: 8,
              border: '1px solid',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 700,
              transition: 'all 0.15s ease',
              background: filter === f ? '#D71920' : '#FFFFFF',
              borderColor: filter === f ? '#D71920' : '#E1E4E8',
              color: filter === f ? '#FFFFFF' : '#4B5563',
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <p className="admin-empty">No enquiries found for current filter.</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Contact Details</th>
                <th>Enquiry Content</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.id} style={{ background: e.status === 'NEW' ? '#FFF5F5' : 'inherit' }}>
                  <td>
                    <strong>{e.first_name} {e.last_name || ''}</strong>
                    {!e.is_read && (
                      <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#D71920', marginLeft: 6 }} />
                    )}
                  </td>
                  <td>
                    <div>
                      <a href={`tel:${e.mobile}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#141414', fontWeight: 600 }}>
                        <Phone size={12} color="#D71920" /> {e.mobile || '—'}
                      </a>
                    </div>
                    {e.email && (
                      <div style={{ marginTop: 2 }}>
                        <a href={`mailto:${e.email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#626873', fontSize: 12 }}>
                          <Mail size={12} /> {e.email}
                        </a>
                      </div>
                    )}
                  </td>
                  <td style={{ maxWidth: 260 }}>
                    <div style={{ whiteSpace: 'pre-line', fontSize: 13, lineHeight: 1.45, color: '#374151' }}>
                      {e.message}
                    </div>
                  </td>
                  <td>
                    <select
                      value={e.status}
                      aria-label={`Status for enquiry ${e.id}`}
                      onChange={(ev) => handleStatus(e.id, ev.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 6,
                        border: '1px solid #E1E4E8',
                        background: '#FFFFFF',
                        color: '#141414',
                        fontSize: 12,
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      {filters.filter((s) => s !== 'All').map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{ whiteSpace: 'nowrap', fontSize: 12, color: '#626873' }}>
                    {new Date(e.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      {!e.is_read && (
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary"
                          style={{ minHeight: 30, padding: '0 8px', fontSize: 11 }}
                          onClick={() => markRead(e.id)}
                        >
                          Mark Read
                        </button>
                      )}
                      {e.email && (
                        <a
                          href={`mailto:${e.email}?subject=Euphoria Auto Hub - Your Service Enquiry`}
                          className="admin-btn admin-btn-secondary"
                          style={{ minHeight: 30, padding: '0 8px', fontSize: 11 }}
                        >
                          Reply
                        </a>
                      )}
                      <button
                        type="button"
                        aria-label="Delete enquiry"
                        className="admin-btn admin-btn-danger"
                        style={{ minHeight: 30, padding: '0 8px' }}
                        onClick={() => handleDelete(e.id)}
                      >
                        <Trash2 size={13} />
                      </button>
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
