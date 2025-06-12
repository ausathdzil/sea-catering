'use cache';

import { db } from '@/db';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';
import { desc } from 'drizzle-orm';
import {
  mealPlansTable,
  subscriptionsTable,
  testimonialsTable,
} from './schema';

export async function getMealPlans() {
  cacheTag('meal-plans');
  cacheLife('hours');

  const plans = await db.select().from(mealPlansTable);
  return plans;
}

export async function getTestimonials() {
  cacheTag('testimonials');
  cacheLife('hours');

  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .orderBy(desc(testimonialsTable.createdAt));
    
  return testimonials;
}

export async function getSubscriptions() {
  const subscriptions = await db.select().from(subscriptionsTable);
  return subscriptions;
}
