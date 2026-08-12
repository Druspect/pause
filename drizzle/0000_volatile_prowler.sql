CREATE TABLE `catalog_source_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`catalogSourceId` int NOT NULL,
	`catalogTagId` int NOT NULL,
	CONSTRAINT `catalog_source_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `catalog_source_tags_unique` UNIQUE(`catalogSourceId`,`catalogTagId`)
);
--> statement-breakpoint
CREATE TABLE `catalog_sources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accession` varchar(32) NOT NULL,
	`title` varchar(512) NOT NULL,
	`canonicalUrl` varchar(2048) NOT NULL,
	`preservationUrl` varchar(2048),
	`sourceKind` enum('archive','book','documentation','manual','oral_history','paper','software','source_code') NOT NULL,
	`primarySubject` enum('programming_languages','operating_systems','computer_architecture','compilers_and_toolchains','networks','databases','graphics','security','source_code','manuals','oral_histories','general_computing_history') NOT NULL,
	`originalYearStart` int,
	`originalYearEnd` int,
	`steward` varchar(255),
	`description` text NOT NULL,
	`whyItMatters` text NOT NULL,
	`accessNotes` text,
	`rightsNotes` text,
	`verificationStatus` enum('submitted','reviewed','verified','archived') NOT NULL DEFAULT 'submitted',
	`metadataCheckedAt` timestamp,
	`addedByUserId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `catalog_sources_id` PRIMARY KEY(`id`),
	CONSTRAINT `catalog_sources_accession_unique` UNIQUE(`accession`)
);
--> statement-breakpoint
CREATE TABLE `catalog_tags` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(100) NOT NULL,
	`label` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `catalog_tags_id` PRIMARY KEY(`id`),
	CONSTRAINT `catalog_tags_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `source_submissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`submittedByUserId` int NOT NULL,
	`title` varchar(512) NOT NULL,
	`sourceUrl` varchar(2048) NOT NULL,
	`originalYear` int,
	`proposedSubject` enum('programming_languages','operating_systems','computer_architecture','compilers_and_toolchains','networks','databases','graphics','security','source_code','manuals','oral_histories','general_computing_history'),
	`sourceKind` enum('archive','book','documentation','manual','oral_history','paper','software','source_code'),
	`technicalSummary` text NOT NULL,
	`lastingValue` text NOT NULL,
	`accessNotes` text,
	`status` enum('submitted','reviewed','declined') NOT NULL DEFAULT 'submitted',
	`reviewerNotes` text,
	`reviewedByUserId` int,
	`reviewedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `source_submissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin') NOT NULL DEFAULT 'user',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
--> statement-breakpoint
ALTER TABLE `catalog_source_tags` ADD CONSTRAINT `catalog_source_tags_catalogSourceId_catalog_sources_id_fk` FOREIGN KEY (`catalogSourceId`) REFERENCES `catalog_sources`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `catalog_source_tags` ADD CONSTRAINT `catalog_source_tags_catalogTagId_catalog_tags_id_fk` FOREIGN KEY (`catalogTagId`) REFERENCES `catalog_tags`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `catalog_sources` ADD CONSTRAINT `catalog_sources_addedByUserId_users_id_fk` FOREIGN KEY (`addedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `source_submissions` ADD CONSTRAINT `source_submissions_submittedByUserId_users_id_fk` FOREIGN KEY (`submittedByUserId`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `source_submissions` ADD CONSTRAINT `source_submissions_reviewedByUserId_users_id_fk` FOREIGN KEY (`reviewedByUserId`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `catalog_source_tags_source_index` ON `catalog_source_tags` (`catalogSourceId`);--> statement-breakpoint
CREATE INDEX `catalog_sources_visibility_index` ON `catalog_sources` (`verificationStatus`);--> statement-breakpoint
CREATE INDEX `catalog_sources_subject_index` ON `catalog_sources` (`primarySubject`);--> statement-breakpoint
CREATE INDEX `catalog_sources_kind_index` ON `catalog_sources` (`sourceKind`);--> statement-breakpoint
CREATE INDEX `source_submissions_status_index` ON `source_submissions` (`status`);--> statement-breakpoint
CREATE INDEX `source_submissions_submitter_index` ON `source_submissions` (`submittedByUserId`);