CREATE TABLE `demo_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`phase` text NOT NULL,
	`expires_at` integer NOT NULL,
	CONSTRAINT "demo_session_phase" CHECK("demo_sessions"."phase" IN ('mpin', 'active'))
);
--> statement-breakpoint
CREATE INDEX `demo_sessions_expiry` ON `demo_sessions` (`expires_at`);