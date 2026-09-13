CREATE TABLE `admin_accounts` (
	`id` integer PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`password_hash` text NOT NULL,
	`mobile_hash_key` text NOT NULL,
	`version` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `admin_login_attempts` (
	`id` integer PRIMARY KEY NOT NULL,
	`failures` integer NOT NULL,
	`blocked_until` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `admin_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` integer NOT NULL,
	`version` integer NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `admin_sessions_expiry` ON `admin_sessions` (`expires_at`);--> statement-breakpoint
CREATE TABLE `user_login_events` (
	`id` text PRIMARY KEY NOT NULL,
	`user_hash` text NOT NULL,
	`logged_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `user_login_events_date` ON `user_login_events` (`logged_at`);--> statement-breakpoint
CREATE INDEX `user_login_events_user` ON `user_login_events` (`user_hash`);--> statement-breakpoint
CREATE TABLE `wallet_users` (
	`mobile_hash` text PRIMARY KEY NOT NULL,
	`first_login` integer NOT NULL,
	`last_login` integer NOT NULL,
	`login_count` integer NOT NULL,
	`deleted_at` integer
);
--> statement-breakpoint
ALTER TABLE `demo_sessions` ADD `user_hash` text;