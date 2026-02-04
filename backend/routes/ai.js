const express = require("express");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const openaiService = require("../services/openaiService");
const AIContent = require("../models/AIContent");
const User = require("../models/User");
const { protect, checkCredits, aiRateLimit } = require("../middleware/auth");

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

/**
 * @route   POST /api/ai/generate-image
 * @desc    Generate AI image using DALL-E
 * @access  Private
 */
router.post(
  "/generate-image",
  [
    protect,
    checkCredits,
    aiRateLimit(5, 60000), // 5 requests per minute
    body("prompt")
      .isLength({ min: 10, max: 2000 })
      .withMessage("Prompt must be between 10 and 2000 characters"),
    body("style")
      .optional()
      .isIn(["realistic", "animation", "artistic", "minimalist"])
      .withMessage("Invalid style"),
    body("aspectRatio")
      .optional()
      .isIn(["square", "landscape", "portrait"])
      .withMessage("Invalid aspect ratio"),
    validateRequest,
  ],
  async (req, res) => {
    try {
      const {
        prompt,
        style = "realistic",
        aspectRatio = "square",
        quality = "standard",
      } = req.body;

      // Generate image using OpenAI
      const result = await openaiService.generateImage(prompt, {
        style,
        aspectRatio,
        quality,
      });

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error.message,
          code: result.error.code,
        });
      }

      // Create AI content record
      const aiContent = new AIContent({
        userId: req.user._id,
        type: "image",
        prompt,
        generatedContent: {
          imageUrl: result.data.imageUrl,
          revisedPrompt: result.data.revisedPrompt,
        },
        metadata: {
          style,
          aspectRatio,
          quality,
          model: result.data.metadata.model,
          generationTime: result.data.metadata.generationTime,
          creditsUsed: result.data.metadata.creditsUsed,
        },
        status: "completed",
      });

      await aiContent.save();

      // Update user credits
      await req.user.useCredits(result.data.metadata.creditsUsed);

      res.json({
        success: true,
        data: {
          id: aiContent._id,
          imageUrl: result.data.imageUrl,
          revisedPrompt: result.data.revisedPrompt,
          metadata: result.data.metadata,
          creditsUsed: result.data.metadata.creditsUsed,
          creditsRemaining:
            req.user.creditsRemaining - result.data.metadata.creditsUsed,
        },
      });
    } catch (error) {
      console.error("Generate Image Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate image",
      });
    }
  }
);

/**
 * @route   POST /api/ai/generate-text
 * @desc    Generate AI text using GPT
 * @access  Private
 */
router.post(
  "/generate-text",
  [
    protect,
    checkCredits,
    aiRateLimit(10, 60000), // 10 requests per minute
    body("prompt")
      .isLength({ min: 5, max: 2000 })
      .withMessage("Prompt must be between 5 and 2000 characters"),
    body("writingStyle")
      .optional()
      .isIn(["socialsonic", "professional", "casual", "thought-leader"])
      .withMessage("Invalid writing style"),
    body("postCategory")
      .optional()
      .isIn([
        "thought-leadership",
        "industry-news",
        "personal-story",
        "tips-advice",
        "company-update",
      ])
      .withMessage("Invalid post category"),
    body("length")
      .optional()
      .isIn(["short", "medium", "long"])
      .withMessage("Invalid length"),
    validateRequest,
  ],
  async (req, res) => {
    try {
      const {
        prompt,
        writingStyle = "professional",
        postCategory = "thought-leadership",
        useViralTemplate = false,
        length = "medium",
        platform = "linkedin",
      } = req.body;

      // Generate text using OpenAI
      const result = await openaiService.generateText(prompt, {
        writingStyle,
        postCategory,
        useViralTemplate,
        length,
        platform,
      });

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error.message,
          code: result.error.code,
        });
      }

      // Create AI content record
      const aiContent = new AIContent({
        userId: req.user._id,
        type: "text",
        prompt,
        generatedContent: {
          content: result.data.content,
          tokensUsed: result.data.metadata.tokensUsed,
        },
        metadata: {
          writingStyle,
          postCategory,
          useViralTemplate,
          length,
          platform,
          model: result.data.metadata.model,
          generationTime: result.data.metadata.generationTime,
          creditsUsed: result.data.metadata.creditsUsed,
        },
        status: "completed",
      });

      await aiContent.save();

      // Update user credits
      await req.user.useCredits(result.data.metadata.creditsUsed);

      res.json({
        success: true,
        data: {
          id: aiContent._id,
          content: result.data.content,
          metadata: result.data.metadata,
          creditsUsed: result.data.metadata.creditsUsed,
          creditsRemaining:
            req.user.creditsRemaining - result.data.metadata.creditsUsed,
        },
      });
    } catch (error) {
      console.error("Generate Text Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate text",
      });
    }
  }
);

