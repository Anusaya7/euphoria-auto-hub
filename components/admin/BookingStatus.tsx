'use client';

import { useState } from 'react';

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  Pending: { bg: '#FEF3C7', text: '#B45309', border: '#FDE68A' },
  Confirmed: { bg: '#D1FAE5', text: '#065F46', border: '#A7F3D0' },
  'In Progress': { bg: '#EDE9FE', text: '#5B21B6', border: '#DDD6FE' },
  Completed: { bg: '#DBEAFE', text: '#1E40AF', border: '#BFDBFE' },
  Cancelled: { bg: '#FEE2E2', text: '#991B1B', border: '#FECACA' },
};

const STATUSES = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export default function BookingStatus({ id, status }: { id: number; status: string }) {
  const [value, setValue] = useState(status);
  const [note, setNote] = useState('');

  const change = async (next: string) => {
    const previous = value;
    setValue(next);
    setNote('');
    try {
      const res = await fetch('/api/booking', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: next }),
      });
      if (!res.ok) {
        setValue(previous);
        setNote('Error');
        return;
      }
      setNote('Saved');
      setTimeout(() => setNote(''), 2000);
    } catch {
      setValue(previous);
      setNote('Error');
    }
  };

  const currentTheme = STATUS_COLORS[value] || { bg: '#F3F4F6', text: '#374151', border: '#E5E7EB' };

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
      <select
        value={value}
        aria-label={`Status for booking ${id}`}
        onChange={(event) => change(event.target.value)}
        style={{
          background: currentTheme.bg,
          color: currentTheme.text,
          borderColor: currentTheme.border,
          borderWidth: 1,
          borderStyle: 'solid',
          borderRadius: 6,
          padding: '4px 10px',
          fontWeight: 700,
          fontSize: 12,
          cursor: 'pointer',
        }}
      >
        {STATUSES.map((item) => (
          <option key={item} value={item} style={{ background: '#FFFFFF', color: '#141414' }}>
            {item}
          </option>
        ))}
      </select>
      {note && (
        <span style={{ fontSize: 11, color: note === 'Saved' ? '#059669' : '#DC2626', fontWeight: 600 }}>
          {note}
        </span>
      )}
    </span>
  );
}
