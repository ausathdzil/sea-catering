CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"phone_number" text NOT NULL,
	"plan" text NOT NULL,
	"meal_type" text[] NOT NULL,
	"delivery_day" integer NOT NULL,
	"allergies" text[],
	"total_price" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" text PRIMARY KEY NOT NULL,
	"author" text NOT NULL,
	"content" text NOT NULL,
	"rating" integer NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
