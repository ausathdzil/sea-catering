import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  getCachedMonthlyRecurringRevenue,
  getCachedNewSubscriptions,
  getCachedReactivations,
  getCachedSubscriptions,
} from '../admin-data';
import { PeriodControl } from './period-control';
import { SubscriptionsChart } from './subscriptions-chart';

interface AdminDashboardProps {
  start?: string;
  end?: string;
}

export function AdminDashboard(props: AdminDashboardProps) {
  const { start, end } = props;

  const startDate = start ? new Date(start) : undefined;
  const endDate = end ? new Date(end) : undefined;

  return (
    <>
      <PeriodControl />
      <div className="flex flex-col gap-4 md:gap-6">
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:bg-gradient-to-t grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
          <NewSubscriptionsCard startDate={startDate} endDate={endDate} />
          <MonthlyRevenueCard startDate={startDate} endDate={endDate} />
          <ReactivationsCard startDate={startDate} endDate={endDate} />
        </div>
        <SubscriptionsCard />
      </div>
    </>
  );
}

async function NewSubscriptionsCard({
  startDate,
  endDate,
}: {
  startDate?: Date;
  endDate?: Date;
}) {
  const newSubscriptions = await getCachedNewSubscriptions(startDate, endDate);

  return (
    <Card>
      <CardHeader>
        <CardDescription>New Subscriptions</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {newSubscriptions}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardFooter className="text-sm">
        {newSubscriptions === 0
          ? 'No new subscriptions'
          : 'New subscriptions this period'}
      </CardFooter>
    </Card>
  );
}

async function MonthlyRevenueCard({
  startDate,
  endDate,
}: {
  startDate?: Date;
  endDate?: Date;
}) {
  const monthlyRecurringRevenue = await getCachedMonthlyRecurringRevenue(
    startDate,
    endDate
  );

  return (
    <Card>
      <CardHeader>
        <CardDescription>Monthly Recurring Revenue</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            maximumFractionDigits: 0,
          }).format(monthlyRecurringRevenue ?? 0)}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardFooter className="text-sm">
        {monthlyRecurringRevenue === 0
          ? 'No revenue this period'
          : 'Revenue from active subscriptions'}
      </CardFooter>
    </Card>
  );
}

async function ReactivationsCard({
  startDate,
  endDate,
}: {
  startDate?: Date;
  endDate?: Date;
}) {
  const reactivations = await getCachedReactivations(startDate, endDate);

  return (
    <Card>
      <CardHeader>
        <CardDescription>Reactivations</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {reactivations}
        </CardTitle>
      </CardHeader>
      <Separator />
      <CardFooter className="text-sm">
        {reactivations === 0
          ? 'No customer reactivations'
          : 'Customer reactivations this period'}
      </CardFooter>
    </Card>
  );
}

async function SubscriptionsCard() {
  const subscriptions = await getCachedSubscriptions();

  return <SubscriptionsChart subscriptions={subscriptions} />;
}
