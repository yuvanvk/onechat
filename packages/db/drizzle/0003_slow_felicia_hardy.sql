CREATE TABLE `model` (
	`id` text PRIMARY KEY NOT NULL,
	`model_id` text NOT NULL,
	`provider` text NOT NULL,
	`display_name` text NOT NULL,
	`description` text NOT NULL,
	`tier` text DEFAULT 'free' NOT NULL,
	`usecase` text DEFAULT 'text' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`capabilities` text,
	`raw_input_rate_usd` real NOT NULL,
	`raw_output_rate_usd` real NOT NULL,
	`input_rate_usd` real NOT NULL,
	`output_rate_usd` real NOT NULL,
	`image_rate_usd` real,
	`markup_multiplier` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `model_model_id_unique` ON `model` (`model_id`);--> statement-breakpoint
DROP TABLE `model_rate`;