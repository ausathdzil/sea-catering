import { asc, desc } from 'drizzle-orm';
import {
  unstable_cacheLife as cacheLife,
  unstable_cacheTag as cacheTag,
} from 'next/cache';

import { db } from '@/db';
import { mealPlansTable, testimonialsTable } from '@/db/schema';

export async function getMealPlans() {
  'use cache';

  cacheLife('max');
  cacheTag('meal-plans');

  const plans = await db
    .select()
    .from(mealPlansTable)
    .orderBy(asc(mealPlansTable.price));

  return plans;
}

export async function getTestimonials() {
  'use cache';

  cacheLife('hours');
  cacheTag('testimonials');

  const testimonials = await db
    .select()
    .from(testimonialsTable)
    .orderBy(desc(testimonialsTable.createdAt))
    .limit(5);

  return testimonials;
}
