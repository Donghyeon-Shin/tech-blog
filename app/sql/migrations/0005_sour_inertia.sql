ALTER TABLE "posts" RENAME COLUMN "tag" TO "tag_id";--> statement-breakpoint
ALTER TABLE "posts" DROP CONSTRAINT "posts_tag_categories_category_id_fk";
--> statement-breakpoint
DROP INDEX "posts_category_idx";--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_tag_id_categories_category_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."categories"("category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "posts_category_idx" ON "posts" USING btree ("tag_id");