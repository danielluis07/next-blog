ALTER TABLE "notification" ADD COLUMN "post_Id" uuid;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "notification" ADD CONSTRAINT "notification_post_Id_post_id_fk" FOREIGN KEY ("post_Id") REFERENCES "public"."post"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
