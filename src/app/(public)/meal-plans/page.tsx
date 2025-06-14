import { Suspense } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { getMealPlans } from '@/db/data';
import { MealPlan } from '@/db/schema';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export default async function MealPlansPage() {
  const plans = await getMealPlans();

  return (
    <main className="w-full max-w-6xl flex-1 flex flex-col p-8 gap-8 xl:px-2">
      <div className="space-y-2 text-center md:text-left">
        <h1 className="font-dm-sans text-xl md:text-4xl font-semibold">
          Meal Plans
        </h1>
        <p className="text-xs md:text-base text-muted-foreground">
          Choose the perfect meal plan that suits your lifestyle and dietary
          preferences.
        </p>
      </div>
      <Suspense fallback={<MealPlansSkeleton />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {plans?.map((plan) => (
            <MealPlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </Suspense>
    </main>
  );
}
function MealPlanCard({ plan }: { plan: MealPlan }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Card
          className={cn(
            'transition-colors gap-2',
            plan.name === 'diet' && 'hover:border-blue-500',
            plan.name === 'protein' && 'hover:border-purple-500',
            plan.name === 'royal' && 'hover:border-amber-500'
          )}
        >
          <CardHeader>
            <CardTitle className="text-xl font-semibold font-dm-sans capitalize">
              {plan.name}
            </CardTitle>
            <CardAction>
              <Button size="sm" variant="secondary">
                Details
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-center justify-center">
              <Image
                src={`/${plan.name.toLowerCase()}.png`}
                alt={plan.name}
                width={300}
                height={300}
                priority
                quality={100}
              />
            </div>
            <p
              className={cn(
                'text-xl md:text-3xl font-semibold tabular-nums',
                plan.name === 'diet' && 'text-blue-500',
                plan.name === 'protein' && 'text-purple-500',
                plan.name === 'royal' && 'text-amber-500'
              )}
            >
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0,
              }).format(plan.price)}
              <span className="text-sm font-normal text-muted-foreground ml-1">
                / meal
              </span>
            </p>
          </CardContent>
          <CardFooter>
            <CardDescription>{plan.description}</CardDescription>
          </CardFooter>
        </Card>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-center">
          <DrawerTitle className="capitalize text-xl md:text-2xl">
            {plan.name}
          </DrawerTitle>
          <DrawerDescription className="text-sm md:text-base">
            {plan.description}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 space-y-6">
          <div className="space-y-4 text-center">
            <h3 className="font-dm-sans text-lg md:text-xl font-semibold capitalize">
              Recommended Plan
            </h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <p className="text-sm md:text-base font-medium text-muted-foreground capitalize">
                  Meal Types
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {plan.recommendedCustomPlan.mealTypes.map((type) => (
                    <span
                      key={type}
                      className="px-2.5 md:px-3 py-1 md:py-1.5 text-xs md:text-sm rounded-full bg-secondary text-secondary-foreground capitalize"
                    >
                      {type}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm md:text-base font-medium text-muted-foreground capitalize">
                  Delivery Days
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {plan.recommendedCustomPlan.deliveryDays.map((day) => (
                    <span
                      key={day}
                      className="px-2.5 md:px-3 py-1 md:py-1.5 text-xs md:text-sm rounded-full bg-secondary text-secondary-foreground capitalize"
                    >
                      {day}
                    </span>
                  ))}
                </div>
              </div>
              {plan.recommendedCustomPlan.allergies.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm md:text-base font-medium text-muted-foreground capitalize">
                    Allergies
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {plan.recommendedCustomPlan.allergies.map((allergy) => (
                      <span
                        key={allergy}
                        className="px-2.5 md:px-3 py-1 md:py-1.5 text-xs md:text-sm rounded-full bg-destructive/10 text-destructive capitalize"
                      >
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-2">
                <p className="text-sm md:text-base font-medium text-muted-foreground capitalize">
                  Total Price
                </p>
                <p className="text-xl md:text-2xl font-semibold">
                  {new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(plan.recommendedCustomPlan.totalPrice)}
                </p>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter className="w-full max-w-sm mx-auto">
          <Link className={buttonVariants()} href="/subscription">
            Subscribe
          </Link>
          <DrawerClose asChild>
            <Button size="sm" variant="outline">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function MealPlansSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-8">
      <Skeleton className="h-[200px] rounded-lg" />
      <Skeleton className="h-[200px] rounded-lg" />
      <Skeleton className="h-[200px] rounded-lg" />
    </div>
  );
}
