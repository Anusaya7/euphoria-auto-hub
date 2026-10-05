import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ProfileForm from './ProfileForm';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/admin/login');
  return <ProfileForm name={session.name} email={session.email} />;
}
