'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontalIcon } from 'lucide-react';

interface Users {
  name: string;
  email: string;
  subscriptionsCount: number;
  totalPending: number;
  totalPaid: number;
}

export const columns: ColumnDef<Users>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'subscriptionsCount',
    header: 'Total Subscriptions',
  },
  {
    accessorKey: 'totalPending',
    header: 'Total Pending',
    cell: ({ row }) => {
      const amount = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(row.original.totalPending);
      return <div>{amount}</div>;
    },
  },
  {
    accessorKey: 'totalPaid',
    header: 'Total Paid',
    cell: ({ row }) => {
      const amount = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(row.original.totalPaid);
      return <div>{amount}</div>;
    },
  },
  {
    id: 'actions',
    cell: () => {
      return (
        <Button variant="ghost" size="sm">
          <MoreHorizontalIcon />
        </Button>
      );
    },
  },
];
