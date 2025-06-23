import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';

import { auth } from '@/lib/auth';
import { getSubsriptionById } from '../../admin-data';
import EditSubscriptionForm from './edit-subscription-form';

interface SubscriptionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SubscriptionPage(props: SubscriptionPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') {
    redirect('/dashboard');
  }

  const { id } = await props.params;

  const subscription = await getSubsriptionById(id);

  if (!subscription) {
    notFound();
  }

  return (
    <div className="w-full flex justify-center">
      <EditSubscriptionForm subscription={subscription} />
    </div>
  );
}
