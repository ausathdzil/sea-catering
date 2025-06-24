import { getCachedSubscriptionsWithUsers } from '../admin-data';
import { DataTable } from '../data-table';
import { columns } from './columns';

export default async function SubscriptionsPage() {
  const subscriptions = await getCachedSubscriptionsWithUsers();

  return (
    <DataTable
      columns={columns}
      data={subscriptions || []}
      filterKey="subscriptions"
    />
  );
}
