const mongoose = require("mongoose");

// user skill swap requests
const RequestSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  skillName: { type: String, required: true },
  status: { type: String, default: "pending" } 
}, { 
  // track request timing
  timestamps: true 
});

module.exports = mongoose.model("Request", RequestSchema);