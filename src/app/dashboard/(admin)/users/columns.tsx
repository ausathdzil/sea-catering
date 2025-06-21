'use client';

import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontalIcon } from 'lucide-react';

interface Users {
  name: string;
  email: string;
  subscriptionsCount: number;
  totalRevenue: number;
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
    header: 'Subscriptions',
  },
  {
    accessorKey: 'totalRevenue',
    header: 'Revenue',
    cell: ({ row }) => {
      const amount = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
      }).format(row.original.totalRevenue);
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
