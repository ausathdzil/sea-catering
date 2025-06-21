import { db } from '@/db';
import { subscriptionsTable, user } from '@/db/schema';
import { Session } from '@/lib/auth';
import { count, eq, sql, sum } from 'drizzle-orm';

export async function getUsersWithSubscriptions(session: Session) {
  if (!session || session.user.role !== 'admin') return null;

  const data = await db
    .select({
      name: user.name,
      email: user.email,
      subscriptionsCount: count(subscriptionsTable.id),
      totalPending: sum(
        sql`CASE 
          WHEN ${subscriptionsTable.numberOfPayments} = 0 
          THEN (${subscriptionsTable.mealPlan}->>'totalPrice')::INTEGER
          ELSE 0 
        END`
      ),
      totalPaid: sum(
        sql`CASE 
          WHEN ${subscriptionsTable.numberOfPayments} > 0 
          THEN (${subscriptionsTable.mealPlan}->>'totalPrice')::INTEGER
          ELSE 0 
        END`
      ),
    })
    .from(user)
    .leftJoin(subscriptionsTable, eq(user.id, subscriptionsTable.userId))
    .where(eq(user.role, 'user'))
    .groupBy(user.id);

  return data.map((user) => ({
    ...user,
    subscriptionsCount: Number(user.subscriptionsCount),
    totalPending: Number(user.totalPending) || 0,
    totalPaid: Number(user.totalPaid) || 0,
  }));
}
