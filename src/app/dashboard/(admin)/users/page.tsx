import { unstable_cache as cache } from 'next/cache';

import { getUsersWithSubscriptions } from '../admin-data';
import { DataTable } from '../data-table';
import { columns } from './columns';

export default async function UsersPage() {
  const getCachedUsers = cache(
    async () => {
      return getUsersWithSubscriptions();
    },
    ['users-with-subscriptions'],
    {
      tags: ['users-with-subscriptions'],
      revalidate: 3600,
    }
  );

  const users = await getCachedUsers();

  return <DataTable columns={columns} data={users || []} filterKey="name" />;
}
