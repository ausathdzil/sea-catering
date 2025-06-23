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
