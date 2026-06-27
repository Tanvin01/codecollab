const mongoose = require("mongoose");
const workspaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  members: [{ user: { type: mongoose.Schema.Types.ObjectId, ref:"User" }, role: { type: String, enum:["OWNER","ADMIN","REVIEWER","VIEWER"], default:"REVIEWER" } }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref:"User" },
}, { timestamps: true });
module.exports = mongoose.model("Workspace", workspaceSchema);
