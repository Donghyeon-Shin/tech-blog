CREATE TABLE "post_stats" (
	"stat_id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "post_stats_stat_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"post_id" bigint,
	"category_id" bigint,
	"daily_view_count" bigint DEFAULT 0 NOT NULL,
	"record_date" date NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_stats" ADD CONSTRAINT "post_stats_post_id_posts_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("post_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_stats" ADD CONSTRAINT "post_stats_category_id_categories_category_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("category_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "post_stats_record_date_idx" ON "post_stats" USING btree ("record_date");--> statement-breakpoint
CREATE INDEX "post_stats_category_id_idx" ON "post_stats" USING btree ("category_id");