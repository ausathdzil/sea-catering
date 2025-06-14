import { asc, desc, eq } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';

import { db } from '@/db';
import {
  mealPlansTable,
  subscriptionsTable,
  testimonialsTable,
} from './schema';
import { Session } from '@/lib/auth';

export async function getMealPlans() {
  'use cache';

  cacheTag('meal-plans');
  cacheLife('hours');

  const plans = await db
    .select()
    .from(mealPlansTable)
    .orderBy(asc(mealPlansTable.price));

  return plans;
}

export async function getTestimonials() {
  'use cache';

  cacheTag('testimonials');
  cacheLife('hours');

  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .orderBy(desc(testimonialsTable.createdAt))
    .limit(5);

  return testimonials;
}

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

export async function getUserSubscriptions(userId: string, session: Session) {
  'use cache';

  if (!session) return null;

  cacheTag(`user-${userId}-subscriptions`);
  cacheLife('hours');

  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, userId))
    .orderBy(desc(subscriptionsTable.createdAt));

  return subscriptions;
}
