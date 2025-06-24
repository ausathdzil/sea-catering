import { notFound } from 'next/navigation';

import { getCachedSubsriptionById } from '../../admin-data';
import { UpdateSubscriptionForm } from './update-subscription-form';

interface SubscriptionPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function SubscriptionPage(props: SubscriptionPageProps) {
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
