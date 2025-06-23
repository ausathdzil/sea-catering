'use client';

import {
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  LoaderIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
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
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { deleteSubscription } from '../admin-actions';

interface Subscriptions {
  id: string;
  user: string;
  email: string;
  amount: number;
  date: Date;
  status: string;
}

export const columns: ColumnDef<Subscriptions>[] = [
  {
    accessorKey: 'user',
    header: 'User',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
    cell: ({ row }) => {
      const amount = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(row.original.amount);
      return <div>{amount}</div>;
    },
  },
  {
    accessorKey: 'date',
    header: 'Date',
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      return (
        <div>
          {date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.original.status;
      return (
        <div>
          {status === 'active' ? (
            <Badge>
              <CircleCheckIcon />
              Active
            </Badge>
          ) : status === 'paused' ? (
            <Badge variant="warning">
              <ClockIcon />
              Paused
            </Badge>
          ) : (
            <Badge variant="destructive">
              <CircleXIcon />
              Canceled
            </Badge>
          )}
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                href={`/dashboard/subscriptions/${id}`}
              >
                <PencilIcon />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit Subscription</p>
            </TooltipContent>
          </Tooltip>
          <DeleteSubscriptionButton subscriptionId={id} />
        </div>
      );
    },
  },
];

function DeleteSubscriptionButton({
  subscriptionId,
}: {
  subscriptionId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" disabled={isLoading}>
              {isLoading ? (
                <LoaderIcon className="animate-spin" />
              ) : (
                <TrashIcon />
              )}
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Delete Subscription</p>
        </TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Subscription</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this subscription?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={async () => {
              setIsLoading(true);
              const result = await deleteSubscription(subscriptionId);
              if (result) {
                toast.error(result.message);
              }
              setIsLoading(false);
            }}
          >
            {isLoading ? <LoaderIcon className="animate-spin" /> : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
