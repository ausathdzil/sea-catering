ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DEFAULT 'active'::text;--> statement-breakpoint
DROP TYPE "public"."subscription_status";--> statement-breakpoint
CREATE TYPE "public"."subscription_status" AS ENUM('active', 'paused', 'canceled');--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DEFAULT 'active'::"public"."subscription_status";--> statement-breakpoint
ALTER TABLE "subscriptions" ALTER COLUMN "status" SET DATA TYPE "public"."subscription_status" USING "status"::"public"."subscription_status";--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "paused_until" timestamp;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "canceled_at" timestamp;