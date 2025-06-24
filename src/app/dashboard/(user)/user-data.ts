import { and, desc, eq } from 'drizzle-orm';
import { unstable_cache as cache } from 'next/cache';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';

export const getCachedUserSubscription = (
  subscriptionId: string,
  userId: string
) =>
  cache(
    async () => {
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
    },
    [`user-subscription-${subscriptionId}-${userId}`],
    {
      tags: [`user-subscription-${subscriptionId}-${userId}`],
      revalidate: 3600,
    }
  )();

export const getCachedUserSubscriptions = (userId: string) =>
  cache(
    async () => {
      const subscriptions = await db
        .select()
        .from(subscriptionsTable)
        .where(eq(subscriptionsTable.userId, userId))
        .orderBy(desc(subscriptionsTable.createdAt));

      return subscriptions;
    },
    [`user-subscriptions-${userId}`],
    {
      tags: [`user-subscriptions-${userId}`],
      revalidate: 3600,
    }
  )();
