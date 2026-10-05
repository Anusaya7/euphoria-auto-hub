import AdminFrame from '@/components/admin/AdminFrame';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/admin/login');

  return <AdminFrame name={session.name || 'Euphoria Admin'}>{children}</AdminFrame>;
}
