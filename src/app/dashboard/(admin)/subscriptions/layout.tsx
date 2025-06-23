
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { DashboardHeader } from '../../dashboard-header';

export default async function SubscriptionsDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') {
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
