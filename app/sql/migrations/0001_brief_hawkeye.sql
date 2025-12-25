CREATE TABLE "posts" (
	"post_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_post_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"title" text NOT NULL,
	"content" text NOT NULL,
	"category_id" bigint,
	"view_count" bigint DEFAULT 0 NOT NULL,
	"read_time" integer NOT NULL,
	"tag" bigint,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_tag_categories_category_id_fk" FOREIGN KEY ("tag") REFERENCES "public"."categories"("category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "posts_tag_idx" ON "posts" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "posts_category_idx" ON "posts" USING btree ("tag");