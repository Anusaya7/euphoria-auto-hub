'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  {
    group: 'Overview',
    items: [{ href: '/admin/dashboard', label: 'Dashboard' }],
  },
  {
    group: 'Website',
    items: [
      { href: '/admin/dashboard/homepage', label: 'Home Page' },
      { href: '/admin/dashboard/services', label: 'Services' },
      { href: '/admin/dashboard/gallery', label: 'Gallery' },
      { href: '/admin/dashboard/testimonials', label: 'Testimonials' },
      { href: '/admin/dashboard/contact', label: 'Contact' },
      { href: '/admin/dashboard/enquiries', label: 'Enquiries' },
      { href: '/admin/dashboard/seo', label: 'SEO' },
    ],
  },
  {
    group: 'System',
    items: [
      { href: '/admin/dashboard/profile', label: 'Admin Profile' },
      { href: '/', label: 'View Website' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => { setOpen(false); }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <>
      <button className="admin-nav-toggle" type="button" aria-label="Open admin menu" onClick={() => setOpen(true)}>Menu</button>
      {open && <button className="admin-sidebar-backdrop" aria-label="Close admin menu" onClick={() => setOpen(false)} />}
      <aside className={`admin-sidebar${open ? ' open' : ''}`}>
        <div className="admin-sidebar-logo">
          <div className="admin-sidebar-logo-name">EUPHORIA <span>AUTO</span> HUB</div>
          <div className="admin-sidebar-logo-sub">Admin Panel</div>
        </div>
        <nav className="admin-sidebar-nav">
          {navItems.map((group) => (
            <div key={group.group} className="admin-nav-group">
              <div className="admin-nav-group-label">{group.group}</div>
              {group.items.map((item) => (
                <a key={item.href} href={item.href} className={`admin-nav-link${pathname === item.href ? ' active' : ''}`}>
                  {item.label}
                </a>
              ))}
            </div>
          ))}
          <div className="admin-logout-wrap">
            <button className="admin-nav-link" type="button" onClick={handleLogout} disabled={loggingOut}>
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
