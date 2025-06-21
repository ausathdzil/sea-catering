import { headers } from 'next/headers';
import { forbidden, notFound } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { getUser } from './user-data';
import { EditUserForm } from './edit-user-form';

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserPage(props: UserPageProps) {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') {
    forbidden();
  }

  const { id } = await props.params;

  const user = await getUser(id, session);

  if (!user) {
    notFound();
  }

  return (
    <div className="w-full flex justify-center">
      <EditUserForm user={user} />
    </div>
  );
}
