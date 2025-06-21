import { headers } from 'next/headers';

import { forbidden, notFound } from 'next/navigation';

import { getSession } from '@/lib/auth';
import { getSubsriptionById } from './subscription-data';
import EditSubscriptionForm from './edit-subscription-form';

interface SubscriptionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SubscriptionPage(props: SubscriptionPageProps) {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') {
    forbidden();
  }

  const { id } = await props.params;

  const subscription = await getSubsriptionById(id, session);

  if (!subscription) {
    notFound();
  }

  return (
    <div className="w-full flex justify-center">
      <EditSubscriptionForm subscription={subscription} />
    </div>
  );
}
