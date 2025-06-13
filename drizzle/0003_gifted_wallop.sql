ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_meal_plan_id_meal_plans_id_fk";
--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "meal_plan_id";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "delivery_days";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "allergies";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "total_price";