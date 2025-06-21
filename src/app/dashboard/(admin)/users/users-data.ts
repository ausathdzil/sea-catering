import { db } from '@/db';
import { subscriptionsTable, user } from '@/db/schema';
import { Session } from '@/lib/auth';
import { count, desc, eq, sql, sum } from 'drizzle-orm';

export async function getUsersWithSubscriptions(session: Session) {
  'use cache';
  
  if (!session || session.user.role !== 'admin') return null;

  const data = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      subscriptionsCount: count(subscriptionsTable.id),
      totalRevenue: sum(
        sql`CASE 
          WHEN ${subscriptionsTable.status} = 'active' 
          THEN (${subscriptionsTable.mealPlan}->>'totalPrice')::INTEGER
          ELSE 0 
        END`
      ),
    })
    .from(user)
    .leftJoin(subscriptionsTable, eq(user.id, subscriptionsTable.userId))
    .groupBy(user.id)
    .orderBy(desc(user.createdAt));

  return data.map((user) => ({
    ...user,
    subscriptionsCount: Number(user.subscriptionsCount),
    totalRevenue: Number(user.totalRevenue) || 0,
  }));
}
