import { DashboardHeader } from '../dashboard-header';

export function AdminDashboard() {
  return (
    <div className="flex-1 flex flex-col	">
      <DashboardHeader title="Admin Dashboard" />
      <main className="flex-1 p-8 mx-auto w-full space-y-4"></main>
    </div>
  );
}
