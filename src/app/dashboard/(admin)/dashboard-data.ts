import { eq, sql } from 'drizzle-orm';

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
  if (!session) return null;
  if (session.user.role !== 'admin') return null;

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
  if (!session) return null;
  if (session.user.role !== 'admin') return null;

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
        WHEN ${subscriptionsTable.dueDate} >= ${start} 
        AND ${subscriptionsTable.dueDate} <= ${end} 
        THEN (${subscriptionsTable.mealPlan}->>'totalPrice')::INTEGER 
        ELSE 0 
      END)`.as('current'),
      previous: sql<number>`SUM(CASE 
        WHEN ${subscriptionsTable.dueDate} >= ${periodDates.start} 
        AND ${subscriptionsTable.dueDate} <= ${periodDates.end} 
        THEN (${subscriptionsTable.mealPlan}->>'totalPrice')::INTEGER 
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

export async function getReactivations(
  session: Session,
  start?: Date,
  end?: Date
) {
  if (!session) return null;
  if (session.user.role !== 'admin') return null;

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
