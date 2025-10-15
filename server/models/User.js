const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
  },
  linkedinId: {
    type: String,
    unique: true,
    sparse: true,
  },
  subscription: {
    type: {
      type: String,
      enum: ["free", "premium", "enterprise"],
      default: "free",
    },
    expiresAt: Date,
    creditsUsed: {
      type: Number,
      default: 0,
    },
    creditsLimit: {
      type: Number,
      default: 10, // Free tier limit
    },
  },
  preferences: {
    defaultWritingStyle: {
      type: String,
      default: "Socialsonic",
    },
    defaultPostCategory: {
      type: String,
      default: "Thought Leadership",
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLoginAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
