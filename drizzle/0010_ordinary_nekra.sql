DO $$ BEGIN
 CREATE TYPE "public"."league" AS ENUM('NFL', 'NBA');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."post_type" AS ENUM('NOTÍCIAS', 'OPINIÃO', 'PODCAST');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "league" "league" NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "post_type" "post_type" NOT NULL;