'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bell,
  Bot,
  Calendar,
  CircleHelp,
  Columns2,
  ExternalLink,
  House,
  Images,
  Inbox,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Package,
  Search,
  Settings,
  Share2,
  Star,
  UserRound,
  Wrench,
  X,
} from 'lucide-react';

const groups = [
  {
    group: 'Overview',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    group: 'Website Content',
    items: [
      { href: '/admin/dashboard/homepage', label: 'Homepage Content', icon: House },
      { href: '/admin/dashboard/services', label: 'Services', icon: Wrench },
      { href: '/admin/dashboard/packages', label: 'Packages', icon: Package },
      { href: '/admin/dashboard/gallery', label: 'Gallery', icon: Images },
      { href: '/admin/dashboard/before-after', label: 'Before / After', icon: Columns2 },
      { href: '/admin/dashboard/testimonials', label: 'Reviews', icon: Star },
      { href: '/admin/dashboard/faqs', label: 'FAQs', icon: CircleHelp },
      { href: '/admin/dashboard/contact', label: 'Contact Settings', icon: MapPin },
    ],
  },
  {
    group: 'Bookings & Enquiries',
    items: [
      { href: '/admin/dashboard/bookings', label: 'Bookings', icon: Calendar },
      { href: '/admin/dashboard/enquiries', label: 'Customers', icon: Inbox },
      { href: '/admin/dashboard/leads', label: 'Leads', icon: Bot },
    ],
  },
  {
    group: 'System & SEO',
    items: [
      { href: '/admin/dashboard/seo', label: 'SEO', icon: Search },
      { href: '/admin/dashboard/social', label: 'Social Links', icon: Share2 },
      { href: '/admin/dashboard/settings', label: 'Settings', icon: Settings },
      { href: '/admin/dashboard/profile', label: 'Admin Profile', icon: UserRound },
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

  useEffect(() => {
    setOpen(false);
    setPanel(false);
  }, [pathname]);

  const loadNotes = async () => {
    try {
      const res = await fetch('/api/notifications');
      if (!res.ok) return;
      const body = await res.json();
      setNotes(body.notifications || []);
      setUnread(body.unread || 0);
    } catch {
      // ignore
    }
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

  const currentItem = groups.flatMap((group) => group.items).find((item) => item.href === pathname);
  const title = currentItem?.label || 'Dashboard';

  return (
    <div className={`admin-layout${collapsed ? ' sidebar-collapsed' : ''}`}>
      <button className="admin-nav-toggle" type="button" aria-label="Open admin menu" onClick={() => setOpen(true)}>
        <Menu size={20} />
      </button>

      {open && <button className="admin-sidebar-backdrop" aria-label="Close admin menu" onClick={() => setOpen(false)} />}

      <aside className={`admin-sidebar${open ? ' open' : ''}`}>
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-name">
            EUPHORIA <span>AUTO</span> HUB
          </div>
          <div className="admin-sidebar-logo-sub">Studio Management SaaS</div>
        </div>

        <nav className="admin-sidebar-nav">
          {groups.map((group) => (
            <div key={group.group} className="admin-nav-group">
              <div className="admin-nav-group-label">{group.group}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={`${group.group}-${item.href}`}
                    href={item.href}
                    className={`admin-nav-link${isActive ? ' active' : ''}`}
                  >
                    <Icon size={16} aria-hidden="true" />
                    <span className="admin-nav-label">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          <div className="admin-nav-group" style={{ marginTop: 8 }}>
            <div className="admin-nav-group-label">External</div>
            <a href="/" target="_blank" rel="noopener noreferrer" className="admin-nav-link">
              <ExternalLink size={16} aria-hidden="true" />
              <span className="admin-nav-label">Live Website</span>
            </a>
          </div>

          <div className="admin-logout-wrap">
            <button className="admin-nav-link admin-logout-btn" type="button" onClick={logout} disabled={loggingOut}>
              <LogOut size={16} aria-hidden="true" />
              <span className="admin-nav-label">{loggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </nav>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button
              className="admin-collapse"
              type="button"
              onClick={() => setCollapsed((value) => !value)}
              aria-label="Toggle sidebar collapse"
            >
              <Menu size={18} />
            </button>
            <div>
              <div className="admin-topbar-title">{title}</div>
              <div className="admin-crumb">Euphoria Auto Hub / {title}</div>
            </div>
          </div>

          <div className="admin-topbar-user">
            <button
              className="admin-bell"
              type="button"
              aria-label="Notifications"
              onClick={() => setPanel((value) => !value)}
            >
              <Bell size={18} />
              {unread > 0 && <span>{unread}</span>}
            </button>

            {panel && (
              <div className="admin-note-panel">
                <div className="admin-note-head">
                  <strong>Studio Notifications</strong>
                  <button type="button" onClick={markAll}>Mark all read</button>
                </div>
                {notes.slice(0, 6).length === 0 ? (
                  <p style={{ padding: 16, color: '#626873', margin: 0, fontSize: 13 }}>No unread notifications.</p>
                ) : (
                  notes.slice(0, 6).map((note) => (
                    <button
                      key={note.id}
                      type="button"
                      className={`admin-note${note.is_read ? '' : ' unread'}`}
                      onClick={() => openNote(note)}
                    >
                      <strong>{note.title}</strong>
                      <span>{note.message}</span>
                      <time>{new Date(note.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</time>
                    </button>
                  ))
                )}
                <Link
                  href="/admin/dashboard/notifications"
                  onClick={() => setPanel(false)}
                  style={{ display: 'block', padding: '10px 14px', textAlign: 'center', fontSize: 12, fontWeight: 700, color: '#D71920', borderTop: '1px solid #E1E4E8' }}
                >
                  View All Notifications →
                </Link>
              </div>
            )}

            <div className="admin-user-avatar">
              {name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="admin-user-name">{name}</div>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
