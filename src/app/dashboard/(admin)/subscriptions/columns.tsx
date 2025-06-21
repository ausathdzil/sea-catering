'use client';

import { Badge } from '@/components/ui/badge';
import { buttonVariants } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  PencilIcon,
} from 'lucide-react';
import Link from 'next/link';

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
        <Link
          className={buttonVariants({ variant: 'ghost', size: 'icon' })}
          href={`/dashboard/subscriptions/${id}`}
        >
          <PencilIcon />
        </Link>
      );
    },
  },
];
