import { notFound } from 'next/navigation';

import { getCachedUserById } from '../../admin-data';
import { UpdateUserForm } from './update-user-form';

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserPage(props: UserPageProps) {
  const { id } = await props.params;

  const user = await getCachedUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="w-full flex justify-center">
      <UpdateUserForm user={user} />
    </div>
  );
}
