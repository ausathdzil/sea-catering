'use client';

import { BanIcon, PencilIcon } from 'lucide-react';

import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';

import { Button, buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface Users {
  id: string;
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
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                href={`/dashboard/users/${id}`}
              >
                <PencilIcon />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Edit User</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <BanIcon />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Ban User</p>
            </TooltipContent>
          </Tooltip>
        </div>
      );
    },
  },
];
