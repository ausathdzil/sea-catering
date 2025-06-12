ALTER TABLE "subscriptions" ADD COLUMN "meal_plan_id" text;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "meal_plan" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "delivery_days" text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_meal_plan_id_meal_plans_id_fk" FOREIGN KEY ("meal_plan_id") REFERENCES "public"."meal_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "plan";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "meal_type";--> statement-breakpoint
ALTER TABLE "subscriptions" DROP COLUMN "delivery_day";