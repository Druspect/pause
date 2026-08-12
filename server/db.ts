import { and, asc, count, desc, eq, like, or } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  catalogSources,
  InsertSourceSubmission,
  InsertUser,
  sourceSubmissions,
  users,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let databaseConnection: ReturnType<typeof drizzle> | null = null;

export type CatalogQueryFilters = {
  primarySubject?: (typeof import("../drizzle/schema").catalogSubjects)[number];
  sourceKind?: (typeof import("../drizzle/schema").catalogSourceKinds)[number];
  query?: string;
};

export async function getDb() {
  if (!databaseConnection && process.env.DATABASE_URL) {
    try {
      databaseConnection = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      databaseConnection = null;
    }
  }

  return databaseConnection;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  const nullableTextFields = ["name", "email", "loginMethod"] as const;

  nullableTextFields.forEach(field => {
    if (user[field] !== undefined) {
      const normalizedValue = user[field] ?? null;
      values[field] = normalizedValue;
      updateSet[field] = normalizedValue;
    }
  });

  if (user.lastSignedIn !== undefined) {
    values.lastSignedIn = user.lastSignedIn;
    updateSet.lastSignedIn = user.lastSignedIn;
  }

  if (user.role !== undefined) {
    values.role = user.role;
    updateSet.role = user.role;
  } else if (user.openId === ENV.ownerOpenId) {
    values.role = "admin";
    updateSet.role = "admin";
  }

  values.lastSignedIn ??= new Date();
  if (Object.keys(updateSet).length === 0) {
    updateSet.lastSignedIn = new Date();
  }

  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result[0];
}

export async function listPublishedCatalogSources(filters: CatalogQueryFilters = {}) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  const publicationConditions = [
    or(
      eq(catalogSources.verificationStatus, "verified"),
      eq(catalogSources.verificationStatus, "archived"),
    ),
  ];

  if (filters.primarySubject) {
    publicationConditions.push(eq(catalogSources.primarySubject, filters.primarySubject));
  }

  if (filters.sourceKind) {
    publicationConditions.push(eq(catalogSources.sourceKind, filters.sourceKind));
  }

  if (filters.query) {
    const catalogSearchPattern = `%${filters.query.trim()}%`;
    publicationConditions.push(
      or(
        like(catalogSources.title, catalogSearchPattern),
        like(catalogSources.description, catalogSearchPattern),
        like(catalogSources.steward, catalogSearchPattern),
      ),
    );
  }

  return db
    .select()
    .from(catalogSources)
    .where(and(...publicationConditions))
    .orderBy(asc(catalogSources.accession));
}

export async function getPublicCatalogStats() {
  const db = await getDb();
  if (!db) {
    return { publishedSourceCount: 0 };
  }

  const result = await db
    .select({ publishedSourceCount: count() })
    .from(catalogSources)
    .where(
      or(
        eq(catalogSources.verificationStatus, "verified"),
        eq(catalogSources.verificationStatus, "archived"),
      ),
    );

  return { publishedSourceCount: Number(result[0]?.publishedSourceCount ?? 0) };
}

export async function createSourceSubmission(sourceSubmission: InsertSourceSubmission) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database is unavailable");
  }

  await db.insert(sourceSubmissions).values(sourceSubmission);
}

export async function listSourceSubmissionsForUser(submittedByUserId: number) {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return db
    .select()
    .from(sourceSubmissions)
    .where(eq(sourceSubmissions.submittedByUserId, submittedByUserId))
    .orderBy(desc(sourceSubmissions.createdAt));
}

export async function listSourceSubmissionsForEditor() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return db.select().from(sourceSubmissions).orderBy(desc(sourceSubmissions.createdAt));
}

export async function updateSourceSubmissionReview(
  submissionId: number,
  reviewerId: number,
  status: "reviewed" | "declined",
  reviewerNotes?: string,
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database is unavailable");
  }

  await db
    .update(sourceSubmissions)
    .set({
      status,
      reviewerNotes: reviewerNotes || null,
      reviewedByUserId: reviewerId,
      reviewedAt: new Date(),
    })
    .where(eq(sourceSubmissions.id, submissionId));
}
