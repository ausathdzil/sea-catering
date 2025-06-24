'use client';

import {
  BanknoteXIcon,
  HistoryIcon,
  LoaderIcon,
  PauseIcon,
  PlayIcon
} from 'lucide-react';

import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Session, useSession } from '@/lib/auth-client';
import {
  cancelSubscription,
  pauseSubscription,
  reactivateSubscription,
} from './user-actions';

type SubscriptionStatus = 'paused' | 'active' | 'canceled';

interface SubscriptionCardActionProps {
  subscriptionId: string;
  status: SubscriptionStatus;
  dueDate: Date;
}

export function SubscriptionCardAction(props: SubscriptionCardActionProps) {
  const { subscriptionId, status, dueDate } = props;

  const { data: session } = useSession();
  if (!session) return null;

  return (
    <CardAction>
      <PauseSubscription
        session={session}
        subscriptionId={subscriptionId}
        status={status}
        dueDate={dueDate}
      />
      {status === 'canceled' ? (
        <ReactivateSubscription
          session={session}
          subscriptionId={subscriptionId}
        />
      ) : (
        <CancelSubscription session={session} subscriptionId={subscriptionId} />
      )}
    </CardAction>
  );
}

function PauseSubscription({
  session,
  subscriptionId,
  status,
  dueDate,
}: {
  session: Session;
  subscriptionId: string;
  status: SubscriptionStatus;
  dueDate: Date;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);

  const handlePauseSubscription = async () => {
    setIsLoading(true);
    await pauseSubscription(
      session.user.id,
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
    setIsLoading(false);
    setOpen(false);
  };

  return status === 'paused' ? (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={handlePauseSubscription}
          variant="ghost"
          size="icon"
          disabled={isLoading}
        >
          {isLoading ? <LoaderIcon className="animate-spin" /> : <PlayIcon />}
        </Button>
      </TooltipTrigger>
      <TooltipContent>Resume subscription</TooltipContent>
    </Tooltip>
  ) : (
    <Drawer open={open} onOpenChange={setOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DrawerTrigger asChild>
            <Button
              disabled={isLoading || status === 'canceled'}
              variant="ghost"
              size="icon"
            >
              {isLoading ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <PauseIcon />
              )}
            </Button>
          </DrawerTrigger>
        </TooltipTrigger>
        <TooltipContent>Pause subscription</TooltipContent>
      </Tooltip>
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
            className="mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),40px)]"
            disabled={(date) => date < new Date() || date >= dueDate}
          />
          <DrawerFooter>
            <Button
              onClick={handlePauseSubscription}
              disabled={isLoading || !date}
            >
              {isLoading ? <LoaderIcon className="animate-spin" /> : 'Pause'}
            </Button>
            <DrawerClose asChild>
              <Button variant="secondary">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function CancelSubscription({
  session,
  subscriptionId,
}: {
  session: Session;
  subscriptionId: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    await cancelSubscription(subscriptionId, session.user.id);
    toast.error('Your subscription has been canceled', {
      className: '[&_svg]:size-4',
      icon: <BanknoteXIcon />,
    });
    setIsLoading(false);
  };

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button disabled={isLoading} variant="ghost" size="icon">
              {isLoading ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <BanknoteXIcon />
              )}
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Cancel subscription</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel subscription</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to cancel your subscription? You can
            reactivate it at any time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={handleCancelSubscription}
          >
            {isLoading ? (
              <LoaderIcon className="animate-spin" />
            ) : (
              <BanknoteXIcon />
            )}
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function ReactivateSubscription({
  session,
  subscriptionId,
}: {
  session: Session;
  subscriptionId: string;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleReactivateSubscription = async () => {
    setIsLoading(true);
    await reactivateSubscription(subscriptionId, session.user.id);
    toast.success('Your subscription has been reactivated', {
      className: '[&_svg]:size-4',
      icon: <HistoryIcon />,
    });
    setIsLoading(false);
  };

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button disabled={isLoading} variant="ghost" size="icon">
              {isLoading ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <HistoryIcon />
              )}
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Reactivate subscription</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Reactivate subscription</AlertDialogTitle>
          <AlertDialogDescription>
            Continue to reactivate your subscription.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleReactivateSubscription}>
            {isLoading ? <LoaderIcon className="animate-spin" /> : 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
