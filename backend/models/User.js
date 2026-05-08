const mongoose = require("mongoose");

// main user profile data
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  skillsOffered: [String],
  // starting wallet balance
  credits: { type: Number, default: 5 } 
});

module.exports = mongoose.model("User", UserSchema);