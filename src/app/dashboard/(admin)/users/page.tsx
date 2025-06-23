import { getUsersWithSubscriptions } from '../admin-data';
import { DataTable } from '../data-table';
import { columns } from './columns';

export default async function UsersPage() {
  const users = await getUsersWithSubscriptions();

  return <DataTable columns={columns} data={users || []} filterKey="name" />;
}
