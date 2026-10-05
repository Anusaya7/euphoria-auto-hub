'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const groups = [
  { group: 'Overview', items: [{ href: '/admin/dashboard', label: 'Dashboard' }] },
  {
    group: 'Website',
    items: [
      { href: '/admin/dashboard/homepage', label: 'Home Page' },
      { href: '/admin/dashboard/services', label: 'Services' },
      { href: '/admin/dashboard/gallery', label: 'Gallery' },
      { href: '/admin/dashboard/testimonials', label: 'Testimonials' },
      { href: '/admin/dashboard/contact', label: 'Contact' },
      { href: '/admin/dashboard/enquiries', label: 'Enquiries' },
      { href: '/admin/dashboard/social', label: 'Social Media' },
      { href: '/admin/dashboard/seo', label: 'SEO' },
    ],
  },
  {
    group: 'Management',
    items: [
      { href: '/admin/dashboard/notifications', label: 'Notifications' },
      { href: '/admin/dashboard/enquiries', label: 'Booking / Leads' },
    ],
  },
  {
    group: 'System',
    items: [
      { href: '/admin/dashboard/profile', label: 'Admin Profile' },
      { href: '/admin/dashboard/settings', label: 'Settings' },
      { href: '/', label: 'View Website' },
    ],
  },
];

type Note = { id: number; type: string; title: string; message: string; is_read: number; created_at: string };

export default function AdminFrame({ name, children }: { name: string; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [panel, setPanel] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [unread, setUnread] = useState(0);

  useEffect(() => { setOpen(false); setPanel(false); }, [pathname]);

  const loadNotes = async () => {
    const res = await fetch('/api/notifications');
    if (!res.ok) return;
    const body = await res.json();
    setNotes(body.notifications || []);
    setUnread(body.unread || 0);
  };

  useEffect(() => {
    loadNotes();
    const timer = window.setInterval(loadNotes, 20000);
    return () => window.clearInterval(timer);
  }, []);

  const logout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  const markAll = async () => {
    await fetch('/api/notifications', { method: 'PUT' });
    loadNotes();
  };

  const openNote = async (note: Note) => {
    if (!note.is_read) await fetch(`/api/notifications/${note.id}`, { method: 'PUT' });
    setPanel(false);
    if (note.type === 'enquiry') router.push('/admin/dashboard/enquiries');
    else router.push('/admin/dashboard/notifications');
    loadNotes();
  };

  const title = groups.flatMap((group) => group.items).find((item) => item.href === pathname)?.label || 'Dashboard';

  return (
    <div className={`admin-layout${collapsed ? ' sidebar-collapsed' : ''}`}>
      <button className="admin-nav-toggle" type="button" aria-label="Open admin menu" onClick={() => setOpen(true)}>Menu</button>
      {open && <button className="admin-sidebar-backdrop" aria-label="Close admin menu" onClick={() => setOpen(false)} />}
      <aside className={`admin-sidebar${open ? ' open' : ''}`}>
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-name">EUPHORIA <span>AUTO</span> HUB</div>
          <div className="admin-sidebar-logo-sub">Admin Panel</div>
        </div>
        <nav className="admin-sidebar-nav">
          {groups.map((group) => (
            <div key={group.group} className="admin-nav-group">
              <div className="admin-nav-group-label">{group.group}</div>
              {group.items.map((item) => (
                <a key={`${group.group}-${item.href}-${item.label}`} href={item.href} className={`admin-nav-link${pathname === item.href ? ' active' : ''}`}>
                  <span className="admin-nav-mark" aria-hidden="true">{item.label.charAt(0)}</span>
                  <span className="admin-nav-label">{item.label}</span>
                </a>
              ))}
            </div>
          ))}
          <div className="admin-logout-wrap">
            <button className="admin-nav-link" type="button" onClick={logout} disabled={loggingOut}>
              <span className="admin-nav-mark" aria-hidden="true">L</span>
              <span className="admin-nav-label">{loggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </nav>
      </aside>
      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <button className="admin-collapse" type="button" onClick={() => setCollapsed((value) => !value)} aria-label="Collapse sidebar">☰</button>
            <div className="admin-topbar-title">{title}</div>
            <div className="admin-crumb">Euphoria Auto Hub / {title}</div>
          </div>
          <div className="admin-topbar-user">
            <button className="admin-bell" type="button" aria-label="Notifications" onClick={() => setPanel((value) => !value)}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><path d="M6 8a6 6 0 1 1 12 0c0 7 3 7 3 9H3c0-2 3-2 3-9" /><path d="M10 20a2 2 0 0 0 4 0" /></svg>
              {unread > 0 && <span>{unread}</span>}
            </button>
            {panel && (
              <div className="admin-note-panel">
                <div className="admin-note-head">
                  <strong>Notifications</strong>
                  <button type="button" onClick={markAll}>Mark all as read</button>
                </div>
                {notes.slice(0, 6).length === 0 ? <p>No notifications yet.</p> : notes.slice(0, 6).map((note) => (
                  <button key={note.id} type="button" className={`admin-note${note.is_read ? '' : ' unread'}`} onClick={() => openNote(note)}>
                    <strong>{note.title}</strong>
                    <span>{note.message}</span>
                    <time>{new Date(note.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</time>
                  </button>
                ))}
                <Link href="/admin/dashboard/notifications" onClick={() => setPanel(false)}>View all notifications</Link>
              </div>
            )}
            <div className="admin-user-avatar">{name?.charAt(0).toUpperCase() || 'A'}</div>
            <div className="admin-user-name">{name}</div>
          </div>
        </header>
        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
