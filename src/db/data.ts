'use cache';

import { db } from '@/db';
import { asc, desc } from 'drizzle-orm';
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
  cacheTag('meal-plans');
  cacheLife('hours');

  const plans = await db
    .select()
    .from(mealPlansTable)
    .orderBy(asc(mealPlansTable.price));

  return plans;
}

export async function getTestimonials() {
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
  cacheTag('subscriptions');
  cacheLife('hours');

  const subscriptions = await db
    .select()
    .from(subscriptionsTable)
    .orderBy(desc(subscriptionsTable.createdAt));

  return subscriptions;
}
