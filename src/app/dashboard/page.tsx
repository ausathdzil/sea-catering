import { headers } from 'next/headers';
import { unauthorized } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { AdminDashboard } from './(admin)/admin-dashboard';
import { UserDashboard } from './(user)/user-dashboard';

export default async function DashboardPage() {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session) {
    unauthorized();
  }

  const userRole = session.user.role;

  if (userRole === 'admin') {
    return <AdminDashboard />;
  } else if (userRole === 'user') {
    return <UserDashboard />;
  } else {
    unauthorized();
  }
}
