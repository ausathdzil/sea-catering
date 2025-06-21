import { headers } from 'next/headers';
import { forbidden } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { DashboardHeader } from '../../dashboard-header';
import { getUsersWithSubscriptions } from './admin-users-data';
import { DataTable } from '../data-table';
import { columns } from './columns';

export default async function UsersPage() {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') {
    forbidden();
  }

  const users = await getUsersWithSubscriptions(session);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Users" />
      <main className="@container/main flex flex-1 flex-col gap-4 p-8">
        <DataTable columns={columns} data={users || []} />
      </main>
    </div>
  );
}
