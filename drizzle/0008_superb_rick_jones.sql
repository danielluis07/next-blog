ALTER TABLE "post" ADD COLUMN "short_description" text;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "is_featured" boolean DEFAULT false;