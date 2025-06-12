import { integer, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const testimonialsTable = pgTable('testimonials', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  author: text('author').notNull(),
  content: text('content').notNull(),
  rating: integer('rating').notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$defaultFn(() => new Date()),
});

export const subscriptionsTable = pgTable('subscriptions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  phoneNumber: text('phone_number').notNull(),
  plan: text('plan').notNull(),
  mealType: text('meal_type').array().notNull(),
  deliveryDay: integer('delivery_day').notNull(),
  allergies: text('allergies').array(),
  totalPrice: integer('total_price').notNull(),
  createdAt: timestamp('created_at')
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$defaultFn(() => new Date()),
});

export type Testimonial = typeof testimonialsTable.$inferSelect;
export type Subscription = typeof subscriptionsTable.$inferSelect;
