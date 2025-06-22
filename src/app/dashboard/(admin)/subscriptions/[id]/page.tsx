import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { Suspense } from 'react';

import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/auth';
import { getSubsriptionById } from '../../admin-data';
import EditSubscriptionForm from './edit-subscription-form';

interface SubscriptionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function SubscriptionPage(props: SubscriptionPageProps) {
  return (
    <div className="w-full flex justify-center">
      <Suspense fallback={<EditSubscriptionSkeleton />}>
        <EditSubscription params={props.params} />
      </Suspense>
    </div>
  );
}

async function EditSubscription(props: SubscriptionPageProps) {
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

  return <EditSubscriptionForm subscription={subscription} />;
}

function EditSubscriptionSkeleton() {
  return (
    <div className="w-full max-w-xl">
      <Skeleton className="h-[400px] w-full" />
    </div>
  );
}
