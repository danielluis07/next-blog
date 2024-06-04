ALTER TABLE "account" RENAME COLUMN "user_Id" TO "userId";--> statement-breakpoint
ALTER TABLE "account" RENAME COLUMN "providerAccount_Id" TO "providerAccountId";--> statement-breakpoint
ALTER TABLE "account" DROP CONSTRAINT "account_user_Id_user_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "account" ADD CONSTRAINT "account_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
