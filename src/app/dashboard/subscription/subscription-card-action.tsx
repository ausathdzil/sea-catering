'use client';

import {
  BanknoteXIcon,
  LoaderIcon,
  MoreVerticalIcon,
  PauseIcon,
  PlayIcon,
} from 'lucide-react';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { CardAction } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSession } from '@/lib/auth-client';
import { toast } from 'sonner';
import {
  cancelSubscription,
  pauseSubscription,
} from './user-subscription-action';

export function SubscriptionCardAction({
  subscriptionId,
  status,
}: {
  subscriptionId: string;
  status: 'paused' | 'active';
}) {
  const [isPausePending, setIsPausePending] = useState(false);
  const [isCancelPending, setIsCancelPending] = useState(false);

  const { data: session } = useSession();
  if (!session) return null;

  const handlePauseSubscription = async () => {
    setIsPausePending(true);
    await pauseSubscription(subscriptionId, status, session);
    setIsPausePending(false);
    toast(
      status === 'active' ? 'Subscription paused' : 'Subscription resumed',
      {
        className: '[&_svg:not([class*="size-"])]:size-4',
        icon: status === 'active' ? <PauseIcon /> : <PlayIcon />,
        position: 'bottom-right',
      }
    );
  };

  const handleCancelSubscription = async () => {
    setIsCancelPending(true);
    await cancelSubscription(subscriptionId, session);
    setIsCancelPending(false);
    toast.error('Subscription cancelled', {
      className: '[&_svg:not([class*="size-"])]:size-4',
      icon: <BanknoteXIcon />,
      position: 'bottom-right',
    });
  };

  return (
    <CardAction>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup>
            {status === 'active' ? (
              <ActionDropdownItem
                onClick={handlePauseSubscription}
                isPending={isPausePending}
                icon={<PauseIcon />}
              >
                Pause
              </ActionDropdownItem>
            ) : (
              <ActionDropdownItem
                onClick={handlePauseSubscription}
                isPending={isPausePending}
                icon={<PlayIcon />}
              >
                Resume
              </ActionDropdownItem>
            )}
            <ActionDropdownItem
              onClick={handleCancelSubscription}
              isPending={isCancelPending}
              icon={<BanknoteXIcon />}
            >
              Cancel
            </ActionDropdownItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </CardAction>
  );
}

interface ActionDropdownItemProps {
  onClick: () => void;
  isPending: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function ActionDropdownItem({
  onClick,
  isPending,
  icon,
  children,
}: ActionDropdownItemProps) {
  return (
    <DropdownMenuItem onClick={onClick} disabled={isPending}>
      {isPending ? <LoaderIcon className="animate-spin" /> : icon}
      {children}
    </DropdownMenuItem>
  );
}
