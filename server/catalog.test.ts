import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mockCatalogSource = {
  id: 1,
  accession: "P-001",
  title: "Verified source",
  canonicalUrl: "https://example.org/source",
  preservationUrl: null,
  sourceKind: "archive" as const,
  primarySubject: "operating_systems" as const,
  originalYearStart: 1970,
  originalYearEnd: 1975,
  steward: "Example steward",
  description: "A verified source description for a public catalog test.",
  whyItMatters: "It demonstrates that the public catalog only serves verified material.",
  accessNotes: null,
  rightsNotes: null,
  verificationStatus: "verified" as const,
  metadataCheckedAt: new Date(),
  addedByUserId: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const databaseMocks = vi.hoisted(() => ({
  createSourceSubmission: vi.fn(),
  getPublicCatalogStats: vi.fn(),
  listPublishedCatalogSources: vi.fn(),
  listSourceSubmissionsForEditor: vi.fn(),
  listSourceSubmissionsForUser: vi.fn(),
  updateSourceSubmissionReview: vi.fn(),
}));

vi.mock("./db", () => databaseMocks);

import { appRouter } from "./routers";

function makeContext(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const authenticatedUser = {
  id: 42,
  openId: "catalog-contributor",
  name: "Catalog Contributor",
  email: "contributor@example.com",
  loginMethod: "manus",
  role: "user" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

describe("Pause catalog router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    databaseMocks.listPublishedCatalogSources.mockResolvedValue([mockCatalogSource]);
    databaseMocks.getPublicCatalogStats.mockResolvedValue({ publishedSourceCount: 1 });
    databaseMocks.createSourceSubmission.mockResolvedValue(undefined);
  });

  it("returns public records through the catalog query", async () => {
    const caller = appRouter.createCaller(makeContext(null));

    const records = await caller.catalog.list({ primarySubject: "operating_systems" });
    const stats = await caller.catalog.stats();

    expect(databaseMocks.listPublishedCatalogSources).toHaveBeenCalledWith({ primarySubject: "operating_systems" });
    expect(records).toEqual([mockCatalogSource]);
    expect(stats).toEqual({ publishedSourceCount: 1 });
  });

  it("records a complete proposal against the authenticated contributor", async () => {
    const caller = appRouter.createCaller(makeContext(authenticatedUser));

    const proposal = {
      title: "A grounded systems reference",
      sourceUrl: "https://example.org/reference",
      originalYear: 1978,
      proposedSubject: "operating_systems" as const,
      sourceKind: "manual" as const,
      technicalSummary: "A detailed source that describes an operating system, its constraints, and its machine interfaces.",
      lastingValue: "It makes a historical design trade-off inspectable rather than repeating a simplified account.",
      accessNotes: "Available for study through the canonical steward.",
    };

    await expect(caller.submissions.create(proposal)).resolves.toEqual({ success: true });
    expect(databaseMocks.createSourceSubmission).toHaveBeenCalledWith({ ...proposal, submittedByUserId: 42 });
  });

  it("requires sign-in before a source proposal can enter the review queue", async () => {
    const caller = appRouter.createCaller(makeContext(null));

    await expect(
      caller.submissions.create({
        title: "A grounded systems reference",
        sourceUrl: "https://example.org/reference",
        technicalSummary: "A detailed source that describes an operating system, its constraints, and its machine interfaces.",
        lastingValue: "It makes a historical design trade-off inspectable rather than repeating a simplified account.",
      }),
    ).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });
});
