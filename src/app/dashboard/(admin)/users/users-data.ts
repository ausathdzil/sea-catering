import { count, desc, eq, sql, sum } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';

import { db } from '@/db';
import { subscriptionsTable, user } from '@/db/schema';

export async function getUsersWithSubscriptions() {
  'use cache';

  cacheLife('hours');
  cacheTag('users-with-subscriptions');

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
