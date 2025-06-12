'use client';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { MealPlan, mealPlanCategoryEnum } from '@/db/schema';
import { cn } from '@/lib/utils';
import {
  ArrowRightIcon,
  CalendarIcon,
  ChefHatIcon,
  ClockIcon,
  UtensilsIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const MEAL_TYPE_PRICE = {
  diet: 30000,
  protein: 40000,
  royal: 60000,
};

function calculateTotalPrice(plan: MealPlan) {
  return (
    MEAL_TYPE_PRICE[plan.category] *
    plan.details.mealType.length *
    plan.details.mealsPerWeek *
    4.3
  );
}

export function MealPlans({ plans }: { plans: MealPlan[] }) {
  const [selectedPlan, setSelectedPlan] =
    useState<(typeof mealPlanCategoryEnum)['enumValues'][number]>('diet');

  const filteredPlans = plans.filter((plan) => plan.category === selectedPlan);

  return (
    <div className="w-full flex flex-col gap-4 py-8">
      <div className="flex flex-wrap items-center gap-2 md:gap-4 justify-center md:justify-start">
        <Button
          className={`${
            selectedPlan === 'diet'
              ? 'opacity-100'
              : 'opacity-50 hover:opacity-100'
          }`}
          variant="secondary"
          size="sm"
          onClick={() => setSelectedPlan('diet')}
        >
          Diet
        </Button>
        <Button
          className={`${
            selectedPlan === 'protein'
              ? 'opacity-100'
              : 'opacity-50 hover:opacity-100'
          }`}
          variant="secondary"
          size="sm"
          onClick={() => setSelectedPlan('protein')}
        >
          Protein
        </Button>
        <Button
          className={`${
            selectedPlan === 'royal'
              ? 'opacity-100'
              : 'opacity-50 hover:opacity-100'
          }`}
          variant="secondary"
          size="sm"
          onClick={() => setSelectedPlan('royal')}
        >
          Royal
        </Button>
        <div className="flex-1 flex justify-center md:justify-end">
          <Link
            href="/subscription"
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
          >
            Create your own plan
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPlans?.map((plan) => (
          <MealPlanCard key={plan.id} plan={plan} />
        ))}
      </div>
    </div>
  );
}

