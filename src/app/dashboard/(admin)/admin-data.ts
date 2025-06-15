import { and, desc, eq, gte, lte, sql } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';
import { Session } from '@/lib/auth';

export async function getSubscriptions(session: Session) {
  'use cache';

  if (!session) return null;
  if (session.user.role !== 'admin') return null;

  cacheTag('subscriptions');
  cacheLife('hours');

  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .orderBy(desc(subscriptionsTable.createdAt));

  return subscriptions;
}

export async function getNewSubscriptions(
  session: Session,
  startDate: Date,
  endDate: Date
): Promise<number | null> {
  'use cache';

  if (!session) return null;
  if (session.user.role !== 'admin') return null;

  cacheTag('new-subscriptions');
  cacheLife('hours');

  const newSubscriptions = await db
    .select({ count: sql<number>`count(*)` })
    .from(subscriptionsTable)
    .where(
      and(
        gte(subscriptionsTable.createdAt, startDate),
        lte(subscriptionsTable.createdAt, endDate)
      )
    );

  return Number(newSubscriptions[0].count);
}

export async function getMonthlyRecurringRevenue(
  session: Session
): Promise<number | null> {
  'use cache';

  if (!session) return null;
  if (session.user.role !== 'admin') return null;

  cacheTag('mrr');
  cacheLife('hours');

  const result = await db
    .select({
      total: sql<number>`sum((${subscriptionsTable.mealPlan}->>'totalPrice')::integer)`,
    })
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.status, 'active'));

  return result[0].total ?? 0;
}

export async function getActiveSubscriptions(
  session: Session
): Promise<number | null> {
  'use cache';

  if (!session) return null;
  if (session.user.role !== 'admin') return null;

  cacheTag('active-subscriptions');
  cacheLife('hours');

  const activeSubscriptions = await db
    .select({ count: sql<number>`count(*)` })
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.status, 'active'));

  return Number(activeSubscriptions[0].count);
}
