'use client';

import {
  BanknoteXIcon,
  HistoryIcon,
  LoaderIcon,
  MoreVerticalIcon,
  PauseIcon,
  PlayIcon,
} from 'lucide-react';

import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { CardAction } from '@/components/ui/card';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from '@/lib/auth-client';
import {
  cancelSubscription,
  pauseSubscription,
} from './user-subscription-action';

type SubscriptionStatus = 'paused' | 'active' | 'canceled';

interface SubscriptionCardActionProps {
  subscriptionId: string;
  status: SubscriptionStatus;
}

export function SubscriptionCardAction({
  subscriptionId,
  status,
}: SubscriptionCardActionProps) {
  const [open, setOpen] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [isPausePending, setIsPausePending] = useState<boolean>(false);
  const [isCancelPending, setIsCancelPending] = useState<boolean>(false);

  const { data: session } = useSession();
  if (!session) return null;

  const handlePauseSubscription = async () => {
    setIsPausePending(true);
    await pauseSubscription(
      session,
      status === 'paused' ? 'active' : 'paused',
      date ?? null,
      subscriptionId
    );
    toast(
      status === 'paused'
        ? 'Your subscription has been resumed'
        : 'Your subscription has been paused',
      {
        className: '[&_svg]:size-4',
        icon: status === 'paused' ? <PlayIcon /> : <PauseIcon />,
      }
    );
    setIsPausePending(false);
    setOpen(false);
  };

  const handleCancelSubscription = async () => {
    setIsCancelPending(true);
    await cancelSubscription(subscriptionId, session);
    toast.error('Your subscription has been canceled', {
      className: '[&_svg]:size-4',
      icon: <BanknoteXIcon />,
    });
    setIsCancelPending(false);
  };

  return (
    <CardAction>
      <Drawer open={open} onOpenChange={setOpen}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Subscription actions"
              disabled={isPausePending || isCancelPending}
            >
              {isPausePending || isCancelPending ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <MoreVerticalIcon />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {status === 'active' ? (
                <DrawerTrigger asChild>
                  <DropdownMenuItem>
                    <PauseIcon />
                    Pause
                  </DropdownMenuItem>
                </DrawerTrigger>
              ) : status === 'paused' ? (
                <DropdownMenuItem
                  onClick={handlePauseSubscription}
                  disabled={isPausePending}
                >
                  <PlayIcon />
                  Resume
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem>
                  <HistoryIcon />
                  Reactivate
                </DropdownMenuItem>
              )}
              {status !== 'canceled' && (
                <DropdownMenuItem
                  onClick={handleCancelSubscription}
                  disabled={isCancelPending}
                >
                  {isCancelPending ? (
                    <LoaderIcon className="animate-spin" />
                  ) : (
                    <BanknoteXIcon />
                  )}
                  Cancel
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <DrawerContent>
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
              <DrawerTitle>Pause Subscription</DrawerTitle>
              <DrawerDescription className="sr-only md:not-sr-only">
                Pause your subscription to stop receiving meals. You can resume
                your subscription at any time.
              </DrawerDescription>
            </DrawerHeader>
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => {
                setDate(date);
              }}
              required
              className="mx-auto"
              disabled={(date) => date < new Date()}
            />
            <DrawerFooter>
              <Button
                onClick={handlePauseSubscription}
                disabled={isPausePending || !date}
              >
                {isPausePending ? (
                  <LoaderIcon className="animate-spin" />
                ) : (
                  'Pause'
                )}
              </Button>
              <DrawerClose asChild>
                <Button variant="secondary">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </CardAction>
  );
}
