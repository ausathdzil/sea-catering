import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { getUser } from '../../admin-data';
import { EditUserForm } from './edit-user-form';

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserPage(props: UserPageProps) {
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

  return (
    <div className="w-full flex justify-center">
      <EditUserForm user={user} />
    </div>
  );
}
