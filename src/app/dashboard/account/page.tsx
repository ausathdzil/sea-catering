import { getUser } from '@/lib/dal';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '../dashboard-header';
import { EditAccountForm } from './edit-account-form';

export default async function AccountPage() {
  const user = await getUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Edit Account" />
      <main className="flex-1 flex flex-col items-center gap-8 p-8">
        <EditAccountForm user={user} />
      </main>
    </div>
  );
}
