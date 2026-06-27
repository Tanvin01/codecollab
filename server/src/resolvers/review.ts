import { db } from "../lib/db";
export const reviewResolvers = {
  Query: {
    reviews: async (_: any, { workspaceId, status }: any, { userId }: any) => {
      const where: any = { workspaceId };
      if (status) where.status = status;
      return db.review.findMany({ where, include: { author: { select: { id: true, name: true, email: true } }, comments: { include: { author: { select: { id: true, name: true } } } }, _count: { select: { comments: true } } }, orderBy: { createdAt: "desc" } });
    },
    review: async (_: any, { id }: any) =>
      db.review.findUnique({ where: { id }, include: { author: true, comments: { include: { author: true, replies: { include: { author: true } } }, where: { replyToId: null }, orderBy: { createdAt: "asc" } } } }),
  },
  Mutation: {
    createReview: async (_: any, { input }: any, { userId }: any) =>
      db.review.create({ data: { ...input, authorId: userId, status: "OPEN" } }),
    addComment: async (_: any, { reviewId, lineNumber, filePath, body }: any, { userId }: any) => {
      const comment = await db.comment.create({ data: { reviewId, lineNumber, filePath, body, authorId: userId }, include: { author: true } });
      return comment;
    },
    resolveComment: async (_: any, { id }: any, { userId }: any) =>
      db.comment.update({ where: { id }, data: { resolved: true, resolvedById: userId, resolvedAt: new Date() } }),
    submitReview: async (_: any, { reviewId, decision }: any, { userId }: any) => {
      const status = decision === "APPROVE" ? "APPROVED" : decision === "REQUEST_CHANGES" ? "CHANGES_REQUESTED" : "OPEN";
      return db.review.update({ where: { id: reviewId }, data: { status, decision } });
    },
    deleteReview: async (_: any, { id }: any, { userId }: any) => {
      await db.review.delete({ where: { id } }); return true;
    },
  },
};
