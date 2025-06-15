import { and, eq, gte, lte, sql } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';
import { Session } from '@/lib/auth';

export async function getNewSubscriptions(
  session: Session,
  startDate: Date,
  endDate: Date
) {
  'use cache';

  if (!session) return null;
  if (session.user.role !== 'admin') return null;

  cacheTag('new-subscriptions');
  cacheLife('hours');

  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(subscriptionsTable)
    .where(
      and(
        gte(subscriptionsTable.startAt, startDate),
        lte(subscriptionsTable.startAt, endDate),
        eq(subscriptionsTable.status, 'active')
      )
    );

  return Number(result[0].count);
}

export async function getMonthlyRecurringRevenue(
  session: Session,
  startDate: Date,
  endDate: Date
) {
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
    .where(
      and(
        gte(subscriptionsTable.dueDate, startDate),
        lte(subscriptionsTable.dueDate, endDate),
        eq(subscriptionsTable.status, 'active')
      )
    );

  return Number(result[0].total) ?? 0;
}

export async function getReactivations(
  session: Session,
  startDate: Date,
  endDate: Date
) {
  'use cache';

  if (!session) return null;
  if (session.user.role !== 'admin') return null;

  cacheTag('reactivations');
  cacheLife('hours');

  const result = await db
    .select({
      total: sql<number>`sum(${subscriptionsTable.reactivations})`,
    })
    .from(subscriptionsTable)
    .where(
      and(
        gte(subscriptionsTable.reactivatedAt, startDate),
        lte(subscriptionsTable.reactivatedAt, endDate),
        eq(subscriptionsTable.status, 'active')
      )
    );

  return Number(result[0].total) ?? 0;
}

export async function getSubscriptionGrowth(
  session: Session,
  startDate: Date,
  endDate: Date
) {
  'use cache';

  if (!session) return null;
  if (session.user.role !== 'admin') return null;

  cacheTag('subscription-growth');
  cacheLife('hours');

  const [active, canceled] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(subscriptionsTable)
      .where(
        and(
          gte(subscriptionsTable.startAt, startDate),
          lte(subscriptionsTable.startAt, endDate),
          eq(subscriptionsTable.status, 'active')
        )
      ),
    db
      .select({ count: sql<number>`count(*)` })
      .from(subscriptionsTable)
      .where(
        and(
          gte(subscriptionsTable.canceledAt, startDate),
          lte(subscriptionsTable.canceledAt, endDate),
          eq(subscriptionsTable.status, 'canceled')
        )
      ),
  ]);

  return {
    active: Number(active[0].count),
    canceled: Number(canceled[0].count),
    growth: Number(active[0].count) - Number(canceled[0].count),
  };
}
