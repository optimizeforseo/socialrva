const express = require("express");
const router = express.Router();
const openaiService = require("../services/openaiService");
const AIContent = require("../models/AIContent");
const User = require("../models/User");

// Test route
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "AI API is working!",
    timestamp: new Date().toISOString(),
  });
});

// Middleware to check user credits
const checkCredits = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.body.userId;

    // For development/testing, create a default user if none exists or if invalid ObjectId
    const mongoose = require("mongoose");
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      // Create or find a default test user
      let defaultUser = await User.findOne({ email: "test@example.com" });

      if (!defaultUser) {
        defaultUser = new User({
          email: "test@example.com",
          firstName: "Test",
          lastName: "User",
          subscription: {
            type: "free",
            creditsUsed: 0,
            creditsLimit: 50,
          },
        });
        await defaultUser.save();
        console.log("✅ Created default test user:", defaultUser._id);
      }

      req.user = defaultUser;
      req.body.userId = defaultUser._id.toString();
      return next();
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if user has credits available
    if (user.subscription.creditsUsed >= user.subscription.creditsLimit) {
      return res.status(403).json({
        error: "Credit limit exceeded",
        creditsUsed: user.subscription.creditsUsed,
        creditsLimit: user.subscription.creditsLimit,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Check credits error:", error);
    res
      .status(500)
      .json({ error: "Failed to check user credits: " + error.message });
  }
};

// Generate AI Image
router.post("/generate-image", checkCredits, async (req, res) => {
  try {
    const { prompt, style, aspectRatio, userId } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Generate image using OpenAI
    const result = await openaiService.generateImage(prompt, {
      style,
      aspectRatio,
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    // Save to database
    const aiContent = new AIContent({
      userId: userId || req.user._id,
      type: "image",
      prompt,
      generatedContent: result.data,
      metadata: {
        style,
        aspectRatio,
      },
      status: "completed",
    });

    await aiContent.save();

    // Update user credits
    await User.findByIdAndUpdate(userId || req.user._id, {
      $inc: { "subscription.creditsUsed": 1 },
    });

    res.json({
      success: true,
      data: {
        id: aiContent._id,
        imageUrl: result.data.imageUrl,
        revisedPrompt: result.data.revisedPrompt,
        metadata: result.data.metadata,
      },
    });
  } catch (error) {
    console.error("Generate Image Error:", error);
    res.status(500).json({ error: "Failed to generate image" });
  }
});

// Generate AI Text
router.post("/generate-text", checkCredits, async (req, res) => {
  try {
    const {
      prompt,
      writingStyle,
      postCategory,
      useViralTemplate,
      length,
      userId,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    // Generate text using OpenAI
    const result = await openaiService.generateText(prompt, {
      writingStyle,
      postCategory,
      useViralTemplate,
      length,
    });

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    // Save to database
    const aiContent = new AIContent({
      userId: userId || req.user._id,
      type: "text",
      prompt,
      generatedContent: result.data,
      metadata: {
        writingStyle,
        postCategory,
        useViralTemplate,
        length,
      },
      status: "completed",
    });

    await aiContent.save();

    // Update user credits
    await User.findByIdAndUpdate(userId || req.user._id, {
      $inc: { "subscription.creditsUsed": 1 },
    });

    res.json({
      success: true,
      data: {
        id: aiContent._id,
        content: result.data.content,
        metadata: result.data.metadata,
      },
    });
  } catch (error) {
    console.error("Generate Text Error:", error);
    res.status(500).json({ error: "Failed to generate text" });
  }
});

// Get user's AI content history
router.get("/content/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { type, page = 1, limit = 10 } = req.query;

    const query = { userId };
    if (type) {
      query.type = type;
    }

    const content = await AIContent.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const total = await AIContent.countDocuments(query);

    res.json({
      success: true,
      data: content,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get Content Error:", error);
    res.status(500).json({ error: "Failed to fetch content" });
  }
});

// Get specific AI content by ID
router.get("/content/item/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const content = await AIContent.findById(id);

    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Get Content Item Error:", error);
    res.status(500).json({ error: "Failed to fetch content item" });
  }
});

// Delete AI content
router.delete("/content/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const content = await AIContent.findByIdAndDelete(id);

    if (!content) {
      return res.status(404).json({ error: "Content not found" });
    }

    res.json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("Delete Content Error:", error);
    res.status(500).json({ error: "Failed to delete content" });
  }
});

// Get content suggestions
router.post("/suggestions", async (req, res) => {
  try {
    const { type, context } = req.body;

    const result = await openaiService.generateSuggestions(type, context);

    if (!result.success) {
      return res.status(500).json({ error: result.error });
    }

    res.json({
      success: true,
      suggestions: result.suggestions,
    });
  } catch (error) {
    console.error("Get Suggestions Error:", error);
    res.status(500).json({ error: "Failed to get suggestions" });
  }
});

// Get user stats
router.get("/stats/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    const stats = await AIContent.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          lastCreated: { $max: "$createdAt" },
        },
      },
    ]);

    const user = await User.findById(userId);

    res.json({
      success: true,
      data: {
        contentStats: stats,
        credits: {
          used: user.subscription.creditsUsed,
          limit: user.subscription.creditsLimit,
          remaining:
            user.subscription.creditsLimit - user.subscription.creditsUsed,
        },
      },
    });
  } catch (error) {
    console.error("Get Stats Error:", error);
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

module.exports = router;
