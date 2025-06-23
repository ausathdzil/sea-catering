import { unstable_cache as cache } from 'next/cache';
import { notFound } from 'next/navigation';

import { getSubsriptionById } from '../../admin-data';
import EditSubscriptionForm from './edit-subscription-form';

interface SubscriptionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SubscriptionPage(props: SubscriptionPageProps) {
  const { id } = await props.params;

  const getCachedSubscription = cache(
    async () => {
      return getSubsriptionById(id);
    },
    [`subscription-${id}`],
    {
      tags: [`subscription-${id}`],
      revalidate: 3600,
    }
  );

  const subscription = await getCachedSubscription();

  if (!subscription) {
    notFound();
  }

  return (
    <div className="w-full flex justify-center">
      <EditSubscriptionForm subscription={subscription} />
    </div>
  );
}
