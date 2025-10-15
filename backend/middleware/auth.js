const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Protect routes - require authentication
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Check for token in cookies (if using cookie-based auth)
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: "Access denied. No token provided.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          success: false,
          error: "Token is valid but user not found.",
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: false,
          error: "User account is deactivated.",
        });
      }

      // Add user to request object
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: "Invalid token.",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error in authentication.",
    });
  }
};

/**
 * Optional authentication - don't require token but add user if present
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select("-password");

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Invalid token, but continue without user
        console.log("Invalid token in optional auth:", error.message);
      }
    }

    next();
  } catch (error) {
    console.error("Optional auth middleware error:", error);
    next(); // Continue even if there's an error
  }
};

/**
 * Check if user has sufficient credits
 */
const checkCredits = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required to check credits.",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found.",
      });
    }

    // Check if user has credits available
    if (!user.hasCredits()) {
      return res.status(403).json({
        success: false,
        error: "Insufficient credits. Please upgrade your plan.",
        credits: {
          used: user.subscription.creditsUsed,
          limit: user.subscription.creditsLimit,
          remaining: user.creditsRemaining,
        },
      });
    }

    // Update user object in request
    req.user = user;
    next();
  } catch (error) {
    console.error("Credits check error:", error);
    return res.status(500).json({
      success: false,
      error: "Server error while checking credits.",
    });
  }
};

/**
 * Authorize specific roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Authentication required.",
      });
    }

    if (!roles.includes(req.user.subscription.type)) {
      return res.status(403).json({
        success: false,
        error: `Access denied. Required subscription: ${roles.join(" or ")}`,
      });
    }

    next();
  };
};

/**
 * Rate limiting for AI operations
 */
const aiRateLimit = (maxRequests = 10, windowMs = 60000) => {
  const requests = new Map();

  return (req, res, next) => {
    if (!req.user) {
      return next();
    }

    const userId = req.user._id.toString();
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old requests
    if (requests.has(userId)) {
      const userRequests = requests
        .get(userId)
        .filter((time) => time > windowStart);
      requests.set(userId, userRequests);
    }

    const userRequests = requests.get(userId) || [];

    if (userRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        error: "Too many AI requests. Please wait before trying again.",
        retryAfter: Math.ceil((userRequests[0] + windowMs - now) / 1000),
      });
    }

    // Add current request
    userRequests.push(now);
    requests.set(userId, userRequests);

    next();
  };
};

module.exports = {
  protect,
  optionalAuth,
  checkCredits,
  authorize,
  aiRateLimit,
};
