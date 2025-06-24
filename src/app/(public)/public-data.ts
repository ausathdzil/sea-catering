import { asc, desc } from 'drizzle-orm';
import { unstable_cache as cache } from 'next/cache';

import { db } from '@/db';
import { mealPlansTable, testimonialsTable } from '@/db/schema';

export const getCachedMealPlans = cache(async () => {
  const plans = await db
    .select()
    .from(mealPlansTable)
    .orderBy(asc(mealPlansTable.price));

  return plans;
});

export const getCachedTestimonials = cache(
  async () => {
    const testimonials = await db
      .select()
      .from(testimonialsTable)
      .orderBy(desc(testimonialsTable.createdAt))
      .limit(5);

    return testimonials;
  },
  ['testimonials'],
  {
    tags: ['testimonials'],
    revalidate: 3600,
  }
);
