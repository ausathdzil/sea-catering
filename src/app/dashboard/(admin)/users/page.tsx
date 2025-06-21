import { headers } from 'next/headers';
import { forbidden } from 'next/navigation';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getSession } from '@/lib/auth';
import { DashboardHeader } from '../../dashboard-header';
import { getUsersWithSubscriptions } from './admin-users-data';

export default async function UsersPage() {
  const session = await getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'admin') {
    forbidden();
  }

  const users = await getUsersWithSubscriptions(session);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader title="Users" />
      <main className="@container/main flex flex-1 flex-col gap-4 p-8">
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="p-4">Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Total Subscriptions</TableHead>
                <TableHead>Total Pending</TableHead>
                <TableHead>Total Paid</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users ? (
                <>
                  {users.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell className="p-4">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="tabular-nums">
                        {user.subscriptionsCount}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          maximumFractionDigits: 0,
                        }).format(user.totalPending)}
                      </TableCell>
                      <TableCell className="tabular-nums">
                        {new Intl.NumberFormat('id-ID', {
                          style: 'currency',
                          currency: 'IDR',
                          maximumFractionDigits: 0,
                        }).format(user.totalPaid)}
                      </TableCell>
                    </TableRow>
                  ))}
                </>
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
