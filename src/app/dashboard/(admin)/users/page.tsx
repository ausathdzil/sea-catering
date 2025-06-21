import { headers } from 'next/headers';
import { forbidden } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { DataTable } from '../data-table';
import { getUsersWithSubscriptions } from './users-data';
import { columns } from './columns';

export default async function UsersPage() {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') {
    forbidden();
  }

  const users = await getUsersWithSubscriptions(session);

  return <DataTable columns={columns} data={users || []} filterKey="name" />;
}
