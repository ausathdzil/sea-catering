import { desc, eq } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';

import { db } from '@/db';
import { subscriptionsTable, user } from '@/db/schema';

export async function getSubscriptionsWithUsers() {
  'use cache';

  cacheLife('hours');
  cacheTag('subscriptions-with-users');

  const data = await db
    .select({
      id: subscriptionsTable.id,
      userName: user.name,
      userEmail: user.email,
      mealPlan: subscriptionsTable.mealPlan,
      status: subscriptionsTable.status,
      createdAt: subscriptionsTable.createdAt,
    })
    .from(subscriptionsTable)
    .innerJoin(user, eq(subscriptionsTable.userId, user.id))
    .orderBy(desc(subscriptionsTable.createdAt));

  return data.map((subscription) => ({
    id: subscription.id,
    user: subscription.userName,
    email: subscription.userEmail,
    amount: subscription.mealPlan.totalPrice,
    date: subscription.createdAt,
    status: subscription.status,
  }));
}
