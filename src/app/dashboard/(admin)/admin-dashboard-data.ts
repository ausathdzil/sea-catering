import { and, eq, gt, sql, sum } from 'drizzle-orm';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';
import { Session } from '@/lib/auth';

function getPreviousPeriod(start: Date, end: Date) {
  const previousStart = new Date(start.getFullYear(), start.getMonth() - 1, 1);
  const previousEnd = new Date(
    end.getFullYear(),
    end.getMonth() - 1,
    end.getDate()
  );

  return {
    start: previousStart,
    end: previousEnd,
  };
}

export async function getNewSubscriptions(
  session: Session,
  start?: Date,
  end?: Date
) {
  if (!session || session.user.role !== 'admin') return null;

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

  const periodDates = getPreviousPeriod(start, end);

  const [result] = await db
    .select({
      current: sql<number>`SUM(CASE 
        WHEN ${subscriptionsTable.startAt} >= ${start} 
        AND ${subscriptionsTable.startAt} <= ${end} 
        THEN 1 
        ELSE 0 
      END)`.as('current'),
      previous: sql<number>`SUM(CASE 
        WHEN ${subscriptionsTable.startAt} >= ${periodDates.start} 
        AND ${subscriptionsTable.startAt} <= ${periodDates.end} 
        THEN 1 
        ELSE 0 
      END)`.as('previous'),
    })
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.status, 'active'));

  return {
    current: Number(result.current),
    previous: Number(result.previous),
  };
}

export async function getMonthlyRecurringRevenue(
  session: Session,
  start?: Date,
  end?: Date
) {
  if (!session || session.user.role !== 'admin') return null;

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

  const periodDates = getPreviousPeriod(start, end);

  const [result] = await db
    .select({
      current: sum(
        sql<number>`CASE 
          WHEN ${subscriptionsTable.updatedAt} >= ${start} 
          AND ${subscriptionsTable.updatedAt} <= ${end}
          THEN (${subscriptionsTable.mealPlan}->>'totalPrice')::INTEGER * ${subscriptionsTable.numberOfPayments}
          ELSE 0 
        END`
      ),
      previous: sum(
        sql<number>`CASE 
          WHEN ${subscriptionsTable.updatedAt} >= ${periodDates.start} 
          AND ${subscriptionsTable.updatedAt} <= ${periodDates.end}
          THEN (${subscriptionsTable.mealPlan}->>'totalPrice')::INTEGER * ${subscriptionsTable.numberOfPayments}
          ELSE 0 
        END`
      ),
    })
    .from(subscriptionsTable)
    .where(
      and(
        eq(subscriptionsTable.status, 'active'),
        gt(subscriptionsTable.numberOfPayments, 0)
      )
    );

  return {
    current: Number(result.current),
    previous: Number(result.previous),
  };
}

export async function getReactivations(
  session: Session,
  start?: Date,
  end?: Date
) {
  if (!session || session.user.role !== 'admin') return null;

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

  const periodDates = getPreviousPeriod(start, end);

  const [result] = await db
    .select({
      current: sql<number>`SUM(CASE 
        WHEN ${subscriptionsTable.reactivatedAt} >= ${start} 
        AND ${subscriptionsTable.reactivatedAt} <= ${end} 
        THEN ${subscriptionsTable.reactivations} 
        ELSE 0 
      END)`.as('current'),
      previous: sql<number>`SUM(CASE 
        WHEN ${subscriptionsTable.reactivatedAt} >= ${periodDates.start} 
        AND ${subscriptionsTable.reactivatedAt} <= ${periodDates.end} 
        THEN ${subscriptionsTable.reactivations} 
        ELSE 0 
      END)`.as('previous'),
    })
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.status, 'active'));

  return {
    current: Number(result.current),
    previous: Number(result.previous),
  };
}

export async function getSubscriptions(session: Session) {
  if (!session || session.user.role !== 'admin') return null;

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
      sql`DATE_TRUNC('month', ${subscriptionsTable.startAt}) = month_series`
    )
    .groupBy(sql`month_series`)
    .orderBy(sql`month_series`);

  return months.map((sub) => ({
    month: sub.month.trim(),
    active: Number(sub.active),
    canceled: Number(sub.canceled),
  }));
}
