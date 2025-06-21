'use cache';

import { asc, desc } from 'drizzle-orm';
import {
	unstable_cacheLife as cacheLife,
	unstable_cacheTag as cacheTag,
} from 'next/cache';

import { db } from '@/db';
import { mealPlansTable, testimonialsTable } from '@/db/schema';

export async function getMealPlans() {

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
