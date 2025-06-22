import { headers } from 'next/headers';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { getSubscriptionsWithUsers } from '../admin-data';
import { DataTable } from '../data-table';
import { columns } from './columns';

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={<SubscriptionsSkeleton />}>
      <Subscriptions />
    </Suspense>
  );
}

async function Subscriptions() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard');
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
