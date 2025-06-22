import { headers } from 'next/headers';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/auth';
import { DataTable } from '../data-table';
import { columns } from './columns';
import { getUsersWithSubscriptions } from './users-data';

export default function UsersPage() {
  return (
    <Suspense fallback={<UsersSkeleton />}>
      <Users />
    </Suspense>
  );
}

async function Users() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') return null;

  const users = await getUsersWithSubscriptions();

  return <DataTable columns={columns} data={users || []} filterKey="name" />;
}

function UsersSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-9 w-full" />
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}
