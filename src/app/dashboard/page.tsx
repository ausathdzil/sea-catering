import { headers } from 'next/headers';
import { unauthorized } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { AdminDashboard } from './(admin)/admin-dashboard';
import { UserDashboard } from './(user)/user-dashboard';

interface DashboardPageProps {
  searchParams: Promise<{
    start?: string;
    end?: string;
  }>;
}

export default async function DashboardPage(props: DashboardPageProps) {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session) {
    unauthorized();
  }

  const userRole = session.user.role;

  const { start, end } = await props.searchParams;

  if (userRole === 'admin') {
    return <AdminDashboard start={start} end={end} />;
  } else if (userRole === 'user') {
    return <UserDashboard />;
  } else {
    unauthorized();
  }
}
