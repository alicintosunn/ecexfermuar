CREATE TABLE `blog_posts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title_en` text NOT NULL,
	`title_tr` text NOT NULL,
	`excerpt_en` text DEFAULT '' NOT NULL,
	`excerpt_tr` text DEFAULT '' NOT NULL,
	`content_en` text DEFAULT '' NOT NULL,
	`content_tr` text DEFAULT '' NOT NULL,
	`image_key` text,
	`published` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `content_sections` (
	`key` text PRIMARY KEY NOT NULL,
	`title_en` text DEFAULT '' NOT NULL,
	`title_tr` text DEFAULT '' NOT NULL,
	`body_en` text DEFAULT '' NOT NULL,
	`body_tr` text DEFAULT '' NOT NULL,
	`image_key` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
