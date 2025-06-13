import { getSession } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div className="flex-1 flex flex-col">
      <header className="p-4 flex items-center justify-center border-b">
        <h1 className="font-semibold">Subscriptions</h1>
      </header>
      <main></main>
    </div>
  );
}
