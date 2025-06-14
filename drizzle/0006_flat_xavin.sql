CREATE TYPE "public"."subscription_status" AS ENUM('active', 'paused', 'cancelled');--> statement-breakpoint
ALTER TABLE "subscriptions" RENAME COLUMN "is_active" TO "status";