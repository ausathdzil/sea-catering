'use cache';

import { and, desc, eq } from 'drizzle-orm';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';
import { Session } from '@/lib/auth';

export async function getUserSubscription(
  subscriptionId: string,
  userId: string
) {
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
  if (!session) return null;

  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, session.user.id))
    .orderBy(desc(subscriptionsTable.createdAt));

  return subscriptions;
}
