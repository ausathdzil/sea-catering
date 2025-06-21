import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  getMonthlyRecurringRevenue,
  getNewSubscriptions,
  getReactivations,
  getSubscriptions,
} from './admin-dashboard-data';
import { PeriodControl } from './period-control';
import { SubscriptionsChart } from './subscriptions-chart';

interface AdminDashboardProps {
  role: string;
  start?: string;
  end?: string;
}

export async function AdminDashboard(props: AdminDashboardProps) {
  const { role, start, end } = props;

  const startDate = start ? new Date(start) : undefined;
  const endDate = end ? new Date(end) : undefined;

  const [
    newSubscriptions,
    monthlyRecurringRevenue,
    reactivations,
    subscriptions,
  ] = await Promise.all([
    getNewSubscriptions(role, startDate, endDate),
    getMonthlyRecurringRevenue(role, startDate, endDate),
    getReactivations(role, startDate, endDate),
    getSubscriptions(role),
  ]);

  return (
    <>
      <PeriodControl />
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-gradient-to-t grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
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
          <ReactivationsCard reactivations={reactivations ?? { current: 0 }} />
        </div>
        <SubscriptionsChart subscriptions={subscriptions} />
      </div>
    </>
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
