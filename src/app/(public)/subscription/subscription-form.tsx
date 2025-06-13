'use client';

import { Button } from '@/components/ui/button';
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
import { formatDateRange } from 'little-date';
import { ChevronDownIcon } from 'lucide-react';
import { useState } from 'react';
import { type DateRange } from 'react-day-picker';

export function SubscriptionForm() {
  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [deliveryDays, setDeliveryDays] = useState<number | undefined>(
    undefined
  );

  const handleRange = (range: DateRange | undefined) => {
    if (range?.from && range?.to) {
      const diffTime = Math.abs(range.to.getTime() - range.from.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setDeliveryDays(diffDays);
    }
    setRange(range);
  };

  console.log(deliveryDays);

  return (
    <form className="w-full max-w-sm mx-auto space-y-6">
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
      </div>

      <div className="grid gap-2">
        <Label htmlFor="meal-plan">Meal Plan</Label>
        <Select name="meal-plan" required>
          <SelectTrigger>
            <SelectValue placeholder="Select your base plan" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="diet">Diet</SelectItem>
              <SelectItem value="protein">Protein</SelectItem>
              <SelectItem value="royal">Royal</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="delivery-days">Meal Type</Label>
        <span className="text-sm text-muted-foreground">
          Select the 1 or more meal types you want to receive
        </span>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <Checkbox id="breakfast" name="breakfast" />
            <Label htmlFor="breakfast">Breakfast</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="lunch" name="lunch" />
            <Label htmlFor="lunch">Lunch</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="dinner" name="dinner" />
            <Label htmlFor="dinner">Dinner</Label>
          </div>
        </div>
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
              className="w-56 justify-between font-normal"
            >
              {range?.from && range?.to
                ? formatDateRange(range.from, range.to, {
                    includeTime: false,
                  })
                : 'Select date'}
              <ChevronDownIcon />
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