/**
 * @route   POST /api/ai/suggestions
 * @desc    Get AI content suggestions
 * @access  Private
 */
router.post(
  "/suggestions",
  [
    protect,
    body("type")
      .isIn(["image", "text", "carousel"])
      .withMessage("Invalid suggestion type"),
    body("context")
      .optional()
      .isLength({ max: 500 })
      .withMessage("Context must be less than 500 characters"),
    validateRequest,
  ],
  async (req, res) => {
    try {
      const { type, context = "", count = 5 } = req.body;

      const result = await openaiService.generateSuggestions(
        type,
        context,
        count
      );

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error.message,
        });
      }

      res.json({
        success: true,
        suggestions: result.suggestions,
        type,
        context,
      });
    } catch (error) {
      console.error("Get Suggestions Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to get suggestions",
      });
    }
  }
);

/**
 * @route   GET /api/ai/content
 * @desc    Get user's AI content history
 * @access  Private
 */
router.get("/content", protect, async (req, res) => {
  try {
    const { type, page = 1, limit = 10, status = "completed" } = req.query;

    const query = { userId: req.user._id };
    if (type) query.type = type;
    if (status) query.status = status;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { createdAt: -1 },
      populate: {
        path: "userId",
        select: "firstName lastName email",
      },
    };

    const content = await AIContent.find(query)
      .sort(options.sort)
      .limit(options.limit)
      .skip((options.page - 1) * options.limit)
      .populate(options.populate);

    const total = await AIContent.countDocuments(query);

    res.json({
      success: true,
      data: content,
      pagination: {
        page: options.page,
        limit: options.limit,
        total,
        pages: Math.ceil(total / options.limit),
      },
    });
  } catch (error) {
    console.error("Get Content Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch content",
    });
  }
});

/**
 * @route   GET /api/ai/content/:id
 * @desc    Get specific AI content by ID
 * @access  Private
 */
router.get("/content/:id", protect, async (req, res) => {
  try {
    const content = await AIContent.findOne({
      _id: req.params.id,
      userId: req.user._id,
    }).populate("userId", "firstName lastName email");

    if (!content) {
      return res.status(404).json({
        success: false,
        error: "Content not found",
      });
    }

    // Increment views
    await content.incrementViews();

    res.json({
      success: true,
      data: content,
    });
  } catch (error) {
    console.error("Get Content Item Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch content item",
    });
  }
});

/**
 * @route   DELETE /api/ai/content/:id
 * @desc    Delete AI content
 * @access  Private
 */
router.delete("/content/:id", protect, async (req, res) => {
  try {
    const content = await AIContent.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: "Content not found",
      });
    }

    res.json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("Delete Content Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete content",
    });
  }
});

/**
 * @route   GET /api/ai/stats
 * @desc    Get user AI usage statistics
 * @access  Private
 */
router.get("/stats", protect, async (req, res) => {
  try {
    const stats = await AIContent.getUserStats(req.user._id);

    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        contentStats: stats.byType,
        totalStats: stats.total,
        credits: {
          used: user.subscription.creditsUsed,
          limit: user.subscription.creditsLimit,
          remaining: user.creditsRemaining,
        },
        subscription: {
          type: user.subscription.type,
          expiresAt: user.subscription.expiresAt,
        },
      },
    });
  } catch (error) {
    console.error("Get Stats Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch stats",
    });
  }
});

/**
 * @route   POST /api/ai/content/:id/like
 * @desc    Like AI content
 * @access  Private
 */
router.post("/content/:id/like", protect, async (req, res) => {
  try {
    const content = await AIContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: "Content not found",
      });
    }

    await content.incrementLikes();

    res.json({
      success: true,
      data: {
        likes: content.likes,
      },
    });
  } catch (error) {
    console.error("Like Content Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to like content",
    });
  }
});

/**
 * @route   GET /api/ai/health
 * @desc    Check OpenAI service health
 * @access  Public
 */
