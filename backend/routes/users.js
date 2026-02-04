const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

/**
 * @route   GET /api/users/subscription
 * @desc    Get user subscription details
 * @access  Private
 */
router.get("/subscription", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        subscription: user.subscription,
        creditsRemaining: user.creditsRemaining,
        isExpired: user.subscription.expiresAt < new Date(),
      },
    });
  } catch (error) {
    console.error("Get Subscription Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get subscription details",
    });
  }
});

/**
 * @route   POST /api/users/upgrade
 * @desc    Upgrade user subscription
 * @access  Private
 */
router.post("/upgrade", protect, async (req, res) => {
  try {
    const { subscriptionType } = req.body;

    if (!["premium", "enterprise"].includes(subscriptionType)) {
      return res.status(400).json({
        success: false,
        error: "Invalid subscription type",
      });
    }

    const user = await User.findById(req.user._id);

    // Update subscription
    user.subscription.type = subscriptionType;
    user.subscription.creditsLimit =
      subscriptionType === "premium" ? 100 : 1000;
    user.subscription.startDate = new Date();
    user.subscription.expiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ); // 30 days

    await user.save();

    res.json({
      success: true,
      data: {
        subscription: user.subscription,
        creditsRemaining: user.creditsRemaining,
      },
    });
  } catch (error) {
    console.error("Upgrade Subscription Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to upgrade subscription",
    });
  }
});

/**
 * @route   POST /api/users/reset-credits
 * @desc    Reset user credits (admin only)
 * @access  Private (Admin)
 */
router.post(
  "/reset-credits/:userId",
  [
    protect,
    authorize("enterprise"), // Only enterprise users can reset credits for now
  ],
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);

      if (!user) {
        return res.status(404).json({
          success: false,
          error: "User not found",
        });
      }

      await user.resetCredits();

      res.json({
        success: true,
        data: {
          subscription: user.subscription,
          creditsRemaining: user.creditsRemaining,
        },
      });
    } catch (error) {
      console.error("Reset Credits Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to reset credits",
      });
    }
  }
);

module.exports = router;
