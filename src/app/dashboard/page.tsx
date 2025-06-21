import { headers } from 'next/headers';
import { unauthorized } from 'next/navigation';

import { Loading } from '@/components/loading';
import { getSession } from '@/lib/auth';
import { Suspense } from 'react';
import { AdminDashboard } from './(admin)/admin-dashboard';
import { UserDashboard } from './(user)/user-dashboard';
import { DashboardHeader } from './dashboard-header';

interface DashboardPageProps {
  searchParams: Promise<{
    start?: string;
    end?: string;
  }>;
}

export default function DashboardPage(props: DashboardPageProps) {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Dashboard" />
      <main className="@container/main flex-1 p-8 mx-auto w-full space-y-4">
        <Suspense fallback={<Loading />}>
          <Dashboard searchParams={props.searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

async function Dashboard(props: DashboardPageProps) {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session) {
    unauthorized();
  }

  const { start, end } = await props.searchParams;

  const userRole = session.user.role;

  return userRole === 'admin' ? (
    <AdminDashboard session={session} start={start} end={end} />
  ) : (
    <UserDashboard session={session} />
  );
}
