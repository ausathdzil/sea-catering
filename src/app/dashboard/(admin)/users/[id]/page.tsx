import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/auth';
import { getUser } from '../../admin-data';
import { EditUserForm } from './edit-user-form';

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserPage(props: UserPageProps) {
  return (
    <div className="w-full flex justify-center">
      <Suspense fallback={<EditUserSkeleton />}>
        <EditUser params={props.params} />
      </Suspense>
    </div>
  );
}

async function EditUser(props: UserPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  const { id } = await props.params;

  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  return <EditUserForm user={user} />;
}

function EditUserSkeleton() {
  return (
    <div className="w-full max-w-md">
      <Skeleton className="h-[300px] w-full" />
    </div>
  );
}
