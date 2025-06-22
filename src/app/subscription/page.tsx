import { ArrowLeftIcon, Calculator, InfoIcon } from 'lucide-react';

import { headers } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';

import { buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { auth } from '@/lib/auth';
import { cn } from '@/lib/utils';
import { getMealPlans } from '../(public)/public-data';
import { SubscriptionForm } from './subscription-form';

export default function SubscriptionPage() {
  return (
    <main className="max-w-7xl mx-auto grid lg:grid-cols-2 p-4 lg:p-8">
      <div className="lg:col-span-2">
        <Link
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'lg' }),
            'font-dm-sans'
          )}
          href="/"
        >
          <ArrowLeftIcon />
          SEA Catering
        </Link>
      </div>
      <div className="flex flex-col gap-4 p-4 lg:p-8 xl:p-16">
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-semibold text-center sm:text-3xl lg:text-4xl">
            Create your own plan
          </h1>
          <p className="text-sm text-muted-foreground text-center sm:text-base">
            Customize your meal plan to suit your lifestyle and dietary
            preferences
          </p>
          <div className="w-full max-w-md mt-6 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-sm">Price Calculation Formula</h3>
            </div>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="p-3 bg-background/80 rounded border">
                <p className="font-medium mb-2">Formula:</p>
                <p className="text-muted-foreground">
                  Total Price = (Plan Price) &times; (Number of Meal Types)
                  &times; (Number of Delivery Days) &times; 4.3
                </p>
              </div>

              <div className="hidden lg:block p-3 bg-background/80 rounded border">
                <p className="font-medium mb-2">Example Calculation:</p>
                <div className="space-y-1 text-muted-foreground">
                  <p>• Plan: Protein Plan (Rp40.000 per meal)</p>
                  <p>• Meal Types: Breakfast + Dinner (2 meal types)</p>
                  <p>• Delivery Days: Monday to Friday (5 days)</p>
                  <div className="border-t pt-1 mt-2">
                    <p className="font-medium text-foreground">
                      Rp 40.000 &times; 2 &times; 5 &times; 4.3 = Rp 1.720.000
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-2 mt-3 p-2 bg-background/80 rounded text-xs">
              <InfoIcon className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                The multiplier of 4.3 represents the average number of weeks per
                month.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Suspense fallback={<SubscriptionSkeleton />}>
        <SubscriptionSection />
      </Suspense>
    </main>
  );
}

async function SubscriptionSection() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const mealPlans = await getMealPlans();

  return session ? (
    <SubscriptionForm name={session.user.name} mealPlans={mealPlans} />
  ) : (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-sm text-muted-foreground text-center sm:text-base">
        You need to sign in to create a subscription plan.
      </p>
      <Link className={buttonVariants()} href="/sign-in">
        Sign In
      </Link>
    </div>
  );
}

function SubscriptionSkeleton() {
  return <Skeleton className="size-full rounded-lg" />;
}
