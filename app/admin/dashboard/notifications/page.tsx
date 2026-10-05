'use client';

import { useEffect, useState } from 'react';

type Note = { id: number; type: string; title: string; message: string; is_read: number; created_at: string };

export default function NotificationsPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filter, setFilter] = useState<'All' | 'Unread' | 'Read'>('All');
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await fetch('/api/notifications');
    const body = await res.json();
    setNotes(body.notifications || []);
  };

  useEffect(() => { load(); }, []);

  const visible = notes.filter((note) => (filter === 'Unread' ? !note.is_read : filter === 'Read' ? note.is_read : true));

  const mark = async (id: number) => {
    await fetch(`/api/notifications/${id}`, { method: 'PUT' });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm('Delete this notification?')) return;
    await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
    setMessage('Notification deleted.');
    load();
  };

  const markAll = async () => {
    await fetch('/api/notifications', { method: 'PUT' });
    setMessage('All notifications marked as read.');
    load();
  };

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Notifications</h1>
          <p>New enquiries and content updates are saved here.</p>
        </div>
        <button className="admin-btn admin-btn-secondary" type="button" onClick={markAll}>Mark all as read</button>
      </div>
      {message && <div className="admin-alert admin-alert-success">{message}</div>}
      <div className="admin-tabs">
        {(['All', 'Unread', 'Read'] as const).map((item) => (
          <button key={item} type="button" className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>
        ))}
      </div>
      <div className="admin-card">
        {visible.length === 0 ? <p className="admin-empty">No notifications in this view.</p> : visible.map((note) => (
          <article key={note.id} className={`admin-note-row${note.is_read ? '' : ' unread'}`}>
            <div>
              <strong>{note.title}</strong>
              <p>{note.message}</p>
              <time>{new Date(note.created_at).toLocaleString('en-IN')}</time>
            </div>
            <div className="admin-row-actions">
              {!note.is_read && <button className="admin-btn admin-btn-secondary" type="button" onClick={() => mark(note.id)}>Mark as read</button>}
              <button className="admin-btn admin-btn-danger" type="button" onClick={() => remove(note.id)}>Delete</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