router.get("/health", async (req, res) => {
  try {
    const health = await openaiService.checkHealth();

    res.json({
      success: true,
      openai: health,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health Check Error:", error);
    res.status(500).json({
      success: false,
      error: "Health check failed",
    });
  }
});

/**
 * @route   POST /api/ai/test-generate-text
 * @desc    Test AI text generation without authentication
 * @access  Public
 */
router.post(
  "/test-generate-text",
  [
    body("prompt")
      .isLength({ min: 1, max: 2000 })
      .withMessage("Prompt must be between 1 and 2000 characters"),
    validateRequest,
  ],
  async (req, res) => {
    try {
      const {
        prompt,
        writingStyle = "professional",
        postCategory = "thought-leadership",
        useViralTemplate = false,
        length = "medium",
      } = req.body;

      // Generate text using OpenAI (without user authentication)
      const result = await openaiService.generateText(prompt, {
        writingStyle,
        postCategory,
        useViralTemplate,
        length,
        platform: "linkedin",
      });

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error.message,
          code: result.error.code,
        });
      }

      res.json({
        success: true,
        data: {
          content: result.data.content,
          metadata: result.data.metadata,
        },
      });
    } catch (error) {
      console.error("Test Generate Text Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate text",
      });
    }
  }
);

/**
 * @route   POST /api/ai/test-generate-image
 * @desc    Test AI image generation without authentication
 * @access  Public
 */
router.post(
  "/test-generate-image",
  [
    body("prompt")
      .isLength({ min: 1, max: 2000 })
      .withMessage("Prompt must be between 1 and 2000 characters"),
    validateRequest,
  ],
  async (req, res) => {
    try {
      const { prompt, style = "realistic", aspectRatio = "square" } = req.body;

      // Generate image using OpenAI (without user authentication)
      const result = await openaiService.generateImage(prompt, {
        style,
        aspectRatio,
        quality: "standard",
      });

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error.message,
          code: result.error.code,
        });
      }

      res.json({
        success: true,
        data: {
          imageUrl: result.data.imageUrl,
          revisedPrompt: result.data.revisedPrompt,
          metadata: result.data.metadata,
        },
      });
    } catch (error) {
      console.error("Test Generate Image Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate image",
      });
    }
  }
);

/**
 * @route   POST /api/ai/generate-content
 * @desc    Generate content for Write Your Own feature
 * @access  Private
 */
router.post(
  "/generate-content",
  [
    protect,
    checkCredits,
    aiRateLimit(10, 60000), // 10 requests per minute
    body("prompt")
      .isLength({ min: 5, max: 3000 })
      .withMessage("Prompt must be between 5 and 3000 characters"),
    body("contentType")
      .optional()
      .isIn(["blog", "article", "social", "email", "product", "story"])
      .withMessage("Invalid content type"),
    body("tone")
      .optional()
      .isIn([
        "professional",
        "casual",
        "friendly",
        "formal",
        "humorous",
        "persuasive",
      ])
      .withMessage("Invalid tone"),
    body("length")
      .optional()
      .isIn(["short", "medium", "long", "very-long"])
      .withMessage("Invalid length"),
    validateRequest,
  ],
  async (req, res) => {
    try {
      const {
        prompt,
        contentType = "blog",
        tone = "professional",
        length = "medium",
        targetAudience = "",
        keywords = "",
      } = req.body;

      // Generate content using OpenAI
      const result = await openaiService.generateContent(prompt, {
        contentType,
        tone,
        length,
        targetAudience,
        keywords,
      });

      if (!result.success) {
        return res.status(500).json({
          success: false,
          error: result.error.message,
          code: result.error.code,
        });
      }

      // Create AI content record
      const aiContent = new AIContent({
        userId: req.user._id,
        type: "content",
        prompt,
        generatedContent: {
          content: result.data.content,
          tokensUsed: result.data.metadata.tokensUsed,
        },
        metadata: {
          contentType,
          tone,
          length,
          targetAudience,
          keywords,
          model: result.data.metadata.model,
          generationTime: result.data.metadata.generationTime,
          creditsUsed: result.data.metadata.creditsUsed,
        },
        status: "completed",
      });

      await aiContent.save();

      // Update user credits
      await req.user.useCredits(result.data.metadata.creditsUsed);

      res.json({
        success: true,
        data: {
          id: aiContent._id,
          content: result.data.content,
          metadata: result.data.metadata,
          creditsUsed: result.data.metadata.creditsUsed,
          creditsRemaining:
            req.user.creditsRemaining - result.data.metadata.creditsUsed,
        },
      });
    } catch (error) {
      console.error("Generate Content Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to generate content",
      });
    }
  }
);

module.exports = router;
