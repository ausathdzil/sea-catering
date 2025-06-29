import { verifySession } from '@/lib/dal';
import { DashboardHeader } from '../dashboard-header';
import { UpdatePasswordForm } from './update-password-form';

export default async function SecurityPage() {
  const session = await verifySession();
  if (!session) return null;

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Security" />
      <main className="flex-1 flex flex-col items-center gap-8 p-8">
        <h2 className="text-lg font-medium">Update Password</h2>
        <UpdatePasswordForm />
      </main>
    </div>
  );
}
