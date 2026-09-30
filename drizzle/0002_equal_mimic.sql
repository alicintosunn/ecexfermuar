CREATE TABLE `product_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category` text NOT NULL,
	`title_en` text NOT NULL,
	`title_tr` text NOT NULL,
	`overview_en` text DEFAULT '' NOT NULL,
	`overview_tr` text DEFAULT '' NOT NULL,
	`features_en` text DEFAULT '' NOT NULL,
	`features_tr` text DEFAULT '' NOT NULL,
	`uses_en` text DEFAULT '' NOT NULL,
	`uses_tr` text DEFAULT '' NOT NULL,
	`image_key` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `product_options` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`category` text NOT NULL,
	`option_type` text NOT NULL,
	`title_en` text NOT NULL,
	`title_tr` text NOT NULL,
	`body_en` text DEFAULT '' NOT NULL,
	`body_tr` text DEFAULT '' NOT NULL,
	`image_key` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
