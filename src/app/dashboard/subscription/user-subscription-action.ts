'use server';

import { db } from '@/db';
import { subscriptionsTable } from '@/db/schema';
import { Session } from '@/lib/auth';
import { and, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

export async function pauseSubscription(
  session: Session,
  status: 'paused' | 'active' | 'canceled',
  pausedUntil: Date | null,
  subscriptionId: string
) {
  if (!session) return null;

  await db
    .update(subscriptionsTable)
    .set({
      status: status,
      pausedUntil: pausedUntil,
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

  await db
    .update(subscriptionsTable)
    .set({
      status: 'canceled',
    })
    .where(
      and(
        eq(subscriptionsTable.id, subscriptionId),
        eq(subscriptionsTable.userId, session.user.id)
      )
    );

  revalidateTag(`user-${session.user.id}-subscriptions`);
}
