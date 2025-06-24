import { getCachedUsersWithSubscriptions } from '../admin-data';
import { DataTable } from '../data-table';
import { columns } from './columns';

export default async function UsersPage() {
  const users = await getCachedUsersWithSubscriptions();

  return <DataTable columns={columns} data={users || []} filterKey="name" />;
}
