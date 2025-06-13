import { db } from '@/db';
import { asc, desc, eq } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';
import {
  mealPlansTable,
  subscriptionsTable,
  testimonialsTable,
} from './schema';

export async function getMealPlans() {
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

export async function getSubscriptions() {
  'use cache';

  cacheTag('subscriptions');
  cacheLife('hours');

  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .orderBy(desc(subscriptionsTable.createdAt));

  return subscriptions;
}

export async function getUserSubscriptions(userId: string) {
  'use cache';

  cacheTag(`user-${userId}-subscriptions`);
  cacheLife('hours');

  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .where(eq(subscriptionsTable.userId, userId))
    .orderBy(desc(subscriptionsTable.createdAt));

  return subscriptions;
}
