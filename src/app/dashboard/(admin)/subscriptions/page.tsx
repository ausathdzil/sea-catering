import { headers } from 'next/headers';
import { forbidden } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { DataTable } from '../data-table';
import { getSubscriptionsWithUsers } from './admin-subscriptions-data';
import { columns } from './columns';

export default async function SubscriptionsPage() {
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
