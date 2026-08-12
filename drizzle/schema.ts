import {
  index,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/mysql-core";

export const catalogSourceKinds = [
  "archive",
  "book",
  "documentation",
  "manual",
  "oral_history",
  "paper",
  "software",
  "source_code",
] as const;

export const catalogSubjects = [
  "programming_languages",
  "operating_systems",
  "computer_architecture",
  "compilers_and_toolchains",
  "networks",
  "databases",
  "graphics",
  "security",
  "source_code",
  "manuals",
  "oral_histories",
  "general_computing_history",
] as const;

export const sourceVerificationStatuses = ["submitted", "reviewed", "verified", "archived"] as const;

export const sourceSubmissionStatuses = ["submitted", "reviewed", "declined"] as const;

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const catalogSources = mysqlTable(
  "catalog_sources",
  {
    id: int("id").autoincrement().primaryKey(),
    accession: varchar("accession", { length: 32 }).notNull(),
    title: varchar("title", { length: 512 }).notNull(),
    canonicalUrl: varchar("canonicalUrl", { length: 2048 }).notNull(),
    preservationUrl: varchar("preservationUrl", { length: 2048 }),
    sourceKind: mysqlEnum("sourceKind", catalogSourceKinds).notNull(),
    primarySubject: mysqlEnum("primarySubject", catalogSubjects).notNull(),
    originalYearStart: int("originalYearStart"),
    originalYearEnd: int("originalYearEnd"),
    steward: varchar("steward", { length: 255 }),
    description: text("description").notNull(),
    whyItMatters: text("whyItMatters").notNull(),
    accessNotes: text("accessNotes"),
    rightsNotes: text("rightsNotes"),
    verificationStatus: mysqlEnum("verificationStatus", sourceVerificationStatuses)
      .default("submitted")
      .notNull(),
    metadataCheckedAt: timestamp("metadataCheckedAt"),
    addedByUserId: int("addedByUserId").references(() => users.id, { onDelete: "set null" }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    uniqueIndex("catalog_sources_accession_unique").on(table.accession),
    index("catalog_sources_visibility_index").on(table.verificationStatus),
    index("catalog_sources_subject_index").on(table.primarySubject),
    index("catalog_sources_kind_index").on(table.sourceKind),
  ],
);

export const catalogTags = mysqlTable(
  "catalog_tags",
  {
    id: int("id").autoincrement().primaryKey(),
    slug: varchar("slug", { length: 100 }).notNull(),
    label: varchar("label", { length: 100 }).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  table => [uniqueIndex("catalog_tags_slug_unique").on(table.slug)],
);

export const catalogSourceTags = mysqlTable(
  "catalog_source_tags",
  {
    id: int("id").autoincrement().primaryKey(),
    catalogSourceId: int("catalogSourceId")
      .notNull()
      .references(() => catalogSources.id, { onDelete: "cascade" }),
    catalogTagId: int("catalogTagId")
      .notNull()
      .references(() => catalogTags.id, { onDelete: "cascade" }),
  },
  table => [
    uniqueIndex("catalog_source_tags_unique").on(table.catalogSourceId, table.catalogTagId),
    index("catalog_source_tags_source_index").on(table.catalogSourceId),
  ],
);

export const sourceSubmissions = mysqlTable(
  "source_submissions",
  {
    id: int("id").autoincrement().primaryKey(),
    submittedByUserId: int("submittedByUserId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: varchar("title", { length: 512 }).notNull(),
    sourceUrl: varchar("sourceUrl", { length: 2048 }).notNull(),
    originalYear: int("originalYear"),
    proposedSubject: mysqlEnum("proposedSubject", catalogSubjects),
    sourceKind: mysqlEnum("sourceKind", catalogSourceKinds),
    technicalSummary: text("technicalSummary").notNull(),
    lastingValue: text("lastingValue").notNull(),
    accessNotes: text("accessNotes"),
    status: mysqlEnum("status", sourceSubmissionStatuses).default("submitted").notNull(),
    reviewerNotes: text("reviewerNotes"),
    reviewedByUserId: int("reviewedByUserId").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  table => [
    index("source_submissions_status_index").on(table.status),
    index("source_submissions_submitter_index").on(table.submittedByUserId),
  ],
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type CatalogSource = typeof catalogSources.$inferSelect;
export type InsertCatalogSource = typeof catalogSources.$inferInsert;
export type SourceSubmission = typeof sourceSubmissions.$inferSelect;
export type InsertSourceSubmission = typeof sourceSubmissions.$inferInsert;
