import { redirect } from 'next/navigation';

import { verifySession } from '@/lib/dal';
import { DashboardHeader } from '../../dashboard-header';

export default async function SubscriptionsDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await verifySession();

  if (session.role !== 'admin') {
    redirect('/dashboard');
  }

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Subscriptions" />
      <main className="@container/main flex flex-1 flex-col gap-4 p-8">
        {children}
      </main>
    </div>
  );
}
