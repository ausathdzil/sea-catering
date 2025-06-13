import {
  boolean,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

export const mealPlanCategoryEnum = pgEnum('meal_plan_category', [
  'diet',
  'protein',
  'royal',
]);

export interface MealPlanDetails {
  cancellationPolicy: string;
  customization: string;
  deliveryDays: string[];
  dietaryOptions: string[];
  mealsPerWeek: number;
  mealType: string[];
}

export const mealPlansTable = pgTable('meal_plans', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  description: text('description').notNull(),
  category: mealPlanCategoryEnum('category').notNull(),
  price: integer('price').notNull(),
  details: jsonb('details').$type<MealPlanDetails>().notNull(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const testimonialsTable = pgTable('testimonials', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  author: text('author').notNull(),
  content: text('content').notNull(),
  rating: integer('rating').notNull(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export interface CustomMealPlan {
  basePlan: string;
  mealTypes: string[];
  deliveryDays: number;
  allergies: string[];
  totalPrice: number;
}

export const subscriptionsTable = pgTable('subscriptions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text('name').notNull(),
  phoneNumber: text('phone_number').notNull(),
  mealPlan: jsonb('meal_plan').$type<CustomMealPlan>().notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export type MealPlan = typeof mealPlansTable.$inferSelect;
export type Testimonial = typeof testimonialsTable.$inferSelect;
export type Subscription = typeof subscriptionsTable.$inferSelect;
