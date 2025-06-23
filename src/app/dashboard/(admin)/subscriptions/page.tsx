import { unstable_cache as cache } from 'next/cache';

import { getSubscriptionsWithUsers } from '../admin-data';
import { DataTable } from '../data-table';
import { columns } from './columns';

export default async function SubscriptionsPage() {
  const getCachedSubscriptions = cache(
    async () => {
      return getSubscriptionsWithUsers();
    },
    ['subscriptions-with-users'],
    {
      tags: ['subscriptions-with-users'],
      revalidate: 3600,
    }
  );

  const subscriptions = await getCachedSubscriptions();

  return (
    <DataTable
      columns={columns}
      data={subscriptions || []}
      filterKey="subscriptions"
    />
  );
}
