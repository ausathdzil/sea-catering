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
import { MealPlanItem, mealPlans } from '@/lib/data';
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

export function MealPlans() {
  const [selectedPlan, setSelectedPlan] = useState<
    'basic' | 'premium' | 'executive'
  >('basic');

  const plans = mealPlans.find((plan) => plan.type === selectedPlan)?.items;

  return (
    <div className="w-full flex flex-col gap-4 py-8">
      <div className="flex flex-wrap items-center gap-2 md:gap-4">
        <Button
          className={`${
            selectedPlan === 'basic'
              ? 'opacity-100'
              : 'opacity-50 hover:opacity-100'
          }`}
          variant="secondary"
          size="sm"
          onClick={() => setSelectedPlan('basic')}
        >
          Basic
        </Button>
        <Button
          className={`${
            selectedPlan === 'premium'
              ? 'opacity-100'
              : 'opacity-50 hover:opacity-100'
          }`}
          variant="secondary"
          size="sm"
          onClick={() => setSelectedPlan('premium')}
        >
          Premium
        </Button>
        <Button
          className={`${
            selectedPlan === 'executive'
              ? 'opacity-100'
              : 'opacity-50 hover:opacity-100'
          }`}
          variant="secondary"
          size="sm"
          onClick={() => setSelectedPlan('executive')}
        >
          Executive
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
        {plans?.map((plan) => (
          <MealPlanCard key={plan.id} type={selectedPlan} {...plan} />
        ))}
      </div>
    </div>
  );
}

function MealPlanCard({
  type,
  name,
  price,
  description,
  details,
}: MealPlanItem & { type: 'basic' | 'premium' | 'executive' }) {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Card
          className={cn(
            'border transition-colors shadow-none gap-2',
            type === 'basic' && 'hover:border-blue-500',
            type === 'premium' && 'hover:border-purple-500',
            type === 'executive' && 'hover:border-amber-500'
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
                    type === 'basic' && 'bg-blue-500/10 text-blue-500',
                    type === 'premium' && 'bg-purple-500/10 text-purple-500',
                    type === 'executive' && 'bg-amber-500/10 text-amber-500'
                  )}
                >
                  {details.mealsPerWeek} meals
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    'hidden md:block',
                    type === 'basic' && 'border-blue-500/20 text-blue-500',
                    type === 'premium' &&
                      'border-purple-500/20 text-purple-500',
                    type === 'executive' && 'border-amber-500/20 text-amber-500'
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
                  type === 'basic' && 'text-blue-500',
                  type === 'premium' && 'text-purple-500',
                  type === 'executive' && 'text-amber-500'
                )}
              />
              <span>{details.deliveryDays.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <ClockIcon
                className={cn(
                  'size-4',
                  type === 'basic' && 'text-blue-500',
                  type === 'premium' && 'text-purple-500',
                  type === 'executive' && 'text-amber-500'
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
                type === 'basic' && 'bg-blue-100 text-blue-700',
                type === 'premium' && 'bg-purple-100 text-purple-700',
                type === 'executive' && 'bg-amber-100 text-amber-700'
              )}
            >
              {details.mealsPerWeek} meals per week
            </Badge>
            {details.dietaryOptions.map((option) => (
              <Badge
                key={option}
                variant="outline"
                className={cn(
                  type === 'basic' && 'border-blue-200 text-blue-700',
                  type === 'premium' && 'border-purple-200 text-purple-700',
                  type === 'executive' && 'border-amber-200 text-amber-700'
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
                    type === 'basic' && 'text-blue-500',
                    type === 'premium' && 'text-purple-500',
                    type === 'executive' && 'text-amber-500'
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
                    type === 'basic' && 'text-blue-500',
                    type === 'premium' && 'text-purple-500',
                    type === 'executive' && 'text-amber-500'
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
                    type === 'basic' && 'text-blue-500',
                    type === 'premium' && 'text-purple-500',
                    type === 'executive' && 'text-amber-500'
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
                    type === 'basic' && 'text-blue-500',
                    type === 'premium' && 'text-purple-500',
                    type === 'executive' && 'text-amber-500'
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
