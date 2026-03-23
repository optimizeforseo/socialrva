const express = require("express");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const router = express.Router();

const User = require("../models/User");
const { protect } = require("../middleware/auth");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

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
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  "/register",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("firstName")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be between 2 and 50 characters"),
    body("lastName")
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be between 2 and 50 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    validateRequest,
  ],
  async (req, res) => {
    try {
      const { email, firstName, lastName, password } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          error: "User already exists with this email",
        });
      }

      // Create user
      const user = await User.create({
        email,
        firstName,
        lastName,
        password,
        isVerified: true, // Auto-verify for now
      });

      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            subscription: user.subscription,
            preferences: user.preferences,
            creditsRemaining: user.creditsRemaining,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Register Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to register user",
      });
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  "/login",
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("password").notEmpty().withMessage("Password is required"),
    validateRequest,
  ],
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user and include password for comparison
      const user = await User.findOne({ email }).select("+password");

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Check if account is active
      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: "Account is deactivated",
        });
      }

      // Check password
      const isPasswordValid = await user.comparePassword(password);

      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // Update last login
      user.lastLoginAt = new Date();
      await user.save();

      // Generate token
      const token = generateToken(user._id);

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            subscription: user.subscription,
            preferences: user.preferences,
            creditsRemaining: user.creditsRemaining,
            lastLoginAt: user.lastLoginAt,
          },
          token,
        },
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to login",
      });
    }
  }
);

/**
 * @route   POST /api/auth/linkedin/callback
 * @desc    Handle LinkedIn OAuth callback with smart routing
 * @access  Public
 */
router.post("/linkedin/callback", async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        error: "Authorization code is required",
      });
    }

    // For development mock mode only (USE_MOCK_AUTH=true in .env)
    if (process.env.USE_MOCK_AUTH === 'true') {
      // Fixed mock data - same user har baar
      const mockUserData = {
        sub: 'linkedin_dev_user_001',
        email: 'demo@socialrva.com',
        given_name: 'Dev',
        family_name: 'User',
        picture: null
      };

      // Check if user exists by linkedinId first, then email
      let user = await User.findOne({ linkedinId: mockUserData.sub });
      let isNewUser = false;

      if (!user) {
        user = await User.findOne({ email: mockUserData.email });
        if (user) {
          // Link LinkedIn ID to existing user
          user.linkedinId = mockUserData.sub;
          user.lastLoginAt = new Date();
          await user.save();
        } else {
          // Brand new user - onboarding bypass
          isNewUser = true;
          user = await User.create({
            email: mockUserData.email,
            firstName: mockUserData.given_name,
            lastName: mockUserData.family_name,
            linkedinId: mockUserData.sub,
            profilePicture: mockUserData.picture,
            isVerified: true,
            profile: {
              isOnboardingComplete: true // Bypass onboarding
            }
          });
        }
      } else {
        // Existing user - update name/picture too in case mock data changed
        user.firstName = mockUserData.given_name;
        user.lastName = mockUserData.family_name;
        user.profilePicture = mockUserData.picture;
        user.lastLoginAt = new Date();
        await user.save();
      }

      const token = generateToken(user._id);
      const isOnboardingComplete = user.profile?.isOnboardingComplete || false;

      return res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            linkedinId: user.linkedinId,
            accessToken: 'dev_mock_token_not_real', // Dev placeholder
            subscription: user.subscription,
            preferences: user.preferences,
            profile: user.profile,
            profileAnalysis: user.profileAnalysis,
            creditsRemaining: user.creditsRemaining,
            lastLoginAt: user.lastLoginAt,
            onboardingCompletedAt: user.onboardingCompletedAt,
            isNewUser
          },
          token,
          routing: {
            shouldOnboard: !isOnboardingComplete,
            isNewUser,
            redirectTo: isOnboardingComplete ? '/dashboard' : '/onboarding'
          }
        },
      });
    }

    // Production LinkedIn OAuth implementation
    const clientId = process.env.LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.LINKEDIN_CLIENT_SECRET;
    const redirectUri = process.env.LINKEDIN_REDIRECT_URI;

    if (!clientId || !clientSecret) {
      return res.status(500).json({
        success: false,
        error: "LinkedIn OAuth not configured properly",
      });
    }

    // Exchange code for access token
    const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('LinkedIn token exchange error:', errorData);
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user profile from LinkedIn
    const profileResponse = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!profileResponse.ok) {
      const errorData = await profileResponse.text();
      console.error('LinkedIn profile fetch error:', errorData);
      throw new Error('Failed to get user profile from LinkedIn');
    }

    const profileData = await profileResponse.json();

    // Check if user exists
    let user = await User.findOne({ linkedinId: profileData.sub });
    let isNewUser = false;

    if (!user) {
      // Check if user exists with email
      user = await User.findOne({ email: profileData.email });

      if (user) {
        // Link LinkedIn account to existing user
        user.linkedinId = profileData.sub;
        if (profileData.picture) user.profilePicture = profileData.picture;
        await user.save();
      } else {
        // Create new user - onboarding bypass
        isNewUser = true;
        user = await User.create({
          email: profileData.email,
          firstName: profileData.given_name,
          lastName: profileData.family_name,
          linkedinId: profileData.sub,
          profilePicture: profileData.picture,
          isVerified: true,
          profile: {
            isOnboardingComplete: true // Bypass onboarding
          }
        });
      }
    } else {
      // Update existing LinkedIn user info
      user.email = profileData.email;
      user.firstName = profileData.given_name;
      user.lastName = profileData.family_name;
      if (profileData.picture) user.profilePicture = profileData.picture;
      user.lastLoginAt = new Date();
      await user.save();
    }

    // Generate token
    const token = generateToken(user._id);
    const isOnboardingComplete = user.profile?.isOnboardingComplete || false;

    // Return user data with onboarding status for smart routing
    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
          linkedinId: user.linkedinId,
          accessToken, // LinkedIn access token for publishing
          subscription: user.subscription,
          preferences: user.preferences,
          profile: user.profile,
          profileAnalysis: user.profileAnalysis,
          creditsRemaining: user.creditsRemaining,
          lastLoginAt: user.lastLoginAt,
          onboardingCompletedAt: user.onboardingCompletedAt,
          isNewUser
        },
        token,
        routing: {
          shouldOnboard: !isOnboardingComplete,
          isNewUser,
          redirectTo: isOnboardingComplete ? '/dashboard' : '/onboarding'
        }
      },
    });
  } catch (error) {
    console.error("LinkedIn Callback Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to authenticate with LinkedIn",
    });
  }
});

