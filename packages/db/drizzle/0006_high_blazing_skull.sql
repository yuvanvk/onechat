PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_credit_ledger` (
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
	FOREIGN KEY (`conversation_id`) REFERENCES `conversation`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_credit_ledger`("id", "user_id", "conversation_id", "type", "amount", "model_id", "provider", "input_tokens", "output_tokens", "input_rate_used", "output_rate_used", "created_at") SELECT "id", "user_id", "conversation_id", "type", "amount", "model_id", "provider", "input_tokens", "output_tokens", "input_rate_used", "output_rate_used", "created_at" FROM `credit_ledger`;--> statement-breakpoint
DROP TABLE `credit_ledger`;--> statement-breakpoint
ALTER TABLE `__new_credit_ledger` RENAME TO `credit_ledger`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE INDEX `ledger_user_idx` ON `credit_ledger` (`user_id`);--> statement-breakpoint
CREATE INDEX `ledger_conversation_idx` ON `credit_ledger` (`conversation_id`);