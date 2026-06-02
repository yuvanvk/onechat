CREATE TABLE `favourite` (
	`favourite` text PRIMARY KEY NOT NULL,
	`model_id` text NOT NULL,
	`display_name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `favourite_model_id_unique` ON `favourite` (`model_id`);--> statement-breakpoint
ALTER TABLE `conversation` ADD `share_link` text;--> statement-breakpoint
CREATE UNIQUE INDEX `conversation_share_link_unique` ON `conversation` (`share_link`);