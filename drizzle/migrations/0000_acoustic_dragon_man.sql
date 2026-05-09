CREATE TYPE "public"."api_key_status" AS ENUM('active', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."post_link_type" AS ENUM('wikilink', 'markdown', 'tag');--> statement-breakpoint
CREATE TYPE "public"."post_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."publish_log_action" AS ENUM('created', 'updated', 'published', 'archived', 'deleted');--> statement-breakpoint
CREATE TABLE "api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"key_hash" text NOT NULL,
	"status" "api_key_status" DEFAULT 'active' NOT NULL,
	"hmac_required" boolean DEFAULT false NOT NULL,
	"last_used_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"revoked_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "post_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"source_post_id" uuid NOT NULL,
	"target_post_id" uuid,
	"target_slug" text NOT NULL,
	"link_type" "post_link_type" NOT NULL,
	"raw_text" text NOT NULL,
	"display_text" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_search_index" (
	"post_id" uuid PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title_text" text NOT NULL,
	"body_text" text NOT NULL,
	"tag_text" text DEFAULT '' NOT NULL,
	"series_text" text DEFAULT '' NOT NULL,
	"search_text" text NOT NULL,
	"search_vector" "tsvector" NOT NULL,
	"indexed_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "post_tags" (
	"post_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "post_tags_post_id_tag_id_pk" PRIMARY KEY("post_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"markdown_path" text NOT NULL,
	"status" "post_status" DEFAULT 'draft' NOT NULL,
	"series" text,
	"canonical_url" text,
	"og_image" text,
	"reading_time" integer,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "publish_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"post_id" uuid,
	"post_slug" text NOT NULL,
	"action" "publish_log_action" NOT NULL,
	"actor_key_id" uuid,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "post_links" ADD CONSTRAINT "post_links_source_post_id_posts_id_fk" FOREIGN KEY ("source_post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_links" ADD CONSTRAINT "post_links_target_post_id_posts_id_fk" FOREIGN KEY ("target_post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_search_index" ADD CONSTRAINT "post_search_index_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post_tags" ADD CONSTRAINT "post_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publish_logs" ADD CONSTRAINT "publish_logs_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "publish_logs" ADD CONSTRAINT "publish_logs_actor_key_id_api_keys_id_fk" FOREIGN KEY ("actor_key_id") REFERENCES "public"."api_keys"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "api_keys_key_hash_unique" ON "api_keys" USING btree ("key_hash");--> statement-breakpoint
CREATE INDEX "api_keys_status_idx" ON "api_keys" USING btree ("status");--> statement-breakpoint
CREATE INDEX "post_links_source_post_id_idx" ON "post_links" USING btree ("source_post_id");--> statement-breakpoint
CREATE INDEX "post_links_target_post_id_idx" ON "post_links" USING btree ("target_post_id");--> statement-breakpoint
CREATE INDEX "post_links_target_slug_idx" ON "post_links" USING btree ("target_slug");--> statement-breakpoint
CREATE INDEX "post_links_link_type_idx" ON "post_links" USING btree ("link_type");--> statement-breakpoint
CREATE UNIQUE INDEX "post_search_index_slug_unique" ON "post_search_index" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "post_search_index_search_vector_idx" ON "post_search_index" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "post_search_index_indexed_at_idx" ON "post_search_index" USING btree ("indexed_at");--> statement-breakpoint
CREATE INDEX "post_tags_post_id_idx" ON "post_tags" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "post_tags_tag_id_idx" ON "post_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE UNIQUE INDEX "posts_slug_unique" ON "posts" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "posts_status_idx" ON "posts" USING btree ("status");--> statement-breakpoint
CREATE INDEX "posts_series_idx" ON "posts" USING btree ("series");--> statement-breakpoint
CREATE INDEX "posts_published_at_idx" ON "posts" USING btree ("published_at");--> statement-breakpoint
CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "publish_logs_post_id_idx" ON "publish_logs" USING btree ("post_id");--> statement-breakpoint
CREATE INDEX "publish_logs_post_slug_idx" ON "publish_logs" USING btree ("post_slug");--> statement-breakpoint
CREATE INDEX "publish_logs_action_idx" ON "publish_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "publish_logs_created_at_idx" ON "publish_logs" USING btree ("created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "tags_slug_unique" ON "tags" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "tags_name_idx" ON "tags" USING btree ("name");