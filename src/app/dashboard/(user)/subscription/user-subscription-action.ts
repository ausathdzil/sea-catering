'use server';

import { and, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';
import { Session } from '@/lib/auth';
import { getUserSubscription } from '../user-data';

export async function pauseSubscription(
  session: Session,
  status: 'paused' | 'active' | 'canceled',
  pausedUntil: Date | null,
  subscriptionId: string
) {
  if (!session) return null;

  const subscription = await getUserSubscription(
    subscriptionId,
    session.user.id
  );
  if (!subscription) return null;

  const mealPlan = subscription.mealPlan;
  let updatedPrice = mealPlan.totalPrice;

  if (status === 'paused' && pausedUntil) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const daysDiff = Math.ceil(
      (pausedUntil.getTime() - tomorrow.getTime()) / (1000 * 60 * 60 * 24)
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
    for (let i = 0; i < daysDiff; i++) {
      const checkDate = new Date(tomorrow);
      checkDate.setDate(tomorrow.getDate() + i);
      if (deliveryDayNumbers.includes(checkDate.getDay())) {
        deliveryDaysAffected++;
      }
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
        eq(subscriptionsTable.userId, session.user.id)
      )
    );

  revalidateTag(`user-${session.user.id}-subscriptions`);
}

export async function cancelSubscription(
  subscriptionId: string,
  session: Session
) {
  if (!session) return null;

  const subscription = await getUserSubscription(
    subscriptionId,
    session.user.id
  );
  if (!subscription) return null;

  const mealPlan = subscription.mealPlan;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  const daysRemaining = Math.ceil(
    (lastDayOfMonth.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
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

  let remainingDeliveryDays = 0;
  for (let i = 0; i < daysRemaining; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() + i);
    if (deliveryDayNumbers.includes(checkDate.getDay())) {
      remainingDeliveryDays++;
    }
  }

  const remainingPrice = pricePerDeliveryDay * remainingDeliveryDays;
  const updatedPrice = mealPlan.totalPrice - remainingPrice;

  await db
    .update(subscriptionsTable)
    .set({
      status: 'canceled',
      pausedUntil: null,
      canceledAt: new Date(),
      mealPlan: {
        ...mealPlan,
        totalPrice: updatedPrice,
      },
    })
    .where(
      and(
        eq(subscriptionsTable.id, subscriptionId),
        eq(subscriptionsTable.userId, session.user.id)
      )
    );

  revalidateTag(`user-${session.user.id}-subscriptions`);
}

export async function reactivateSubscription(
  subscriptionId: string,
  session: Session
) {
  if (!session) return null;

  const subscription = await getUserSubscription(
    subscriptionId,
    session.user.id
  );
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

  await db
    .update(subscriptionsTable)
    .set({
      status: 'active',
      pausedUntil: null,
      canceledAt: null,
      mealPlan: {
        ...mealPlan,
        totalPrice: recalculatedPrice,
      },
    })
    .where(
      and(
        eq(subscriptionsTable.id, subscriptionId),
        eq(subscriptionsTable.userId, session.user.id)
      )
    );

  revalidateTag(`user-${session.user.id}-subscriptions`);
}
