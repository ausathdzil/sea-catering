'use client';

import { formatDateRange } from 'little-date';
import { CalendarIcon, LoaderIcon } from 'lucide-react';
import Link from 'next/link';
import { useActionState, useEffect, useState } from 'react';
import { type DateRange } from 'react-day-picker';

import { Button, buttonVariants } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MealPlan } from '@/db/schema';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';
import {
  createSubscription,
  CreateSubscriptionStateOrNull,
} from './subscription-action';

const initialState: CreateSubscriptionStateOrNull = {
  success: false,
  message: '',
  errors: {},
  fields: {
    name: '',
    phone: '',
    basePlan: '',
    mealTypes: [],
    deliveryDays: 0,
    allergies: [],
  },
};

export function SubscriptionForm({ mealPlans }: { mealPlans: MealPlan[] }) {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [deliveryDays, setDeliveryDays] = useState<number | undefined>(
    undefined
  );

  const [mealTypes, setMealTypes] = useState<string[]>([]);

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

  const handleRange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const diffTime = Math.abs(range.to.getTime() - range.from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDeliveryDays(diffDays);
    }
    setRange(range);
  };

  const handleMealTypeChange = (value: string, checked: boolean) => {
    if (checked) {
      setMealTypes([...mealTypes, value]);
    } else {
      setMealTypes(mealTypes.filter((type) => type !== value));
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
        />
        {state?.errors?.name && (
          <span className="text-sm text-destructive">
            {state.errors.name[0]}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          type="tel"
          id="phone"
          name="phone"
          placeholder="08123456789"
          required
        />
        {state?.errors?.phone && (
          <span className="text-sm text-destructive">
            {state.errors.phone[0]}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="base-plan">Base Meal Plan</Label>
        <Select name="base-plan" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your base plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {mealPlans.map((mealPlan) => (
                <SelectItem key={mealPlan.id} value={mealPlan.category}>
                  {mealPlan.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {state?.errors?.basePlan && (
          <span className="text-sm text-destructive">
            {state.errors.basePlan[0]}
          </span>
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="meal-type">Meal Type</Label>
        <span className="text-sm text-muted-foreground">
          Select the 1 or more meal types you want to receive
        </span>
        <div id="meal-type" className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Checkbox
              id="breakfast"
              value="breakfast"
              checked={mealTypes.includes('breakfast')}
              onCheckedChange={(checked) =>
                handleMealTypeChange('breakfast', checked as boolean)
              }
            />
            <Label htmlFor="breakfast">Breakfast</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="lunch"
              value="lunch"
              checked={mealTypes.includes('lunch')}
              onCheckedChange={(checked) =>
                handleMealTypeChange('lunch', checked as boolean)
              }
            />
            <Label htmlFor="lunch">Lunch</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox
              id="dinner"
              value="dinner"
              checked={mealTypes.includes('dinner')}
              onCheckedChange={(checked) =>
                handleMealTypeChange('dinner', checked as boolean)
              }
            />
            <Label htmlFor="dinner">Dinner</Label>
          </div>
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
        <span className="text-sm text-muted-foreground">
          Select the days you want to receive your meals
        </span>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="dates"
              className="w-full justify-between text-muted-foreground"
            >
              {range?.from && range?.to
                ? formatDateRange(range.from, range.to, {
                    includeTime: false,
                  })
                : 'Select date'}
              <CalendarIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="range"
              selected={range}
              captionLayout="dropdown"
              onSelect={(range) => handleRange(range)}
              min={1}
              max={7}
            />
          </PopoverContent>
        </Popover>
        {state?.errors?.deliveryDays && (
          <span className="text-sm text-destructive">
            {state.errors.deliveryDays[0]}
          </span>
        )}
        <input type="hidden" name="delivery-days" defaultValue={deliveryDays} />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="allergies">Allergies</Label>
        <span className="text-sm text-muted-foreground">
          List any allergies or dietary restrictions you have
        </span>
        <Input
          type="text"
          id="allergies"
          name="allergies"
          placeholder="e.g. gluten, lactose, etc."
        />
      </div>

      <div className="flex justify-end">
        <Button className="min-w-26" disabled={isPending} type="submit">
          {isPending ? <LoaderIcon className="animate-spin" /> : 'Subscribe'}
        </Button>
      </div>
    </form>
  );
}
