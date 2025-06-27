import { notFound, redirect } from 'next/navigation';

import { verifySession } from '@/lib/dal';
import { getCachedSubsriptionById } from '../../admin-data';
import { UpdateSubscriptionForm } from './update-subscription-form';

interface SubscriptionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SubscriptionPage(props: SubscriptionPageProps) {
  const session = await verifySession();

  if (session.role !== 'admin') {
    redirect('/dashboard');
  }

  const { id } = await props.params;

  const subscription = await getCachedSubsriptionById(id);

  if (!subscription) {
    notFound();
  }

  return (
    <div className="w-full flex justify-center">
      <UpdateSubscriptionForm subscription={subscription} />
    </div>
  );
}
