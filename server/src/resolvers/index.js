const Review = require("../models/Review");
const Comment = require("../models/Comment");

const resolvers = {
  Query: {
    reviews: async (_, { workspaceId, status }, { userId }) => {
      const query = { workspace: workspaceId };
      if (status) query.status = status;
      return Review.find(query).populate("author","name email avatar").populate("reviewers","name email").sort({ createdAt: -1 });
    },
    review: async (_, { id }) => Review.findById(id).populate("author","name email").populate("reviewers","name email"),
  },
  Mutation: {
    createReview: async (_, { input }, { userId }) => {
      const review = await Review.create({ ...input, author: userId });
      return review.populate("author","name email");
    },
    addComment: async (_, { reviewId, lineNumber, filePath, body, replyToId }, { userId }) => {
      const comment = await Comment.create({ body, lineNumber, filePath, review: reviewId, author: userId, replyTo: replyToId || null });
      return comment.populate("author","name avatar");
    },
    submitReview: async (_, { reviewId, decision }, { userId }) => {
      const update = { decision };
      if (decision === "APPROVE") update.status = "APPROVED";
      else if (decision === "REQUEST_CHANGES") update.status = "CHANGES_REQUESTED";
      return Review.findByIdAndUpdate(reviewId, update, { new: true });
    },
    resolveComment: async (_, { id }, { userId }) => {
      return Comment.findByIdAndUpdate(id, { resolved: true, resolvedBy: userId, resolvedAt: new Date() }, { new: true });
    },
  },
};
module.exports = resolvers;
