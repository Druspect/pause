import { z } from "zod";
import {
  catalogSourceKinds,
  catalogSubjects,
  sourceSubmissionStatuses,
} from "../drizzle/schema";
import {
  createSourceSubmission,
  getPublicCatalogStats,
  listPublishedCatalogSources,
  listSourceSubmissionsForEditor,
  listSourceSubmissionsForUser,
  updateSourceSubmissionReview,
} from "./db";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./_core/trpc";

const catalogListInputSchema = z.object({
  primarySubject: z.enum(catalogSubjects).optional(),
  sourceKind: z.enum(catalogSourceKinds).optional(),
  query: z.string().trim().max(100).optional(),
});

const sourceSubmissionInputSchema = z.object({
  title: z.string().trim().min(3).max(512),
  sourceUrl: z.string().url().max(2048),
  originalYear: z.number().int().min(1800).max(new Date().getFullYear()).optional(),
  proposedSubject: z.enum(catalogSubjects).optional(),
  sourceKind: z.enum(catalogSourceKinds).optional(),
  technicalSummary: z.string().trim().min(30).max(5000),
  lastingValue: z.string().trim().min(30).max(5000),
  accessNotes: z.string().trim().max(2000).optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  catalog: router({
    list: publicProcedure.input(catalogListInputSchema).query(({ input }) => listPublishedCatalogSources(input)),
    stats: publicProcedure.query(() => getPublicCatalogStats()),
  }),
  submissions: router({
    create: protectedProcedure.input(sourceSubmissionInputSchema).mutation(async ({ ctx, input }) => {
      await createSourceSubmission({
        ...input,
        submittedByUserId: ctx.user.id,
      });
      return { success: true } as const;
    }),
    mine: protectedProcedure.query(({ ctx }) => listSourceSubmissionsForUser(ctx.user.id)),
  }),
  editor: router({
    submissions: adminProcedure.query(() => listSourceSubmissionsForEditor()),
    reviewSubmission: adminProcedure
      .input(
        z.object({
          submissionId: z.number().int().positive(),
          status: z.enum(sourceSubmissionStatuses).extract(["reviewed", "declined"]),
          reviewerNotes: z.string().trim().max(5000).optional(),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        await updateSourceSubmissionReview(
          input.submissionId,
          ctx.user.id,
          input.status,
          input.reviewerNotes,
        );
        return { success: true } as const;
      }),
  }),
});

export type AppRouter = typeof appRouter;

