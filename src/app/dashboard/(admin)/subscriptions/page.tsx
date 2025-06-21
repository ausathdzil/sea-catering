import { headers } from 'next/headers';
import { forbidden } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { DataTable } from '../data-table';
import { getSubscriptionsWithUsers } from './subscriptions-data';
import { columns } from './columns';
import { Suspense } from 'react';
import { Loading } from '@/components/loading';

export default function SubscriptionsPage() {
  return (
    <Suspense fallback={<Loading />}>
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

  const subscriptions = await getSubscriptionsWithUsers(session);

  return (
    <DataTable
      columns={columns}
      data={subscriptions || []}
      filterKey="subscriptions"
    />
  );
}
