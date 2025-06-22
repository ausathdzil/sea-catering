'use server';

import { and, eq } from 'drizzle-orm';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { getUserSubscription } from './user-data';

export async function pauseSubscription(
  userId: string,
  status: 'paused' | 'active' | 'canceled',
  pausedUntil: Date | null,
  subscriptionId: string
) {
  const subscription = await getUserSubscription(subscriptionId, userId);
  if (!subscription) return null;

  const mealPlan = subscription.mealPlan;
  let updatedPrice = mealPlan.totalPrice;

  if (
    status === 'paused' &&
    pausedUntil &&
    subscription.startAt &&
    subscription.dueDate
  ) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const pausedUntilNormalized = new Date(pausedUntil);
    pausedUntilNormalized.setHours(0, 0, 0, 0);

    const isImmediatePause =
      pausedUntilNormalized.getTime() <= tomorrow.getTime();

    const daysDiff = Math.ceil(
      (pausedUntilNormalized.getTime() - tomorrow.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const dayMap: Record<string, number> = {
      sunday: 0,
      monday: 1,
      tuesday: 2,
      wednesday: 3,
      thursday: 4,
      friday: 5,
      saturday: 6,
    };

    const deliveryDayNumbers = mealPlan.deliveryDays.map((day) => dayMap[day]);
    const pricePerDeliveryDay =
      mealPlan.totalPrice / (deliveryDayNumbers.length * 4.3);

    let deliveryDaysAffected = 0;
    const affectedDates: Date[] = [];

    if (daysDiff > 0) {
      for (let i = 0; i < daysDiff; i++) {
        const checkDate = new Date(tomorrow);
        checkDate.setDate(tomorrow.getDate() + i);
        if (deliveryDayNumbers.includes(checkDate.getDay())) {
          deliveryDaysAffected++;
          affectedDates.push(new Date(checkDate));
        }
      }
    } else if (isImmediatePause) {
      deliveryDaysAffected = 0;
    }

    updatedPrice =
      mealPlan.totalPrice - pricePerDeliveryDay * deliveryDaysAffected;
  } else if (status === 'active') {
    const basePlanPrice = {
      diet: 30000,
      protein: 40000,
      royal: 60000,
    }[mealPlan.basePlan as 'diet' | 'protein' | 'royal'];

    updatedPrice =
      basePlanPrice *
      mealPlan.mealTypes.length *
      mealPlan.deliveryDays.length *
      4.3;
  }

  await db
    .update(subscriptionsTable)
    .set({
      status,
      pausedUntil,
      mealPlan: {
        ...mealPlan,
        totalPrice: updatedPrice,
      },
    })
    .where(
      and(
        eq(subscriptionsTable.id, subscriptionId),
        eq(subscriptionsTable.userId, userId)
      )
    );

  revalidatePath('/dashboard');
}

export async function cancelSubscription(
  subscriptionId: string,
  userId: string
) {
  const subscription = await getUserSubscription(subscriptionId, userId);
  if (!subscription) return null;

  const mealPlan = subscription.mealPlan;
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  await db
    .update(subscriptionsTable)
    .set({
      status: 'canceled',
      pausedUntil: null,
      canceledAt: tomorrow,
      startAt: null,
      dueDate: null,
      mealPlan: {
        ...mealPlan,
        totalPrice: 0,
      },
    })
    .where(
      and(
        eq(subscriptionsTable.id, subscriptionId),
        eq(subscriptionsTable.userId, userId)
      )
    );

  revalidatePath('/dashboard');
}

export async function reactivateSubscription(
  subscriptionId: string,
  userId: string
) {
  const subscription = await getUserSubscription(subscriptionId, userId);
  if (!subscription) return null;

  const mealPlan = subscription.mealPlan;
  const basePlanPrice = {
    diet: 30000,
    protein: 40000,
    royal: 60000,
  }[mealPlan.basePlan as 'diet' | 'protein' | 'royal'];

  const recalculatedPrice =
    basePlanPrice *
    mealPlan.mealTypes.length *
    mealPlan.deliveryDays.length *
    4.3;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const dueDate = new Date(tomorrow);
  dueDate.setDate(dueDate.getDate() + 30);

  await db
    .update(subscriptionsTable)
    .set({
      status: 'active',
      pausedUntil: null,
      canceledAt: null,
      reactivatedAt: new Date(),
      startAt: tomorrow,
      dueDate: dueDate,
      reactivations: subscription.reactivations + 1,
      mealPlan: {
        ...mealPlan,
        totalPrice: recalculatedPrice,
      },
    })
    .where(
      and(
        eq(subscriptionsTable.id, subscriptionId),
        eq(subscriptionsTable.userId, userId)
      )
    );

  revalidatePath('/dashboard');
}
