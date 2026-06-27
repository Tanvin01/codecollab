const mongoose = require("mongoose");
const reviewSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  diff: { type: String, required: true },
  filePaths: [String],
  status: { type: String, enum: ["OPEN","APPROVED","CHANGES_REQUESTED","MERGED","CLOSED"], default: "OPEN" },
  decision: { type: String, enum: ["APPROVE","REQUEST_CHANGES","COMMENT", null], default: null },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reviewers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  workspace: { type: mongoose.Schema.Types.ObjectId, ref: "Workspace" },
  baseRef: String, headRef: String, githubPrUrl: String,
}, { timestamps: true });
module.exports = mongoose.model("Review", reviewSchema);
