const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    avatar: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
