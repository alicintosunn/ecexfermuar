CREATE TABLE "admin_sessions" (
	"token" text PRIMARY KEY NOT NULL,
	"user_id" integer,
	"is_default_admin" boolean DEFAULT false NOT NULL,
	"expires_at" text NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"email" text NOT NULL,
	"password_hash" text NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "blog_posts" (
	"id" serial PRIMARY KEY NOT NULL,
	"title_en" text NOT NULL,
	"title_tr" text NOT NULL,
	"excerpt_en" text DEFAULT '' NOT NULL,
	"excerpt_tr" text DEFAULT '' NOT NULL,
	"content_en" text DEFAULT '' NOT NULL,
	"content_tr" text DEFAULT '' NOT NULL,
	"image_key" text,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"full_name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text DEFAULT '' NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_sections" (
	"key" text PRIMARY KEY NOT NULL,
	"title_en" text DEFAULT '' NOT NULL,
	"title_tr" text DEFAULT '' NOT NULL,
	"body_en" text DEFAULT '' NOT NULL,
	"body_tr" text DEFAULT '' NOT NULL,
	"image_key" text,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_reset_tokens" (
	"token" text PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"expires_at" text NOT NULL,
	"used" boolean DEFAULT false NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "popups" (
	"id" serial PRIMARY KEY NOT NULL,
	"language" text DEFAULT 'en' NOT NULL,
	"message" text DEFAULT '' NOT NULL,
	"image_key" text,
	"video_key" text,
	"published" boolean DEFAULT true NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"title_en" text NOT NULL,
	"title_tr" text NOT NULL,
	"overview_en" text DEFAULT '' NOT NULL,
	"overview_tr" text DEFAULT '' NOT NULL,
	"features_en" text DEFAULT '' NOT NULL,
	"features_tr" text DEFAULT '' NOT NULL,
	"uses_en" text DEFAULT '' NOT NULL,
	"uses_tr" text DEFAULT '' NOT NULL,
	"image_key" text,
	"gallery_keys" text DEFAULT '[]' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product_options" (
	"id" serial PRIMARY KEY NOT NULL,
	"category" text NOT NULL,
	"option_type" text NOT NULL,
	"product_item_id" integer,
	"product_item_ids" text DEFAULT '[]' NOT NULL,
	"title_en" text NOT NULL,
	"title_tr" text NOT NULL,
	"body_en" text DEFAULT '' NOT NULL,
	"body_tr" text DEFAULT '' NOT NULL,
	"image_key" text,
	"gallery_keys" text DEFAULT '[]' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "site_settings" (
	"key" text PRIMARY KEY NOT NULL,
	"value" text DEFAULT '' NOT NULL,
	"updated_at" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
