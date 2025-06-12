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

export function MealPlans({ plans }: { plans: MealPlan[] }) {
  const [selectedPlan, setSelectedPlan] =
    useState<(typeof mealPlanCategoryEnum)['enumValues'][number]>('diet');

  const filteredPlans = plans.filter((plan) => plan.category === selectedPlan);

  return (
    <div className="w-full flex flex-col gap-4 py-8">
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
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
        <div className="flex-1 flex justify-end">
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
          <MealPlanCard key={plan.id} {...plan} />
        ))}
      </div>
    </div>
  );
}

function MealPlanCard({
  name,
  description,
  category,
  price,
  details,
}: MealPlan) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Card
          className={cn(
            'border transition-colors shadow-none gap-2',
            category === 'diet' && 'hover:border-blue-500',
            category === 'protein' && 'hover:border-purple-500',
            category === 'royal' && 'hover:border-amber-500'
          )}
        >
          <CardHeader>
            <div className="flex flex-col">
              <CardTitle className="text-xl font-semibold font-dm-sans">
                {name}
              </CardTitle>
              <div className="mt-2 flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={cn(
                    category === 'diet' && 'bg-blue-500/10 text-blue-500',
                    category === 'protein' &&
                      'bg-purple-500/10 text-purple-500',
                    category === 'royal' && 'bg-amber-500/10 text-amber-500'
                  )}
                >
                  {details.mealsPerWeek} meals
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    'hidden md:block',
                    category === 'diet' && 'border-blue-500/20 text-blue-500',
                    category === 'protein' &&
                      'border-purple-500/20 text-purple-500',
                    category === 'royal' && 'border-amber-500/20 text-amber-500'
                  )}
                >
                  {details.dietaryOptions[0]}
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
            <div className="space-y-2">
              <p className="text-xl md:text-3xl font-semibold tabluar-nums">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(price)}
                <span className="text-sm font-normal text-muted-foreground ml-1">
                  /week
                </span>
              </p>
            </div>
            <p className="hidden md:block text-sm text-muted-foreground">
              {description}
            </p>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-2 mt-4">
            <div className="flex items-center gap-2 text-sm">
              <CalendarIcon
                className={cn(
                  'size-4',
                  category === 'diet' && 'text-blue-500',
                  category === 'protein' && 'text-purple-500',
                  category === 'royal' && 'text-amber-500'
                )}
              />
              <span>{details.deliveryDays.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon
                className={cn(
                  'size-4',
                  category === 'diet' && 'text-blue-500',
                  category === 'protein' && 'text-purple-500',
                  category === 'royal' && 'text-amber-500'
                )}
              />
              <span>{details.cancellationPolicy}</span>
            </div>
          </CardFooter>
        </Card>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="text-xl md:text-3xl font-bold">
            {name}
          </DrawerTitle>
          <DrawerDescription className="text-xs md:text-lg">
            {description}
          </DrawerDescription>
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
            <Badge
              variant="secondary"
              className={cn(
                category === 'diet' && 'bg-blue-100 text-blue-700',
                category === 'protein' && 'bg-purple-100 text-purple-700',
                category === 'royal' && 'bg-amber-100 text-amber-700'
              )}
            >
              {details.mealsPerWeek} meals per week
            </Badge>
            {details.dietaryOptions.map((option) => (
              <Badge
                key={option}
                variant="outline"
                className={cn(
                  category === 'diet' && 'border-blue-200 text-blue-700',
                  category === 'protein' && 'border-purple-200 text-purple-700',
                  category === 'royal' && 'border-amber-200 text-amber-700'
                )}
              >
                {option}
              </Badge>
            ))}
          </div>
        </DrawerHeader>
        <div className="w-full flex justify-center overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 p-6 md:p-8">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <CalendarIcon
                  className={cn(
                    'size-5',
                    category === 'diet' && 'text-blue-500',
                    category === 'protein' && 'text-purple-500',
                    category === 'royal' && 'text-amber-500'
                  )}
                />
                <div>
                  <h4 className="font-semibold">Delivery Schedule</h4>
                  <p className="text-muted-foreground">
                    {details.deliveryDays.join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <UtensilsIcon
                  className={cn(
                    'size-5',
                    category === 'diet' && 'text-blue-500',
                    category === 'protein' && 'text-purple-500',
                    category === 'royal' && 'text-amber-500'
                  )}
                />
                <div>
                  <h4 className="font-semibold">Dietary Options</h4>
                  <p className="text-muted-foreground">
                    {details.dietaryOptions.join(', ')}
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <ChefHatIcon
                  className={cn(
                    'size-5',
                    category === 'diet' && 'text-blue-500',
                    category === 'protein' && 'text-purple-500',
                    category === 'royal' && 'text-amber-500'
                  )}
                />
                <div>
                  <h4 className="font-semibold">Customization</h4>
                  <p className="text-muted-foreground">
                    {details.customization}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <ClockIcon
                  className={cn(
                    'size-5',
                    category === 'diet' && 'text-blue-500',
                    category === 'protein' && 'text-purple-500',
                    category === 'royal' && 'text-amber-500'
                  )}
                />
                <div>
                  <h4 className="font-semibold">Cancellation Policy</h4>
                  <p className="text-muted-foreground">
                    {details.cancellationPolicy}
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
