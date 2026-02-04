const mongoose = require("mongoose");

const aiContentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true,
    },
    type: {
      type: String,
      enum: ["image", "text", "carousel", "video", "poll"],
      required: [true, "Content type is required"],
      index: true,
    },
    prompt: {
      type: String,
      required: [true, "Prompt is required"],
      trim: true,
      maxlength: [2000, "Prompt cannot exceed 2000 characters"],
    },
    generatedContent: {
      // For text content
      content: String,

      // For image content
      imageUrl: String,
      revisedPrompt: String,

      // For carousel content
      slides: [
        {
          title: String,
          content: String,
          imageUrl: String,
        },
      ],

      // For video content
      videoUrl: String,
      thumbnailUrl: String,
      duration: Number,

      // For poll content
      question: String,
      options: [String],

      // Common metadata
      tokensUsed: Number,
      processingTime: Number,
    },
    metadata: {
      // Text generation metadata
      writingStyle: {
        type: String,
        enum: ["socialsonic", "professional", "casual", "thought-leader"],
      },
      postCategory: {
        type: String,
        enum: [
          "thought-leadership",
          "industry-news",
          "personal-story",
          "tips-advice",
          "company-update",
        ],
      },
      useViralTemplate: {
        type: Boolean,
        default: false,
      },
      length: {
        type: String,
        enum: ["short", "medium", "long"],
      },

      // Image generation metadata
      style: {
        type: String,
        enum: ["realistic", "animation", "artistic", "minimalist"],
      },
      aspectRatio: {
        type: String,
        enum: ["square", "landscape", "portrait"],
      },
      quality: {
        type: String,
        enum: ["standard", "hd"],
        default: "standard",
      },

      // AI model information
      model: String,
      version: String,

      // Performance metrics
      generationTime: Number,
      creditsUsed: {
        type: Number,
        default: 1,
      },
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
      index: true,
    },
    error: {
      message: String,
      code: String,
      details: mongoose.Schema.Types.Mixed,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    downloads: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for content preview
aiContentSchema.virtual("preview").get(function () {
  switch (this.type) {
    case "text":
      return this.generatedContent.content?.substring(0, 100) + "...";
    case "image":
      return this.generatedContent.imageUrl;
    case "carousel":
      return `${this.generatedContent.slides?.length || 0} slides`;
    case "video":
      return this.generatedContent.videoUrl;
    case "poll":
      return this.generatedContent.question;
    default:
      return this.prompt.substring(0, 50) + "...";
  }
});

// Virtual for success status
aiContentSchema.virtual("isSuccess").get(function () {
  return this.status === "completed";
});

// Pre-save middleware to update status
aiContentSchema.pre("save", function (next) {
  if (this.isModified("generatedContent") && this.generatedContent) {
    this.status = "completed";
  }
  next();
});

// Method to increment views
aiContentSchema.methods.incrementViews = async function () {
  this.views += 1;
  return await this.save();
};

// Method to increment likes
aiContentSchema.methods.incrementLikes = async function () {
  this.likes += 1;
  return await this.save();
};

// Method to increment downloads
aiContentSchema.methods.incrementDownloads = async function () {
  this.downloads += 1;
  return await this.save();
};

// Static method to get user stats
aiContentSchema.statics.getUserStats = async function (userId) {
  const stats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$type",
        count: { $sum: 1 },
        totalCreditsUsed: { $sum: "$metadata.creditsUsed" },
        lastCreated: { $max: "$createdAt" },
        avgGenerationTime: { $avg: "$metadata.generationTime" },
      },
    },
  ]);

  const totalStats = await this.aggregate([
    { $match: { userId: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalContent: { $sum: 1 },
        totalCreditsUsed: { $sum: "$metadata.creditsUsed" },
        totalViews: { $sum: "$views" },
        totalLikes: { $sum: "$likes" },
        totalDownloads: { $sum: "$downloads" },
      },
    },
  ]);

  return {
    byType: stats,
    total: totalStats[0] || {
      totalContent: 0,
      totalCreditsUsed: 0,
      totalViews: 0,
      totalLikes: 0,
      totalDownloads: 0,
    },
  };
};

// Indexes for better query performance
aiContentSchema.index({ userId: 1, type: 1 });
aiContentSchema.index({ userId: 1, createdAt: -1 });
aiContentSchema.index({ status: 1 });
aiContentSchema.index({ tags: 1 });
aiContentSchema.index({ isPublic: 1, likes: -1 });

module.exports = mongoose.model("AIContent", aiContentSchema);
