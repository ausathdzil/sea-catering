'use client';

import { LoaderIcon } from 'lucide-react';

import { Tag, TagInput } from 'emblor';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useActionState, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button, buttonVariants } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { MealPlan } from '@/db/schema';
import { useSession } from '@/lib/auth-client';
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
  const [allergies, setAllergies] = useState<Tag[]>([]);
  const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

  const router = useRouter();
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
        toast.success(state.message, {
          classNames: {
            actionButton: '!bg-primary !text-primary-foreground',
          },
          action: {
            label: 'View',
            onClick: () => router.push('/dashboard'),
          },
        });
      } else {
        toast.error(state.message);
      }
    }
  }, [state, router]);

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
    <form
      className="p-4 lg:p-8 xl:p-16 flex flex-col gap-8 max-w-2xl mx-auto"
      action={formAction}
    >
      <input type="hidden" name="name" value={session.user.name} />

      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <div className="relative">
          <Input
            type="tel"
            id="phone"
            name="phone"
            className="peer ps-12 sm:ps-10"
            placeholder="8123456789"
            required
            defaultValue={state?.fields.phone}
          />
          <span className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 sm:text-sm peer-disabled:opacity-50">
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
              className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-primary has-[[aria-checked=true]]:bg-primary/10"
            >
              <RadioGroupItem
                value={mealPlan.name}
                id={mealPlan.id}
                className="mt-1 data-[state=checked]:border-primary data-[state=checked]:text-white"
                aria-label={mealPlan.name}
              />
              <div className="grid gap-1.5 font-normal">
                <p className="text-sm leading-none font-medium">
                  <span className="capitalize">{mealPlan.name}</span>
                  <br className="md:hidden" />
                  <span className="md:ml-2 text-xs text-muted-foreground">
                    {new Intl.NumberFormat('id-ID', {
                      style: 'currency',
                      currency: 'IDR',
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    }).format(mealPlan.price)}{' '}
                    /meal
                  </span>
                </p>
                <p className="hidden md:block text-muted-foreground text-sm">
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

      <div className="space-y-8">
        <div className="grid gap-2">
          <Label htmlFor="meal-type">Meal Type</Label>
          <span className="text-muted-foreground text-xs" aria-live="polite">
            Select the 1 or more meal types you want to receive
          </span>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {MEAL_TYPES.map((mealType) => (
              <div key={mealType} className="group flex items-center gap-2">
                <Checkbox
                  id={mealType}
                  value={mealType}
                  defaultChecked={mealTypes.includes(mealType)}
                  onCheckedChange={(checked) =>
                    handleMealTypeChange(mealType, checked as boolean)
                  }
                />
                <Label
                  htmlFor={mealType}
                  className="capitalize group-hover:text-primary transition-colors"
                >
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
          <span className="text-xs text-muted-foreground" aria-live="polite">
            Select the days you want to receive your meals
          </span>
          <div
            id="delivery-days"
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {DELIVERY_DAYS.map((day) => (
              <div key={day} className="group flex items-center gap-2">
                <Checkbox
                  id={day}
                  value={day}
                  defaultChecked={deliveryDays.includes(day)}
                  onCheckedChange={(checked) =>
                    handleDeliveryDayChange(day, checked as boolean)
                  }
                />
                <Label
                  htmlFor={day}
                  className="capitalize group-hover:text-primary transition-colors"
                >
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
          <TagInput
            id="allergies"
            tags={allergies}
            setTags={(newTags) => setAllergies(newTags)}
            placeholder="e.g. peanuts, eggs"
            styleClasses={{
              inlineTagsContainer:
                'border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[1px] focus-within:ring-ring p-1 gap-1',
              input: 'w-full min-w-[80px] shadow-none px-2 h-7',
              tag: {
                body: 'h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-sm ps-2 pe-7',
                closeButton:
                  'absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px] text-muted-foreground/80 hover:text-foreground',
              },
            }}
            activeTagIndex={activeTagIndex}
            setActiveTagIndex={setActiveTagIndex}
          />
          <input
            type="hidden"
            name="allergies"
            value={JSON.stringify(allergies.map((tag) => tag.text))}
          />
          <span className="text-xs text-muted-foreground" aria-live="polite">
            Enter any allergies you have, leave blank if none
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
            placeholder="My Meal Plan"
            defaultValue={state?.fields.planName}
          />
          <span className="text-xs text-muted-foreground" aria-live="polite">
            Give your plan a name
          </span>
        </div>
      </div>

      <div className="col-span-2">
        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? <LoaderIcon className="animate-spin" /> : 'Subscribe'}
        </Button>
      </div>
    </form>
  );
}
