import { DashboardHeader } from '../dashboard-header';
import { UpdateAccountForm } from './update-account-form';

export default function AccountPage() {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Account" />
      <main className="flex-1 flex flex-col items-center gap-8 p-8">
        <h2 className="text-lg font-medium">Update Name</h2>
        <UpdateAccountForm />
      </main>
    </div>
  );
}
