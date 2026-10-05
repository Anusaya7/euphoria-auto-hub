import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
  return (
    <div>
      <div className="admin-page-head">
        <div>
          <h1>Settings</h1>
          <p>Business details, your profile, and the public website live in these sections.</p>
        </div>
      </div>
      <div className="admin-actions-grid">
        <Link href="/admin/dashboard/contact" className="admin-action"><span>Contact details</span></Link>
        <Link href="/admin/dashboard/profile" className="admin-action"><span>Admin profile</span></Link>
        <Link href="/admin/dashboard/social" className="admin-action"><span>Social media</span></Link>
        <Link href="/admin/dashboard/seo" className="admin-action"><span>SEO</span></Link>
        <a href="/" target="_blank" rel="noopener noreferrer" className="admin-action"><span>View website</span></a>
      </div>
    </div>
  );
}
