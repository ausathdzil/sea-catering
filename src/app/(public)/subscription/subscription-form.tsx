'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useState } from 'react';

const MEAL_PLAN_PRICE = {
  diet: 30000,
  protein: 40000,
  royal: 60000,
};

function calculateTotalPrice(
  mealPlan: keyof typeof MEAL_PLAN_PRICE,
  mealTypesSelected: number,
  deliveryDays: number
) {
  return MEAL_PLAN_PRICE[mealPlan] * mealTypesSelected * deliveryDays * 4.3;
}

export function SubscriptionForm() {
  const [mealPlan, setMealPlan] =
    useState<keyof typeof MEAL_PLAN_PRICE>('diet');
  const [dates, setDates] = useState({
    startDate: '',
    endDate: '',
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const data = Object.fromEntries(formData);

    const selectedMealTypes = Object.entries(data).filter(
      ([key, value]) =>
        ['breakfast', 'lunch', 'dinner'].includes(key) && value === 'on'
    ).length;

    const startDate = new Date(data['start-date'] as string);
    const endDate = new Date(data['end-date'] as string);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const deliveryDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const totalPrice = calculateTotalPrice(
      data['meal-plan'] as keyof typeof MEAL_PLAN_PRICE,
      selectedMealTypes,
      deliveryDays
    );

    console.log({
      formData: data,
      selectedMealTypes,
      deliveryDays,
      totalPrice,
    });
  };

  return (
    <form
      className="w-full max-w-2xl mx-auto space-y-6"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input type="text" id="name" name="name" placeholder="John Doe" />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input type="tel" id="phone" name="phone" placeholder="08123456789" />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="meal-plan">Meal Plan</Label>
        <Select
          id="meal-plan"
          name="meal-plan"
          value={mealPlan}
          onChange={(e) =>
            setMealPlan(e.target.value as keyof typeof MEAL_PLAN_PRICE)
          }
        >
          <option value="">Select your base plan</option>
          <option value="diet">Diet </option>
          <option value="protein">Protein </option>
          <option value="royal">Royal</option>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="delivery-days">Meal Type</Label>
        <span className="text-sm text-muted-foreground">
          Select the 1 or more meal types you want to receive
        </span>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1">
            <input type="checkbox" id="breakfast" name="breakfast" />
            <Label htmlFor="breakfast">Breakfast</Label>
          </div>
          <div className="flex items-center gap-1">
            <input type="checkbox" id="lunch" name="lunch" />
            <Label htmlFor="lunch">Lunch</Label>
          </div>
          <div className="flex items-center gap-1">
            <input type="checkbox" id="dinner" name="dinner" />
            <Label htmlFor="dinner">Dinner</Label>
          </div>
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="delivery-days">Delivery Days</Label>
        <span className="text-sm text-muted-foreground">
          Select the days you want to receive your meals
        </span>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            id="start-date"
            name="start-date"
            value={dates.startDate}
            onChange={(e) =>
              setDates((prev) => ({ ...prev, startDate: e.target.value }))
            }
          />
          <Input
            type="date"
            id="end-date"
            name="end-date"
            value={dates.endDate}
            onChange={(e) =>
              setDates((prev) => ({ ...prev, endDate: e.target.value }))
            }
          />
        </div>
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
        <Button type="submit">Subscribe</Button>
      </div>
    </form>
  );
}
