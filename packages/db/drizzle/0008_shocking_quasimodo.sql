ALTER TABLE `user` ADD `customer_id` text;--> statement-breakpoint
CREATE UNIQUE INDEX `user_customer_id_unique` ON `user` (`customer_id`);