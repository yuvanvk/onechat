ALTER TABLE `favourite` RENAME COLUMN "favourite" TO "id";--> statement-breakpoint
CREATE TABLE `credit_ledger` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`conversation_id` text,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`model_id` text,
	`provider` text,
	`input_tokens` integer,
	`output_tokens` integer,
	`input_rate_used` real,
	`output_rate_used` real,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`conversation_id`) REFERENCES `conversation`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX `ledger_user_idx` ON `credit_ledger` (`user_id`);--> statement-breakpoint
CREATE INDEX `ledger_conversation_idx` ON `credit_ledger` (`conversation_id`);--> statement-breakpoint
CREATE TABLE `model_rate` (
	`id` text PRIMARY KEY NOT NULL,
	`model_id` text NOT NULL,
	`provider` text NOT NULL,
	`raw_input_rate_usd` real NOT NULL,
	`raw_output_rate_usd` real NOT NULL,
	`input_rate_usd` real NOT NULL,
	`output_rate_usd` real NOT NULL,
	`image_rate_usd` real,
	`markup_multiplier` real NOT NULL,
	`min_tier` text DEFAULT 'free' NOT NULL,
	`usecase` text DEFAULT 'text' NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `model_rate_model_id_unique` ON `model_rate` (`model_id`);--> statement-breakpoint
ALTER TABLE `favourite` ADD `description` text NOT NULL;--> statement-breakpoint
ALTER TABLE `favourite` ADD `capabilities` text NOT NULL;--> statement-breakpoint
ALTER TABLE `favourite` ADD `user_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `favourite` ADD `created_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `favourite` ADD `updated_at` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `tier` text DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `credit_balance` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `reserved_credits` integer DEFAULT 0 NOT NULL;