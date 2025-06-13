import { getMealPlans } from '@/db/data';
import { SubscriptionForm } from './subscription-form';
import { Suspense } from 'react';

export default async function SubscriptionPage() {
  const mealPlans = await getMealPlans();

  return (
    <main className="w-full min-h-[500px] max-w-6xl flex-1 flex flex-col items-center justify-center gap-8 p-8 md:px-2">
      <div className="space-y-2 text-center">
        <h1 className="font-dm-sans text-4xl font-semibold">
          Create your own plan
        </h1>
        <p className="text-muted-foreground">
          Customize your meal plan to suit your lifestyle and dietary
          preferences
        </p>
      </div>
      <Suspense fallback={<></>}>
        <SubscriptionForm mealPlans={mealPlans} />
      </Suspense>
    </main>
  );
}
