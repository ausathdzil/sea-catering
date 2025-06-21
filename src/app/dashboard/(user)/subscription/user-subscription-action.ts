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

  await db
    .update(subscriptionsTable)
    .set({
      status,
      pausedUntil,
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
    })
    .where(
      and(
        eq(subscriptionsTable.id, subscriptionId),
        eq(subscriptionsTable.userId, session.user.id)
      )
    );

  revalidateTag(`user-${session.user.id}-subscriptions`);
}