function MealPlanCard({ plan }: { plan: MealPlan }) {
  const totalPrice = calculateTotalPrice(plan);
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Card
          className={cn(
            'transition-colors gap-2',
            plan.category === 'diet' && 'hover:border-blue-500',
            plan.category === 'protein' && 'hover:border-purple-500',
            plan.category === 'royal' && 'hover:border-amber-500'
          )}
        >
          <CardHeader>
            <div className="flex flex-col">
              <CardTitle className="text-xl font-semibold font-dm-sans">
                {plan.name}
              </CardTitle>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    plan.category === 'diet' && 'bg-blue-500/10 text-blue-500',
                    plan.category === 'protein' &&
                      'bg-purple-500/10 text-purple-500',
                    plan.category === 'royal' &&
                      'bg-amber-500/10 text-amber-500'
                  )}
                >
                  {plan.details.mealsPerWeek} meals
                </Badge>
                {plan.details.mealType.map((type, i) => (
                  <Badge
                    key={i}
                    variant="secondary"
                    className={cn(
                      'capitalize',
                      plan.category === 'diet' &&
                        'bg-blue-500/10 text-blue-500',
                      plan.category === 'protein' &&
                        'bg-purple-500/10 text-purple-500',
                      plan.category === 'royal' &&
                        'bg-amber-500/10 text-amber-500'
                    )}
                  >
                    {type}
                  </Badge>
                ))}
                <Badge
                  variant="outline"
                  className={cn(
                    'hidden md:block',
                    plan.category === 'diet' &&
                      'border-blue-500/20 text-blue-500',
                    plan.category === 'protein' &&
                      'border-purple-500/20 text-purple-500',
                    plan.category === 'royal' &&
                      'border-amber-500/20 text-amber-500'
                  )}
                >
                  {plan.details.dietaryOptions[0]}
                </Badge>
              </div>
            </div>
            <CardAction>
              <Button size="sm" variant="secondary">
                Details
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-xl md:text-3xl font-semibold tabular-nums">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(totalPrice)}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  / week
                </span>
              </p>
            </div>
            <p className="hidden md:block text-sm text-muted-foreground">
              {plan.description}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2 mt-4">
            <div className="flex items-center gap-2">
              <CalendarIcon
                className={cn(
                  'size-3 md:size-4',
                  plan.category === 'diet' && 'text-blue-500',
                  plan.category === 'protein' && 'text-purple-500',
                  plan.category === 'royal' && 'text-amber-500'
                )}
              />
              <span className="text-xs md:text-sm">
                {plan.details.deliveryDays.join(', ')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <ClockIcon
                className={cn(
                  'size-3 md:size-4',
                  plan.category === 'diet' && 'text-blue-500',
                  plan.category === 'protein' && 'text-purple-500',
                  plan.category === 'royal' && 'text-amber-500'
                )}
              />
              <span className="text-xs md:text-sm">
                {plan.details.cancellationPolicy}
              </span>
            </div>
          </CardFooter>
        </Card>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl md:text-3xl font-bold">
            {plan.name}
          </DrawerTitle>
          <DrawerDescription className="text-xs md:text-lg">
            {plan.description}
          </DrawerDescription>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <Badge
              variant="secondary"
              className={cn(
                plan.category === 'diet' && 'bg-blue-100 text-blue-700',
                plan.category === 'protein' && 'bg-purple-100 text-purple-700',
                plan.category === 'royal' && 'bg-amber-100 text-amber-700'
              )}
            >
              {plan.details.mealsPerWeek} meals in total
            </Badge>
            <Badge
              variant="secondary"
              className={cn(
                'capitalize',
                plan.category === 'diet' && 'bg-blue-100 text-blue-700',
                plan.category === 'protein' && 'bg-purple-100 text-purple-700',
                plan.category === 'royal' && 'bg-amber-100 text-amber-700'
              )}
            >
              {plan.details.mealType}
            </Badge>
            {plan.details.dietaryOptions.map((option) => (
              <Badge
                key={option}
                variant="outline"
                className={cn(
                  plan.category === 'diet' && 'border-blue-200 text-blue-700',
                  plan.category === 'protein' &&
                    'border-purple-200 text-purple-700',
                  plan.category === 'royal' && 'border-amber-200 text-amber-700'
                )}
              >
                {option}
              </Badge>
            ))}
          </div>
        </DrawerHeader>
        <div className="w-full flex justify-center overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <CalendarIcon
                  className={cn(
                    'size-5',
                    plan.category === 'diet' && 'text-blue-500',
                    plan.category === 'protein' && 'text-purple-500',
                    plan.category === 'royal' && 'text-amber-500'
                  )}
                />
                <div>
                  <h4 className="font-semibold">Delivery Schedule</h4>
                  <p className="text-muted-foreground">
                    {plan.details.deliveryDays.join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <UtensilsIcon
                  className={cn(
                    'size-5',
                    plan.category === 'diet' && 'text-blue-500',
                    plan.category === 'protein' && 'text-purple-500',
                    plan.category === 'royal' && 'text-amber-500'
                  )}
                />
                <div>
                  <h4 className="font-semibold">Dietary Options</h4>
                  <p className="text-muted-foreground">
                    {plan.details.dietaryOptions.join(', ')}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <ChefHatIcon
                  className={cn(
                    'size-5',
                    plan.category === 'diet' && 'text-blue-500',
                    plan.category === 'protein' && 'text-purple-500',
                    plan.category === 'royal' && 'text-amber-500'
                  )}
                />
                <div>
                  <h4 className="font-semibold">Customization</h4>
                  <p className="text-muted-foreground">
                    {plan.details.customization}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ClockIcon
                  className={cn(
                    'size-5',
                    plan.category === 'diet' && 'text-blue-500',
                    plan.category === 'protein' && 'text-purple-500',
                    plan.category === 'royal' && 'text-amber-500'
                  )}
                />
                <div>
                  <h4 className="font-semibold">Cancellation Policy</h4>
                  <p className="text-muted-foreground">
                    {plan.details.cancellationPolicy}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <DrawerFooter className="flex items-center justify-center">
          <Button size="lg" variant="secondary" className="max-w-lg w-full">
            Subscribe Now
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
