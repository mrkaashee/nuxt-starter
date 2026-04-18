PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text,
	`email` text NOT NULL,
	`password` text,
	`googleId` text,
	`avatar` text,
	`createdAt` integer
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "name", "email", "password", "googleId", "avatar", "createdAt") SELECT "id", "name", "email", "password", "googleId", "avatar", "createdAt" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);