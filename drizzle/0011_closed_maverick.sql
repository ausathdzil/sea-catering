ALTER TABLE "subscriptions" ADD COLUMN "is_paid" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD COLUMN "number_of_payments" integer DEFAULT 0 NOT NULL;