import { headers } from 'next/headers';
import { forbidden } from 'next/navigation';
import { Suspense } from 'react';

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getSession } from '@/lib/auth';
import { DashboardHeader } from '../dashboard-header';
import {
  getMonthlyRecurringRevenue,
  getNewSubscriptions,
  getReactivations,
  getSubscriptions,
} from './admin-dashboard-data';
import { PeriodControl } from './period-control';
import { SubscriptionsChart } from './subscriptions-chart';

interface AdminDashboardProps {
  start?: string;
  end?: string;
}

export async function AdminDashboard(props: AdminDashboardProps) {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') {
    forbidden();
  }

  const { start, end } = props;

  const startDate = start ? new Date(start) : undefined;
  const endDate = end ? new Date(end) : undefined;

  const [
    newSubscriptions,
    monthlyRecurringRevenue,
    reactivations,
    subscriptions,
  ] = await Promise.all([
    getNewSubscriptions(session, startDate, endDate),
    getMonthlyRecurringRevenue(session, startDate, endDate),
    getReactivations(session, startDate, endDate),
    getSubscriptions(session),
  ]);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Admin Dashboard" />
      <main className="@container/main flex flex-1 flex-col gap-4 p-8">
        <PeriodControl />
        <div className="flex flex-col gap-4 md:gap-6">
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-gradient-to-t grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
            <Suspense fallback={<div>Loading...</div>}>
              <NewSubscriptionsCard
                newSubscriptions={newSubscriptions ?? { current: 0 }}
              />
              <MonthlyRevenueCard
                monthlyRecurringRevenue={
                  monthlyRecurringRevenue ?? {
                    current: 0,
                  }
                }
              />
              <ReactivationsCard
                reactivations={reactivations ?? { current: 0 }}
              />
            </Suspense>
          </div>
          <Suspense fallback={<div>Loading...</div>}>
            <SubscriptionsChart subscriptions={subscriptions} />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

function NewSubscriptionsCard({
  newSubscriptions,
}: {
  newSubscriptions: {
    current: number;
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>New Subscriptions</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {newSubscriptions.current}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardFooter className="text-sm">
        {newSubscriptions.current === 0
          ? 'No new subscriptions'
          : 'New subscriptions this period'}
      </CardFooter>
    </Card>
  );
}

function MonthlyRevenueCard({
  monthlyRecurringRevenue,
}: {
  monthlyRecurringRevenue: {
    current: number;
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Monthly Recurring Revenue</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
          }).format(monthlyRecurringRevenue.current)}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardFooter className="text-sm">
        {monthlyRecurringRevenue.current === 0
          ? 'No revenue this period'
          : 'Revenue from active subscriptions'}
      </CardFooter>
    </Card>
  );
}

function ReactivationsCard({
  reactivations,
}: {
  reactivations: {
    current: number;
  };
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>Reactivations</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {reactivations.current}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardFooter className="text-sm">
        {reactivations.current === 0
          ? 'No customer reactivations'
          : 'Customer reactivations this period'}
      </CardFooter>
    </Card>
  );
}
