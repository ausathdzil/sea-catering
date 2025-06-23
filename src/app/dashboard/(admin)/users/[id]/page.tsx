import { notFound } from 'next/navigation';

import { getUser } from '../../admin-data';
import { EditUserForm } from './edit-user-form';

interface UserPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function UserPage(props: UserPageProps) {
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
