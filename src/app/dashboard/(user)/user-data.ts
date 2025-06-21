'use cache';

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
  cacheLife('hours');
  cacheTag(`user-subscription-${subscriptionId}`);

  if (!userId) return null;

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

export async function getUserSubscriptions(session: Session) {
  cacheLife('hours');
  cacheTag('user-subscriptions');

  if (!session) return null;

  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, session.user.id))
    .orderBy(desc(subscriptionsTable.createdAt));

  return subscriptions;
}
