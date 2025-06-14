ALTER TABLE "meal_plans" ADD COLUMN "recommended_custom_plan" jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "meal_plans" DROP COLUMN "category";--> statement-breakpoint
ALTER TABLE "meal_plans" DROP COLUMN "details";--> statement-breakpoint
DROP TYPE "public"."meal_plan_category";