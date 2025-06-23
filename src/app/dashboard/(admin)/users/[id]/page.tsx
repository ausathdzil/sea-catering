import { unstable_cache as cache } from 'next/cache';
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

  const getCachedUser = cache(
    async () => {
      return getUser(id);
    },
    [`user-${id}`],
    {
      tags: [`user-${id}`],
      revalidate: 3600,
    }
  );

  const user = await getCachedUser();

  if (!user) {
    notFound();
  }

  return (
    <div className="w-full flex justify-center">
      <EditUserForm user={user} />
    </div>
  );
}
