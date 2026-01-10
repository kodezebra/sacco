CREATE TABLE `associations` (
	`id` text PRIMARY KEY NOT NULL,
	`sacco_id` text NOT NULL,
	`name` text NOT NULL,
	`type` text,
	`status` text DEFAULT 'active',
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `loan_payments` (
	`id` text PRIMARY KEY NOT NULL,
	`loan_id` text NOT NULL,
	`amount` integer NOT NULL,
	`date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `loans` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`principal` integer NOT NULL,
	`interest_rate` real NOT NULL,
	`duration_months` integer DEFAULT 6,
	`issued_date` text NOT NULL,
	`status` text DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`sacco_id` text NOT NULL,
	`full_name` text NOT NULL,
	`phone` text,
	`member_number` text,
	`address` text,
	`next_of_kin_name` text,
	`next_of_kin_phone` text,
	`status` text DEFAULT 'active',
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `members_member_number_unique` ON `members` (`member_number`);--> statement-breakpoint
CREATE TABLE `payroll` (
	`id` text PRIMARY KEY NOT NULL,
	`staff_id` text NOT NULL,
	`transaction_id` text NOT NULL,
	`amount` integer NOT NULL,
	`date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sacco` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `savings` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`type` text NOT NULL,
	`amount` integer NOT NULL,
	`date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `shares` (
	`id` text PRIMARY KEY NOT NULL,
	`member_id` text NOT NULL,
	`amount` integer NOT NULL,
	`date` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `staff` (
	`id` text PRIMARY KEY NOT NULL,
	`association_id` text NOT NULL,
	`full_name` text NOT NULL,
	`role` text,
	`salary` integer,
	`status` text DEFAULT 'active'
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` text PRIMARY KEY NOT NULL,
	`association_id` text NOT NULL,
	`type` text NOT NULL,
	`category` text NOT NULL,
	`amount` integer NOT NULL,
	`description` text,
	`date` text NOT NULL
);
