import { notFound } from 'next/navigation';
import { Suspense } from 'react';

import { Loading } from '@/components/loading';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import EditSubscriptionForm from './edit-subscription-form';
import { getSubsriptionById } from './subscription-data';

interface SubscriptionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SubscriptionPage(props: SubscriptionPageProps) {
  return (
    <div className="w-full flex justify-center">
      <Suspense fallback={<Loading />}>
        <EditSubscription params={props.params} />
      </Suspense>
    </div>
  );
}

async function EditSubscription(props: SubscriptionPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') return null;

  const { id } = await props.params;

  const subscription = await getSubsriptionById(id);

  if (!subscription) {
    notFound();
  }

  return <EditSubscriptionForm subscription={subscription} />;
}
