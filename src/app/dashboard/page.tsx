import { verifySession } from '@/lib/dal';
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
        <Dashboard searchParams={props.searchParams} />
      </main>
    </div>
  );
}

async function Dashboard(props: DashboardPageProps) {
  const session = await verifySession();

  const { start, end } = await props.searchParams;

  return session.role === 'admin' ? (
    <AdminDashboard start={start} end={end} />
  ) : (
    <UserDashboard userId={session.userId} />
  );
}
