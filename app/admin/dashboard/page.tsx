import Link from 'next/link';
import {
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Inbox,
  PlusCircle,
  TrendingUp,
  Users,
  Wrench,
} from 'lucide-react';
import { getDb } from '@/lib/db';
import type { CountRow, Enquiry } from '@/lib/types';
import { getSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const session = await getSession();
  const db = getDb();
  const count = (sql: string) => (db.prepare(sql).get() as CountRow).c;

  // Actual backend records
  const stats = {
    totalBookings: count('SELECT COUNT(*) as c FROM bookings'),
    pendingBookings: count("SELECT COUNT(*) as c FROM bookings WHERE status = 'Pending'"),
    confirmedBookings: count("SELECT COUNT(*) as c FROM bookings WHERE status = 'Confirmed'"),
    completedBookings: count("SELECT COUNT(*) as c FROM bookings WHERE status = 'Completed'"),
    newEnquiries: count("SELECT COUNT(*) as c FROM enquiries WHERE status IN ('NEW', 'New')"),
    publishedServices: count('SELECT COUNT(*) as c FROM services WHERE is_active = 1'),
    totalLeads: count('SELECT COUNT(*) as c FROM leads'),
    totalGallery: count('SELECT COUNT(*) as c FROM gallery_images WHERE is_active = 1'),
  };

  const recentBookings = db
    .prepare('SELECT id, booking_code, name, service_name, status, created_at FROM bookings ORDER BY datetime(created_at) DESC, id DESC LIMIT 5')
    .all() as { id: number; booking_code: string; name: string; service_name: string; status: string; created_at: string }[];

  const recentEnquiries = db
    .prepare('SELECT id, first_name, last_name, mobile, message, status, created_at FROM enquiries ORDER BY datetime(created_at) DESC, id DESC LIMIT 5')
    .all() as Enquiry[];

  const recentLeads = db
    .prepare('SELECT id, name, phone, service, status, created_at FROM leads ORDER BY datetime(created_at) DESC, id DESC LIMIT 5')
    .all() as { id: number; name: string; phone: string; service: string; status: string; created_at: string }[];

  const activity = db
    .prepare('SELECT id, title, message, created_at FROM admin_notifications ORDER BY datetime(created_at) DESC, id DESC LIMIT 6')
    .all() as { id: number; title: string; message: string; created_at: string }[];

  const requiredMetrics = [
    { label: 'Total Bookings', value: stats.totalBookings, desc: 'All received requests', icon: Calendar, color: '#D71920' },
    { label: 'Pending Bookings', value: stats.pendingBookings, desc: 'Awaiting studio confirmation', icon: Clock, color: '#F59E0B' },
    { label: 'Confirmed Bookings', value: stats.confirmedBookings, desc: 'Approved studio appointments', icon: CheckCircle2, color: '#10B981' },
    { label: 'Completed Bookings', value: stats.completedBookings, desc: 'Finished vehicle details', icon: CheckCircle2, color: '#3B82F6' },
    { label: 'New Enquiries', value: stats.newEnquiries, desc: 'Unread customer messages', icon: Inbox, color: '#8B5CF6' },
    { label: 'Published Services', value: stats.publishedServices, desc: 'Active services on live site', icon: Wrench, color: '#D71920' },
  ];

  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Welcome, {session?.name || 'Euphoria Admin'}</h1>
          <p>Real-time studio activity, customer bookings, and live website management.</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href="/" target="_blank" rel="noopener noreferrer" className="admin-btn admin-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <ExternalLink size={14} /> Preview Live Website
          </a>
        </div>
      </div>

      {/* 6 Required Metrics Grid */}
      <div className="admin-stats-grid">
        {requiredMetrics.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="admin-stat">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span className="admin-stat-label">{item.label}</span>
                <span style={{ width: 28, height: 28, borderRadius: 6, background: '#F4F5F7', display: 'grid', placeItems: 'center' }}>
                  <Icon size={14} color={item.color} />
                </span>
              </div>
              <div className="admin-stat-value">{item.value}</div>
              <div className="admin-stat-desc">{item.desc}</div>
            </div>
          );
        })}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="admin-card" style={{ marginTop: 24 }}>
        <div className="admin-card-title">Quick Studio Actions</div>
        <div className="admin-actions-grid">
          <Link href="/admin/dashboard/bookings" className="admin-action">
            <span className="admin-nav-mark">B</span>
            <span>Manage Bookings ({stats.pendingBookings} pending)</span>
          </Link>
          <Link href="/admin/dashboard/services" className="admin-action">
            <span className="admin-nav-mark">S</span>
            <span>Edit Services Catalog</span>
          </Link>
          <Link href="/admin/dashboard/enquiries" className="admin-action">
            <span className="admin-nav-mark">C</span>
            <span>View Customer Enquiries ({stats.newEnquiries} new)</span>
          </Link>
          <Link href="/admin/dashboard/gallery" className="admin-action">
            <span className="admin-nav-mark">G</span>
            <span>Upload Portfolio Images</span>
          </Link>
          <Link href="/admin/dashboard/packages" className="admin-action">
            <span className="admin-nav-mark">P</span>
            <span>Update Service Packages</span>
          </Link>
          <Link href="/admin/dashboard/testimonials" className="admin-action">
            <span className="admin-nav-mark">R</span>
            <span>Verify Customer Reviews</span>
          </Link>
        </div>
      </div>

      {/* Split Tables: Recent Bookings & Recent Enquiries */}
      <div className="admin-split" style={{ marginTop: 24 }}>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div className="admin-card-title" style={{ margin: 0 }}>Recent Booking Requests</div>
            <Link href="/admin/dashboard/bookings" style={{ fontSize: 13, color: '#D71920', fontWeight: 700 }}>
              View All →
            </Link>
          </div>
          {recentBookings.length === 0 ? (
            <p className="admin-empty">No booking requests recorded yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Booking Code</th>
                  <th>Customer</th>
                  <th>Service</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <strong style={{ color: '#D71920' }}>{item.booking_code}</strong>
                    </td>
                    <td>{item.name}</td>
                    <td style={{ fontSize: 13 }}>{item.service_name}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${(item.status || '').toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div className="admin-card-title" style={{ margin: 0 }}>Recent Customer Enquiries</div>
            <Link href="/admin/dashboard/enquiries" style={{ fontSize: 13, color: '#D71920', fontWeight: 700 }}>
              View All →
            </Link>
          </div>
          {recentEnquiries.length === 0 ? (
            <p className="admin-empty">No customer enquiries received yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Mobile</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentEnquiries.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.first_name} {item.last_name || ''}</strong></td>
                    <td>{item.mobile}</td>
                    <td>
                      <span className={`admin-badge admin-badge-${(item.status || '').toLowerCase()}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{new Date(item.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Split Tables: Chatbot Leads & Notifications */}
      <div className="admin-split" style={{ marginTop: 24 }}>
        <div className="admin-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div className="admin-card-title" style={{ margin: 0 }}>Recent Concierge Leads</div>
            <Link href="/admin/dashboard/leads" style={{ fontSize: 13, color: '#D71920', fontWeight: 700 }}>
              View All ({stats.totalLeads}) →
            </Link>
          </div>
          {recentLeads.length === 0 ? (
            <p className="admin-empty">No chatbot leads recorded yet.</p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Service Interest</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.phone}</td>
                    <td>{item.service || 'General enquiry'}</td>
                    <td>
                      <span className="admin-badge admin-badge-pending">
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="admin-card">
          <div className="admin-card-title">Studio Activity Feed</div>
          {activity.length === 0 ? (
            <p className="admin-empty">Studio notifications will appear here as bookings and changes happen.</p>
          ) : (
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
