import { headers } from 'next/headers';
import { forbidden } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { DashboardHeader } from '../../dashboard-header';
import { DataTable } from '../data-table';
import { getSubscriptionsWithUsers } from './admin-subscriptions-data';
import { columns } from './columns';

export default async function SubscriptionsPage() {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') {
    forbidden();
  }

  const subscriptions = await getSubscriptionsWithUsers(session);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Subscriptions" />
      <main className="@container/main flex flex-1 flex-col gap-4 p-8">
        <DataTable
          columns={columns}
          data={subscriptions || []}
          filterKey="subscriptions"
        />
      </main>
    </div>
  );
}
