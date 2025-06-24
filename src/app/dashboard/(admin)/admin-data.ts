import { count, desc, eq, sql, sum } from 'drizzle-orm';
import { unstable_cache as cache } from 'next/cache';

import { db } from '@/db';
import { subscriptionsTable, user } from '@/db/schema';

export const getCachedNewSubscriptions = cache(
  async (start?: Date, end?: Date) => {
    if (!start || !end) {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
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

    return Number(result.current);
  },
  ['new-subscriptions'],
  {
    tags: ['new-subscriptions'],
    revalidate: 3600,
  }
);

export const getCachedMonthlyRecurringRevenue = cache(
  async (start?: Date, end?: Date) => {
    if (!start || !end) {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
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

    return Number(result.current);
  },
  ['monthly-recurring-revenue'],
  {
    tags: ['monthly-recurring-revenue'],
    revalidate: 3600,
  }
);

export const getCachedReactivations = cache(
  async (start?: Date, end?: Date) => {
    if (!start || !end) {
      const today = new Date();
      const firstDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
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

    return Number(result.current);
  },
  ['reactivations'],
  {
    tags: ['reactivations'],
    revalidate: 3600,
  }
);

export const getCachedSubscriptions = cache(
  async () => {
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
  },
  ['subscriptions'],
  {
    tags: ['subscriptions'],
    revalidate: 3600,
  }
);

export const getCachedSubsriptionById = (id: string) =>
  cache(
    async () => {
      const data = await db
        .select()
        .from(subscriptionsTable)
        .where(eq(subscriptionsTable.id, id));
      return data[0];
    },
    [`subscription-${id}`],
    {
      tags: [`subscription-${id}`],
      revalidate: 3600,
    }
  )();

export const getCachedSubscriptionsWithUsers = cache(
  async () => {
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
  },
  ['subscriptions-with-users'],
  {
    tags: ['subscriptions-with-users'],
    revalidate: 3600,
  }
);

export const getCachedUserById = (id: string) =>
  cache(
    async () => {
      const data = await db.select().from(user).where(eq(user.id, id));

      return data[0];
    },
    [`user-${id}`],
    {
      tags: [`user-${id}`],
      revalidate: 3600,
    }
  )();

export const getCachedUsersWithSubscriptions = cache(
  async () => {
    const data = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        subscriptionsCount: count(subscriptionsTable.id),
        totalRevenue: sum(
          sql`CASE 
          WHEN ${subscriptionsTable.status} = 'active' 
          THEN (${subscriptionsTable.mealPlan}->>'totalPrice')::INTEGER
          ELSE 0 
        END`
        ),
      })
      .from(user)
      .leftJoin(subscriptionsTable, eq(user.id, subscriptionsTable.userId))
      .groupBy(user.id)
      .orderBy(desc(user.createdAt));

    return data.map((user) => ({
      ...user,
      subscriptionsCount: Number(user.subscriptionsCount),
      totalRevenue: Number(user.totalRevenue) || 0,
    }));
  },
  ['users-with-subscriptions'],
  {
    tags: ['users-with-subscriptions'],
    revalidate: 3600,
  }
);
