CREATE TYPE "public"."meal_plan_category" AS ENUM('diet', 'protein', 'royal');--> statement-breakpoint
CREATE TABLE "meal_plans" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"category" "meal_plan_category" NOT NULL,
	"price" integer NOT NULL,
	"details" jsonb NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
