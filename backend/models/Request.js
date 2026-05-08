const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skillName: { type: String, required: true },
  status: { type: String, default: "pending" } 
}, { timestamps: true });

module.exports = mongoose.model("Request", RequestSchema);