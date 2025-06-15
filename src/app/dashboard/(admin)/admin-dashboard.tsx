import { getSession } from '@/lib/auth';
import { headers } from 'next/headers';
import { forbidden } from 'next/navigation';
import { DashboardHeader } from '../dashboard-header';
import {
  getMonthlyRecurringRevenue,
  getNewSubscriptions,
  getReactivations,
  getSubscriptionGrowth,
} from './admin-data';

interface AdminDashboardProps {
  searchParams: Promise<{
    startDate?: string;
    endDate?: string;
  }>;
}

function getCurrentMonthDates() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  return { startOfMonth, endOfMonth };
}

export async function AdminDashboard(props: AdminDashboardProps) {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') {
    forbidden();
  }

  const searchParams = await props.searchParams;
  const { startDate: startDateParam, endDate: endDateParam } =
    searchParams ?? {};

  const { startOfMonth, endOfMonth } = getCurrentMonthDates();

  const startDate = startDateParam ? new Date(startDateParam) : startOfMonth;
  const endDate = endDateParam ? new Date(endDateParam) : endOfMonth;

  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    return (
      <div className="flex-1 flex flex-col">
        <DashboardHeader title="Admin Dashboard" />
        <main className="flex-1 p-8 mx-auto w-full">
          <div className="text-red-500">Invalid date range provided</div>
        </main>
      </div>
    );
  }

  const [
    newSubscriptions,
    monthlyRecurringRevenue,
    reactivations,
    activeSubscriptions,
  ] = await Promise.all([
    getNewSubscriptions(session, startDate, endDate),
    getMonthlyRecurringRevenue(session, startDate, endDate),
    getReactivations(session, startDate, endDate),
    getSubscriptionGrowth(session, startDate, endDate),
  ]);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Admin Dashboard" />
      <main className="flex-1 p-8 mx-auto w-full space-y-4"></main>
    </div>
  );
}
