const mongoose = require("mongoose");

const AIContentSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["image", "text", "carousel", "video", "poll"],
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  generatedContent: {
    type: mongoose.Schema.Types.Mixed, // Can store different types of content
    required: true,
  },
  metadata: {
    style: String,
    aspectRatio: String,
    writingStyle: String,
    postCategory: String,
    useViralTemplate: Boolean,
    length: Number,
  },
  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
AIContentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("AIContent", AIContentSchema);
