ALTER TABLE "subscriptions" ADD COLUMN "start_at" timestamp;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "due_date" timestamp;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "reactivations" integer DEFAULT 0 NOT NULL;