import { db } from '@/db';
import {
  mealPlansTable,
  subscriptionsTable,
  testimonialsTable,
} from './schema';

export async function getMealPlans() {
  const plans = await db.select().from(mealPlansTable);
  return plans;
}

export async function getTestimonials() {
  const testimonials = await db.select().from(testimonialsTable);
  return testimonials;
}

export async function getSubscriptions() {
  const subscriptions = await db.select().from(subscriptionsTable);
  return subscriptions;
}
