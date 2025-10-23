CREATE TABLE "list_group" (
	"id" serial PRIMARY KEY NOT NULL,
	"list_id" integer NOT NULL,
	"name" text DEFAULT 'Group'
);
--> statement-breakpoint
ALTER TABLE "list_item" ADD COLUMN "list_group_id" integer;--> statement-breakpoint
ALTER TABLE "list_group" ADD CONSTRAINT "list_group_list_id_list_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list_item" ADD CONSTRAINT "list_item_list_group_id_list_group_id_fk" FOREIGN KEY ("list_group_id") REFERENCES "public"."list_group"("id") ON DELETE cascade ON UPDATE no action;