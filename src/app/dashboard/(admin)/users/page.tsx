import { headers } from 'next/headers';
import { forbidden } from 'next/navigation';
import { Suspense } from 'react';

import { Loading } from '@/components/loading';
import { getSession } from '@/lib/auth';
import { DataTable } from '../data-table';
import { columns } from './columns';
import { getUsersWithSubscriptions } from './users-data';

export default function UsersPage() {
  return (
    <Suspense fallback={<Loading />}>
      <Users />
    </Suspense>
  );
}

async function Users() {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') {
    forbidden();
  }

  const users = await getUsersWithSubscriptions(session);

  return <DataTable columns={columns} data={users || []} filterKey="name" />;
}
