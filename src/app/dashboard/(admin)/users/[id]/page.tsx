import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Loading } from '@/components/loading';
import { auth } from '@/lib/auth';
import { EditUserForm } from './edit-user-form';
import { getUser } from './user-data';

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function UserPage(props: UserPageProps) {
  return (
    <div className="w-full flex justify-center">
      <Suspense fallback={<Loading />}>
        <EditUser params={props.params} />
      </Suspense>
    </div>
  );
}

async function EditUser(props: UserPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') return null;

  const { id } = await props.params;

  const user = await getUser(id);

  if (!user) {
    notFound();
  }

  return <EditUserForm user={user} />;
}
