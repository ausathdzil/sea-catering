import { headers } from 'next/headers';
import { forbidden } from 'next/navigation';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { getSession } from '@/lib/auth';
import { DataTable } from '../data-table';
import { columns } from './columns';
import { getSubscriptionsWithUsers } from './subscriptions-data';

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={<SubscriptionsSkeleton />}>
      <Subscriptions />
    </Suspense>
  );
}

async function Subscriptions() {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') {
    forbidden();
  }

  const subscriptions = await getSubscriptionsWithUsers();

  return (
    <DataTable
      columns={columns}
      data={subscriptions || []}
      filterKey="subscriptions"
    />
  );
}

function SubscriptionsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}
