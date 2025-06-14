import { getMealPlans } from '@/db/data';
import { SubscriptionForm } from './subscription-form';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default async function SubscriptionPage() {
  const mealPlans = await getMealPlans();

  return (
    <main className="w-full min-h-[500px] max-w-6xl flex-1 flex flex-col items-center gap-8 p-8 md:px-2">
      <div className="space-y-2 text-center">
        <h1 className="font-dm-sans text-2xl md:text-4xl font-semibold">
          Create your own plan
        </h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Customize your meal plan to suit your lifestyle and dietary
          preferences
        </p>
      </div>
      <Suspense fallback={<SubscriptionSkeleton />}>
        <SubscriptionForm mealPlans={mealPlans} />
      </Suspense>
    </main>
  );
}

function SubscriptionSkeleton() {
  return <Skeleton className="w-full max-w-sm h-[500px] rounded-lg" />;
}
