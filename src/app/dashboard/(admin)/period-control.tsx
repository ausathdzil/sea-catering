'use client';

import { CalendarPlusIcon } from 'lucide-react';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';
import { DateRange } from 'react-day-picker';

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function PeriodControl() {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearchParams = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (range?.from && range?.to) {
      params.set('start', formatDate(range.from));
      params.set('end', formatDate(range.to));
    } else {
      params.delete('start');
      params.delete('end');
    }
    router.replace(`?${params.toString()}`);
  }, 500);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="date" className="px-1">
        Select period
      </Label>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="w-48 justify-between font-normal"
          >
            {range?.from && range?.to
              ? `${range.from.toLocaleDateString()} - ${range.to.toLocaleDateString()}`
              : 'Select date'}
            <CalendarPlusIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-auto overflow-hidden p-0">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Select period</DrawerTitle>
          </DrawerHeader>
          <Calendar
            mode="range"
            selected={range}
            captionLayout="dropdown-months"
            min={30}
            onSelect={(range) => {
              setRange(range);
              handleSearchParams();
            }}
            className="mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),52px)]"
          />
        </DrawerContent>
      </Drawer>
    </div>
  );
}

export function DatePicker() {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-muted-foreground px-1 text-sm">
        This example works best on mobile.
      </div>
    </div>
  );
}
