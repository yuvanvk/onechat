ALTER TABLE `user` ADD `subscription_id` text;--> statement-breakpoint
ALTER TABLE `user` ADD `cancel_at_next_billing_date` integer DEFAULT false;--> statement-breakpoint
CREATE UNIQUE INDEX `user_subscription_id_unique` ON `user` (`subscription_id`);