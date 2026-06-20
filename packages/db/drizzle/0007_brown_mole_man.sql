PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer NOT NULL,
	`plan` text DEFAULT 'free' NOT NULL,
	`credit_balance` integer DEFAULT 20000 NOT NULL,
	`reserved_credits` integer DEFAULT 0 NOT NULL,
	`subscription_id` text,
	`cancel_at_next_billing_date` integer DEFAULT false,
	`image` text,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_user`("id", "name", "email", "email_verified", "plan", "credit_balance", "reserved_credits", "subscription_id", "cancel_at_next_billing_date", "image", "created_at", "updated_at") SELECT "id", "name", "email", "email_verified", "plan", "credit_balance", "reserved_credits", "subscription_id", "cancel_at_next_billing_date", "image", "created_at", "updated_at" FROM `user`;--> statement-breakpoint
DROP TABLE `user`;--> statement-breakpoint
ALTER TABLE `__new_user` RENAME TO `user`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_subscription_id_unique` ON `user` (`subscription_id`);