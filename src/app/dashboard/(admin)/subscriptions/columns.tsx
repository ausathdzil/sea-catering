'use client';

import {
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
} from 'lucide-react';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

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
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <TrashIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Delete Subscription</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];
