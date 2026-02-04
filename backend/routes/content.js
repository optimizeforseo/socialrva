const express = require("express");
const router = express.Router();

const AIContent = require("../models/AIContent");
const { protect, optionalAuth } = require("../middleware/auth");

/**
 * @route   GET /api/content/public
 * @desc    Get public AI content (showcase)
 * @access  Public
 */
router.get("/public", optionalAuth, async (req, res) => {
  try {
    const { type, page = 1, limit = 12 } = req.query;

    const query = {
      isPublic: true,
      status: "completed",
    };

    if (type) query.type = type;

    const content = await AIContent.find(query)
      .sort({ likes: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate("userId", "firstName lastName profilePicture")
      .select("-generatedContent.content"); // Don't include full content for privacy

    const total = await AIContent.countDocuments(query);

    res.json({
      success: true,
      data: content,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get Public Content Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch public content",
    });
  }
});

/**
 * @route   PUT /api/content/:id/visibility
 * @desc    Toggle content visibility (public/private)
 * @access  Private
 */
router.put("/:id/visibility", protect, async (req, res) => {
  try {
    const { isPublic } = req.body;

    const content = await AIContent.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!content) {
      return res.status(404).json({
        success: false,
        error: "Content not found",
      });
    }

    content.isPublic = isPublic;
    await content.save();

    res.json({
      success: true,
      data: {
        id: content._id,
        isPublic: content.isPublic,
      },
    });
  } catch (error) {
    console.error("Update Visibility Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update content visibility",
    });
  }
});

/**
 * @route   POST /api/content/:id/download
 * @desc    Track content download
 * @access  Public
 */
router.post("/:id/download", optionalAuth, async (req, res) => {
  try {
    const content = await AIContent.findById(req.params.id);

    if (!content) {
      return res.status(404).json({
        success: false,
        error: "Content not found",
      });
    }

    await content.incrementDownloads();

    res.json({
      success: true,
      data: {
        downloads: content.downloads,
      },
    });
  } catch (error) {
    console.error("Track Download Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to track download",
    });
  }
});

module.exports = router;
