const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  body: { type: String, required: true },
  lineNumber: { type: Number, required: true },
  filePath: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  review: { type: mongoose.Schema.Types.ObjectId, ref: "Review", required: true },
  replyTo: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
  resolved: { type: Boolean, default: false },
  resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  resolvedAt: Date,
}, { timestamps: true });
commentSchema.index({ review: 1, lineNumber: 1 });
module.exports = mongoose.model("Comment", commentSchema);
