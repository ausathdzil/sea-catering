import { and, desc, eq } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';
import { Session } from '@/lib/auth';

export async function getUserSubscription(
  subscriptionId: string,
  userId: string
) {
  'use cache';

  if (!userId) return null;

  cacheTag(`user-${userId}-subscription-${subscriptionId}`);
  cacheLife('hours');

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

export async function getUserSubscriptions(userId: string, session: Session) {
  'use cache';

  if (!session) return null;

  cacheTag(`user-${userId}-subscriptions`);
  cacheLife('hours');

  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, userId))
    .orderBy(desc(subscriptionsTable.createdAt));

  return subscriptions;
}
