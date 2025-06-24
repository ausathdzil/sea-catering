import { DashboardHeader } from '../dashboard-header';
import { EditAccountForm } from './edit-account-form';

export default function AccountPage() {
  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Edit Account" />
      <main className="flex-1 flex flex-col items-center gap-8 p-8">
        <EditAccountForm />
      </main>
    </div>
  );
}
