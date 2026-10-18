'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  {
    group: 'Overview',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard' },
    ],
  },
  {
    group: 'Website Content',
    items: [
      { href: '/admin/dashboard/homepage', label: 'Homepage Content' },
      { href: '/admin/dashboard/services', label: 'Services' },
      { href: '/admin/dashboard/packages', label: 'Packages' },
      { href: '/admin/dashboard/gallery', label: 'Gallery' },
      { href: '/admin/dashboard/before-after', label: 'Before / After' },
      { href: '/admin/dashboard/testimonials', label: 'Reviews' },
      { href: '/admin/dashboard/faqs', label: 'FAQs' },
      { href: '/admin/dashboard/contact', label: 'Contact Settings' },
    ],
  },
  {
    group: 'Bookings & Customers',
    items: [
      { href: '/admin/dashboard/bookings', label: 'Bookings' },
      { href: '/admin/dashboard/enquiries', label: 'Customers' },
      { href: '/admin/dashboard/leads', label: 'Leads' },
    ],
  },
  {
    group: 'System',
    items: [
      { href: '/admin/dashboard/seo', label: 'SEO' },
      { href: '/admin/dashboard/social', label: 'Social Links' },
      { href: '/admin/dashboard/settings', label: 'Settings' },
      { href: '/admin/dashboard/profile', label: 'Admin Profile' },
      { href: '/', label: 'Live Website' },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <>
      <button className="admin-nav-toggle" type="button" aria-label="Open admin menu" onClick={() => setOpen(true)}>
        Menu
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
          {navItems.map((group) => (
            <div key={group.group} className="admin-nav-group">
              <div className="admin-nav-group-label">{group.group}</div>
              {group.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link${pathname === item.href ? ' active' : ''}`}
                >
                  <span className="admin-nav-label">{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
          <div className="admin-logout-wrap">
            <button className="admin-nav-link admin-logout-btn" type="button" onClick={handleLogout} disabled={loggingOut}>
              <span className="admin-nav-label">{loggingOut ? 'Logging out...' : 'Logout'}</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