/**
 * @route   POST /api/auth/linkedin
 * @desc    LinkedIn OAuth login/register
 * @access  Public
 */
router.post(
  "/linkedin",
  [
    body("linkedinId").notEmpty().withMessage("LinkedIn ID is required"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Please provide a valid email"),
    body("firstName").trim().notEmpty().withMessage("First name is required"),
    body("lastName").trim().notEmpty().withMessage("Last name is required"),
    validateRequest,
  ],
  async (req, res) => {
    try {
      const { linkedinId, email, firstName, lastName, profilePicture } =
        req.body;

      // Check if user exists with LinkedIn ID
      let user = await User.findOne({ linkedinId });

      if (!user) {
        // Check if user exists with email
        user = await User.findOne({ email });

        if (user) {
          // Link LinkedIn account to existing user
          user.linkedinId = linkedinId;
          if (profilePicture) user.profilePicture = profilePicture;
          await user.save();
        } else {
          // Create new user
          user = await User.create({
            email,
            firstName,
            lastName,
            linkedinId,
            profilePicture,
            isVerified: true,
          });
        }
      } else {
        // Update existing LinkedIn user info
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        if (profilePicture) user.profilePicture = profilePicture;
        user.lastLoginAt = new Date();
        await user.save();
      }

      // Generate token
      const token = generateToken(user._id);

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            linkedinId: user.linkedinId,
            subscription: user.subscription,
            preferences: user.preferences,
            creditsRemaining: user.creditsRemaining,
            lastLoginAt: user.lastLoginAt,
          },
          token,
        },
      });
    } catch (error) {
      console.error("LinkedIn Auth Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to authenticate with LinkedIn",
      });
    }
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          fullName: user.fullName,
          profilePicture: user.profilePicture,
          linkedinId: user.linkedinId,
          subscription: user.subscription,
          preferences: user.preferences,
          profile: user.profile,
          profileAnalysis: user.profileAnalysis,
          creditsRemaining: user.creditsRemaining,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
          lastLoginAt: user.lastLoginAt,
          onboardingCompletedAt: user.onboardingCompletedAt,
        },
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to get user profile",
    });
  }
});

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  "/profile",
  [
    protect,
    body("firstName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("First name must be between 2 and 50 characters"),
    body("lastName")
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage("Last name must be between 2 and 50 characters"),
    body("preferences.defaultWritingStyle")
      .optional()
      .isIn(["socialsonic", "professional", "casual", "thought-leader"])
      .withMessage("Invalid writing style"),
    body("preferences.defaultPostCategory")
      .optional()
      .isIn([
        "thought-leadership",
        "industry-news",
        "personal-story",
        "tips-advice",
        "company-update",
      ])
      .withMessage("Invalid post category"),
    validateRequest,
  ],
  async (req, res) => {
    try {
      const updates = {};
      const { firstName, lastName, profilePicture, preferences } = req.body;

      if (firstName) updates.firstName = firstName;
      if (lastName) updates.lastName = lastName;
      if (profilePicture) updates.profilePicture = profilePicture;
      if (preferences)
        updates.preferences = { ...req.user.preferences, ...preferences };

      const user = await User.findByIdAndUpdate(req.user._id, updates, {
        new: true,
        runValidators: true,
      });

      res.json({
        success: true,
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName,
            profilePicture: user.profilePicture,
            preferences: user.preferences,
            creditsRemaining: user.creditsRemaining,
          },
        },
      });
    } catch (error) {
      console.error("Update Profile Error:", error);
      res.status(500).json({
        success: false,
        error: "Failed to update profile",
      });
    }
  }
);

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user (client-side token removal)
 * @access  Private
 */
router.post("/logout", protect, (req, res) => {
  res.json({
    success: true,
    message: "Logged out successfully",
  });
});

module.exports = router;
