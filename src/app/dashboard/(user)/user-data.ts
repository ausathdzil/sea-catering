import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';

export async function getUserSubscription(
  subscriptionId: string,
  userId: string
) {
  const subscription = await db
    .select()
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.id, subscriptionId),
        eq(subscriptionsTable.userId, userId)
      )
    )
    .limit(1);

  return subscription[0];
}

export async function getUserSubscriptions(userId: string) {
  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, userId))
    .orderBy(desc(subscriptionsTable.createdAt));

  return subscriptions;
}
