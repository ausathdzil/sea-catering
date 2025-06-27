import { redirect } from 'next/navigation';

import { verifySession } from '@/lib/dal';
import { getCachedSubscriptionsWithUsers } from '../admin-data';
import { DataTable } from '../data-table';
import { columns } from './columns';

export default async function SubscriptionsPage() {
  const session = await verifySession();

  if (session.role !== 'admin') {
    redirect('/dashboard');
  }

  const subscriptions = await getCachedSubscriptionsWithUsers();

  return (
    <DataTable
      columns={columns}
      data={subscriptions || []}
      filterKey="subscriptions"
    />
  );
}
