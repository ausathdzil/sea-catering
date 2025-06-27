import { redirect } from 'next/navigation';

import { verifySession } from '@/lib/dal';
import { getCachedUsersWithSubscriptions } from '../admin-data';
import { DataTable } from '../data-table';
import { columns } from './columns';

export default async function UsersPage() {
  const session = await verifySession();

  if (session.role !== 'admin') {
    redirect('/dashboard');
  }

  const users = await getCachedUsersWithSubscriptions();

  return <DataTable columns={columns} data={users || []} filterKey="name" />;
}
