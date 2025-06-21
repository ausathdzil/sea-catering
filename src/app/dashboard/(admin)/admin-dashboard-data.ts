import { eq, sql, sum } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';

export async function getNewSubscriptions(
  role: string,
  start?: Date,
  end?: Date
) {
  'use cache';

  cacheLife('hours');
  cacheTag('new-subscriptions');

  if (role !== 'admin') return null;

  if (!start || !end) {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    start = firstDayOfMonth;
    end = lastDayOfMonth;
  }

  const [result] = await db
    .select({
      current: sql<number>`SUM(CASE 
        WHEN ${subscriptionsTable.startAt} >= ${start} 
        AND ${subscriptionsTable.startAt} <= ${end} 
        THEN 1 
        ELSE 0 
      END)`.as('current'),
    })
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.status, 'active'));

  return {
    current: Number(result.current),
  };
}

export async function getMonthlyRecurringRevenue(
  role: string,
  start?: Date,
  end?: Date
) {
  'use cache';

  cacheLife('hours');
  cacheTag('monthly-recurring-revenue');

  if (role !== 'admin') return null;

  if (!start || !end) {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    start = firstDayOfMonth;
    end = lastDayOfMonth;
  }

  const [result] = await db
    .select({
      current: sum(
        sql<number>`CASE 
          WHEN ${subscriptionsTable.dueDate} >= ${start} 
          AND ${subscriptionsTable.dueDate} <= ${end}
          AND ${subscriptionsTable.status} = 'active'
          THEN (${subscriptionsTable.mealPlan}->>'totalPrice')::INTEGER
          ELSE 0 
        END`
      ),
    })
    .from(subscriptionsTable);

  return {
    current: Number(result.current),
  };
}

export async function getReactivations(role: string, start?: Date, end?: Date) {
  'use cache';

  cacheLife('hours');
  cacheTag('reactivations');

  if (role !== 'admin') return null;

  if (!start || !end) {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfMonth = new Date(
      today.getFullYear(),
      today.getMonth() + 1,
      0
    );
    start = firstDayOfMonth;
    end = lastDayOfMonth;
  }

  const [result] = await db
    .select({
      current: sql<number>`SUM(CASE 
        WHEN ${subscriptionsTable.reactivatedAt} >= ${start} 
        AND ${subscriptionsTable.reactivatedAt} <= ${end} 
        THEN ${subscriptionsTable.reactivations} 
        ELSE 0 
      END)`.as('current'),
    })
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.status, 'active'));

  return {
    current: Number(result.current),
  };
}

export async function getSubscriptions(role: string) {
  'use cache';

  cacheLife('hours');
  cacheTag('subscriptions');

  if (role !== 'admin') return null;

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const months = await db
    .select({
      month: sql<string>`TO_CHAR(month_series, 'Month')`,
      active: sql<number>`COALESCE(SUM(CASE WHEN ${subscriptionsTable.status} = 'active' THEN 1 ELSE 0 END), 0)`,
      canceled: sql<number>`COALESCE(SUM(CASE WHEN ${subscriptionsTable.status} = 'canceled' THEN 1 ELSE 0 END), 0)`,
    })
    .from(
      sql`GENERATE_SERIES(
        DATE_TRUNC('month', ${sixMonthsAgo.toISOString()}::timestamp),
        DATE_TRUNC('month', CURRENT_TIMESTAMP),
        '1 month'::INTERVAL
      ) as month_series`
    )
    .leftJoin(
      subscriptionsTable,
      sql`(
        DATE_TRUNC('month', ${subscriptionsTable.startAt}) = month_series
        OR (
          ${subscriptionsTable.status} = 'canceled' 
          AND DATE_TRUNC('month', ${subscriptionsTable.canceledAt}) = month_series
        )
      )`
    )
    .groupBy(sql`month_series`)
    .orderBy(sql`month_series`);

  return months.map((sub) => ({
    month: sub.month.trim(),
    active: Number(sub.active),
    canceled: Number(sub.canceled),
  }));
}
