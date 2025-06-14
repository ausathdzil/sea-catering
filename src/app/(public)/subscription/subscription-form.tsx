'use client';

import { LoaderIcon } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';

import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MealPlan } from '@/db/schema';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';
import {
  createSubscription,
  CreateSubscriptionStateOrNull,
} from './subscription-action';

const MEAL_TYPES = ['breakfast', 'lunch', 'dinner'];

const DELIVERY_DAYS = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const initialState: CreateSubscriptionStateOrNull = {
  success: false,
  message: '',
  errors: {},
  fields: {
    name: '',
    planName: '',
    phone: '',
    basePlan: '',
    mealTypes: [],
    deliveryDays: [],
    allergies: [],
  },
};

export function SubscriptionForm({ mealPlans }: { mealPlans: MealPlan[] }) {
  const [mealTypes, setMealTypes] = useState<string[]>([]);
  const [deliveryDays, setDeliveryDays] = useState<string[]>([]);

  const { data: session } = useSession();

  const createSubscriptionWithUserId = createSubscription.bind(
    null,
    session?.user.id as string
  );

  const [state, formAction, isPending] = useActionState(
    createSubscriptionWithUserId,
    initialState
  );

  useEffect(() => {
    if (state && state.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state]);

  const handleMealTypeChange = (value: string, checked: boolean) => {
    if (checked) {
      setMealTypes([...mealTypes, value]);
    } else {
      setMealTypes(mealTypes.filter((type) => type !== value));
    }
  };

  const handleDeliveryDayChange = (value: string, checked: boolean) => {
    if (checked) {
      setDeliveryDays([...deliveryDays, value]);
    } else {
      setDeliveryDays(deliveryDays.filter((day) => day !== value));
    }
  };

  if (!session) {
    return (
      <div className="flex flex-1 flex-col gap-2 items-center justify-center">
        <Link className={buttonVariants()} href="/sign-in">
          Sign in
        </Link>
        <p className="text-xs md:text-sm text-center text-muted-foreground">
          Please sign in to subscribe to a meal plan
        </p>
      </div>
    );
  }

  return (
    <form className="w-full max-w-sm mx-auto space-y-6" action={formAction}>
      <div className="grid gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input
          type="text"
          id="name"
          name="name"
          placeholder="John Doe"
          required
          minLength={1}
          maxLength={50}
          defaultValue={session.user.name}
        />
        {state?.errors?.name && (
          <span className="text-sm text-destructive">
            {state.errors.name[0]}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Input
            type="tel"
            id="phone"
            name="phone"
            className="peer ps-10"
            placeholder="8123456789"
            required
            defaultValue={state?.fields.phone}
          />
          <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-sm peer-disabled:opacity-50">
            +62
          </span>
        </div>
        {state?.errors?.phone && (
          <span className="text-sm text-destructive">
            {state.errors.phone[0]}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="base-plan">Base Meal Plan</Label>
        <RadioGroup name="base-plan" required className="flex flex-col gap-3">
          {mealPlans.map((mealPlan) => (
            <Label
              key={mealPlan.id}
              htmlFor={mealPlan.id}
              className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/10 cursor-pointer"
            >
              <RadioGroupItem
                value={mealPlan.category}
                id={mealPlan.id}
                className="mt-1 data-[state=checked]:border-primary data-[state=checked]:text-white"
                aria-label={mealPlan.name}
              />
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm leading-none font-medium">
                  {mealPlan.name}
                </p>
                <p className="text-muted-foreground text-sm">
                  {mealPlan.description}
                </p>
              </div>
            </Label>
          ))}
        </RadioGroup>
        {state?.errors?.basePlan && (
          <span className="text-sm text-destructive">
            {state.errors.basePlan[0]}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="meal-type">Meal Type</Label>
        <span className="text-muted-foreground text-xs">
          Select the 1 or more meal types you want to receive
        </span>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {MEAL_TYPES.map((mealType) => (
            <div key={mealType} className="flex items-center gap-2">
              <Checkbox
                id={mealType}
                value={mealType}
                defaultChecked={mealTypes.includes(mealType)}
                checked={mealTypes.includes(mealType)}
                onCheckedChange={(checked) =>
                  handleMealTypeChange(mealType, checked as boolean)
                }
              />
              <Label htmlFor={mealType} className="capitalize">
                {mealType}
              </Label>
            </div>
          ))}
        </div>
        {state?.errors?.mealTypes && (
          <span className="text-sm text-destructive">
            {state.errors.mealTypes[0]}
          </span>
        )}
        <input
          type="hidden"
          name="meal-types"
          value={JSON.stringify(mealTypes)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="delivery-days">Delivery Days</Label>
        <span className="text-xs text-muted-foreground">
          Select the days you want to receive your meals
        </span>
        <div
          id="delivery-days"
          className="grid grid-cols-2 md:grid-cols-3 gap-2"
        >
          {DELIVERY_DAYS.map((day) => (
            <div key={day} className="flex items-center gap-2">
              <Checkbox
                id={day}
                value={day}
                defaultChecked={deliveryDays.includes(day)}
                checked={deliveryDays.includes(day)}
                onCheckedChange={(checked) =>
                  handleDeliveryDayChange(day, checked as boolean)
                }
              />
              <Label htmlFor={day} className="capitalize">
                {day}
              </Label>
            </div>
          ))}
        </div>
        {state?.errors?.deliveryDays && (
          <span className="text-xs text-destructive">
            {state.errors.deliveryDays[0]}
          </span>
        )}
        <input
          type="hidden"
          name="delivery-days"
          value={JSON.stringify(deliveryDays)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="allergies">Allergies</Label>
        <Input type="text" id="allergies" name="allergies" />
        <span className="text-xs text-muted-foreground">
          List any allergies you have, leave blank if none
        </span>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="plan-name">Plan Name</Label>
        <Input
          type="text"
          id="plan-name"
          name="plan-name"
          required
          minLength={1}
          maxLength={50}
        />
        <span className="text-xs text-muted-foreground">
          Give your plan a name
        </span>
      </div>

      <div className="flex justify-end">
        <Button className="min-w-26" disabled={isPending} type="submit">
          {isPending ? <LoaderIcon className="animate-spin" /> : 'Subscribe'}
        </Button>
      </div>
    </form>
  );
}
