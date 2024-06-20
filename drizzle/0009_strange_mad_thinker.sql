ALTER TABLE "post" RENAME COLUMN "published" TO "is_published";--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "is_published" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "is_featured" SET NOT NULL;