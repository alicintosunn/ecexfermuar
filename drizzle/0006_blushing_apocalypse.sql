CREATE TABLE `popups` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`language` text DEFAULT 'en' NOT NULL,
	`message` text DEFAULT '' NOT NULL,
	`image_key` text,
	`video_key` text,
	`published` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
