import { getDb } from '@/lib/db';
import type { CountRow, Enquiry } from '@/lib/types';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getSession();
  const db = getDb();
  const stats = {
    services: (db.prepare('SELECT COUNT(*) as c FROM services WHERE is_active = 1').get() as CountRow).c,
    gallery: (db.prepare('SELECT COUNT(*) as c FROM gallery_images').get() as CountRow).c,
    testimonials: (db.prepare('SELECT COUNT(*) as c FROM testimonials WHERE is_active = 1').get() as CountRow).c,
    newEnquiries: (db.prepare("SELECT COUNT(*) as c FROM enquiries WHERE status = 'NEW'").get() as CountRow).c,
    social: (db.prepare('SELECT COUNT(*) as c FROM social_links WHERE enabled = 1 AND url != \'\'').get() as CountRow).c,
  };
  const recent = db.prepare('SELECT * FROM enquiries ORDER BY datetime(created_at) DESC, id DESC LIMIT 5').all() as Enquiry[];
  const activity = db.prepare('SELECT id, title, message, created_at FROM admin_notifications ORDER BY datetime(created_at) DESC, id DESC LIMIT 6').all() as { id: number; title: string; message: string; created_at: string }[];
  const actions = [
    { label: 'Edit Home Page', href: '/admin/dashboard/homepage' },
    { label: 'Add Service', href: '/admin/dashboard/services' },
    { label: 'Upload Photo', href: '/admin/dashboard/gallery' },
    { label: 'Add Testimonial', href: '/admin/dashboard/testimonials' },
    { label: 'View Enquiries', href: '/admin/dashboard/enquiries' },
    { label: 'Social Media', href: '/admin/dashboard/social' },
  ];

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Welcome back, {session?.name || 'Euphoria Admin'}</h1>
          <p>Manage your website, services, gallery and customer enquiries from one place.</p>
        </div>
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-secondary">Preview Website</a>
      </div>
      <div className="admin-stats-grid">
        {[
          ['Active Services', stats.services, 'Visible on the website'],
          ['Gallery Images', stats.gallery, 'Studio photographs'],
          ['Testimonials', stats.testimonials, 'Approved reviews'],
          ['New Enquiries', stats.newEnquiries, 'Waiting for a reply'],
          ['Social Links', stats.social, 'Enabled public profiles'],
        ].map(([label, value, desc]) => (
          <div key={String(label)} className="admin-stat">
            <div className="admin-stat-label">{label}</div>
            <div className="admin-stat-value">{value}</div>
            <div className="admin-stat-desc">{desc}</div>
          </div>
        ))}
      </div>
      <div className="admin-card">
        <div className="admin-card-title">Quick Actions</div>
        <div className="admin-actions-grid">
          {actions.map((action) => (
            <a key={action.label} href={action.href} className="admin-action"><span className="admin-nav-mark" aria-hidden="true">{action.label.charAt(0)}</span><span>{action.label}</span></a>
          ))}
        </div>
      </div>
      <div className="admin-split">
        <div className="admin-card">
          <div className="admin-card-title">Recent Enquiries</div>
          {recent.length === 0 ? <p className="admin-empty">No enquiries yet.</p> : (
            <table className="admin-table">
              <thead><tr><th>Name</th><th>Status</th><th>Date</th></tr></thead>
              <tbody>
                {recent.map((item) => (
                  <tr key={item.id}>
                    <td>{item.first_name} {item.last_name}</td>
                    <td>{item.status}</td>
                    <td>{new Date(item.created_at).toLocaleDateString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="admin-card">
          <div className="admin-card-title">Recent Activity</div>
          {activity.length === 0 ? <p className="admin-empty">Activity appears here when the site changes.</p> : (
            <ul className="admin-activity">
              {activity.map((item) => (
                <li key={item.id}>
                  <strong>{item.title}</strong>
                  <span>{item.message}</span>
                  <time>{new Date(item.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</time>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
