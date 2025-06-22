import { headers } from 'next/headers';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/auth';
import { AdminDashboard } from './(admin)/dashboard/admin-dashboard';
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
        <Suspense fallback={<DashboardSkeleton />}>
          <Dashboard searchParams={props.searchParams} />
        </Suspense>
      </main>
    </div>
  );
}

async function Dashboard(props: DashboardPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return null;

  const { start, end } = await props.searchParams;

  return session.user.role === 'admin' ? (
    <AdminDashboard start={start} end={end} />
  ) : (
    <UserDashboard userId={session.user.id} />
  );
}

async function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <Skeleton key={index} className="h-52 w-full" />
      ))}
    </div>
  );
}
