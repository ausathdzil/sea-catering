'use client';

import { CalendarSyncIcon } from 'lucide-react';

import { formatDateRange } from 'little-date';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import { useDebouncedCallback } from 'use-debounce';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Label } from '@/components/ui/label';

export function PeriodControl() {
  const today = new Date();

  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>({
    from: new Date(today.getFullYear(), today.getMonth(), 1),
    to: new Date(today.getFullYear(), today.getMonth() + 1, 0),
  });

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearchParams = useDebouncedCallback(() => {
    const params = new URLSearchParams(searchParams);
    if (range?.from && range?.to) {
      params.set('start', range.from.toISOString().split('T')[0]);
      params.set('end', range.to.toISOString().split('T')[0]);
    } else {
      params.delete('start');
      params.delete('end');
    }
    router.replace(`?${params.toString()}`);
  }, 500);

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="date" className="px-1">
        Select data period
      </Label>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="max-w-xs justify-between font-normal"
          >
            {range?.from && range?.to
              ? formatDateRange(range.from, range.to, {
                  includeTime: false,
                })
              : 'Select date'}
            <CalendarSyncIcon />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="w-auto overflow-hidden p-0">
          <DrawerHeader>
            <DrawerTitle>Period</DrawerTitle>
            <DrawerDescription>
              Range at least 30 days to see the data.
            </DrawerDescription>
          </DrawerHeader>
          <Calendar
            mode="range"
            selected={range}
            min={29}
            onSelect={(range) => {
              setRange(range);
              handleSearchParams();
            }}
            className="mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),48px)]"
          />
          <DrawerFooter>
            <Button
              className="w-full max-w-sm mx-auto"
              variant="outline"
              onClick={() => setRange(undefined)}
            >
              Clear
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
