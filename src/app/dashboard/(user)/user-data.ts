import { and, desc, eq } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';

export async function getUserSubscription(
  subscriptionId: string,
  userId: string
) {
  'use cache';

  cacheLife('hours');
  cacheTag(`user-subscription-${subscriptionId}`);

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
  'use cache';

  cacheLife('hours');
  cacheTag('user-subscriptions');

  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, userId))
    .orderBy(desc(subscriptionsTable.createdAt));

  return subscriptions;
}
