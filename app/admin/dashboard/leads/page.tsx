'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import { whatsappLink } from '@/lib/whatsapp';

type Lead = {
  id: number;
  name: string;
  phone: string;
  service: string;
  vehicle: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
  status: string;
  created_at: string;
};

const STATUSES = ['Pending', 'Contacted', 'Converted', 'Closed'];

export default function LeadsAdminPage() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [query, setQuery] = useState('');
  const [note, setNote] = useState('');

  const load = () =>
    fetch('/api/leads')
      .then((res) => res.json())
      .then((body) => {
        if (Array.isArray(body)) setRows(body);
        else setNote(body.error || 'Your session has expired. Please log in again.');
      });

  useEffect(() => {
    load();
  }, []);

  const update = async (id: number, status: string) => {
    const res = await fetch('/api/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) setNote('Unable to save changes. Please try again.');
    else load();
  };

  const visible = rows.filter((row) =>
    `${row.name} ${row.phone} ${row.service} ${row.vehicle} ${row.message}`.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Chatbot Concierge Leads ({rows.length})</h1>
          <p>Leads captured via the interactive AI assistant on the live website.</p>
        </div>
      </div>

      {note && (
        <div style={{ background: '#FEE2E2', color: '#991B1B', padding: '10px 14px', borderRadius: 8, marginBottom: 16 }}>
          {note}
        </div>
      )}

      <div style={{ position: 'relative', maxWidth: 360, marginBottom: 20 }}>
        <input
          className="admin-form-input"
          placeholder="Search by name, phone, or service..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          style={{ paddingLeft: 38 }}
        />
        <Search size={16} color="#9CA3AF" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      {visible.length === 0 ? (
        <div className="admin-card">
          <p className="admin-empty">No concierge leads match your search criteria.</p>
        </div>
      ) : (
        <div className="admin-card" style={{ overflowX: 'auto', padding: 0 }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone Number</th>
                <th>Vehicle</th>
                <th>Service & Notes</th>
                <th>Requested Slot</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.name}</strong></td>
                  <td>{row.phone}</td>
                  <td>{row.vehicle || '—'}</td>
                  <td>
                    <strong>{row.service || 'General enquiry'}</strong>
                    {row.message && (
                      <div style={{ fontSize: 12, color: '#626873', marginTop: 2 }}>{row.message}</div>
                    )}
                  </td>
                  <td>
                    {row.preferred_date ? (
                      <span>{row.preferred_date} {row.preferred_time || ''}</span>
                    ) : (
                      <span style={{ color: '#9CA3AF' }}>Not specified</span>
                    )}
                  </td>
                  <td>
                    <select
                      value={row.status}
                      aria-label={`Status for ${row.name}`}
                      onChange={(event) => update(row.id, event.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 6,
                        border: '1px solid #E1E4E8',
                        background: '#FFFFFF',
                        fontSize: 12,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      {STATUSES.map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <a
                      href={whatsappLink(
                        `Hi ${row.name}, this is Euphoria Auto Hub following up on your ${row.service || 'service enquiry'}.`,
                        row.phone
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="admin-btn admin-btn-secondary"
                      style={{ minHeight: 32, padding: '0 10px', fontSize: 11, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                    >
                      <MessageCircle size={12} color="#128C7E" /> WhatsApp
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
