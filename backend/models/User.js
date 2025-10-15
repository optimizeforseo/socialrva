const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    password: {
      type: String,
      required: function () {
        return !this.linkedinId; // Password required if not LinkedIn user
      },
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't include password in queries by default
    },
    profilePicture: {
      type: String,
      default: null,
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
      startDate: {
        type: Date,
        default: Date.now,
      },
      expiresAt: {
        type: Date,
        default: function () {
          // Free tier expires in 30 days
          return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        },
      },
      creditsUsed: {
        type: Number,
        default: 0,
        min: 0,
      },
      creditsLimit: {
        type: Number,
        default: 10, // Free tier limit
      },
    },
    preferences: {
      defaultWritingStyle: {
        type: String,
        enum: ["socialsonic", "professional", "casual", "thought-leader"],
        default: "socialsonic",
      },
      defaultPostCategory: {
        type: String,
        enum: [
          "thought-leadership",
          "industry-news",
          "personal-story",
          "tips-advice",
          "company-update",
        ],
        default: "thought-leadership",
      },
      notifications: {
        email: {
          type: Boolean,
          default: true,
        },
        marketing: {
          type: Boolean,
          default: false,
        },
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationToken: String,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLoginAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for credits remaining
userSchema.virtual("creditsRemaining").get(function () {
  return Math.max(
    0,
    this.subscription.creditsLimit - this.subscription.creditsUsed
  );
});

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to check if user has credits
userSchema.methods.hasCredits = function () {
  return this.subscription.creditsUsed < this.subscription.creditsLimit;
};

// Method to use credits
userSchema.methods.useCredits = async function (amount = 1) {
  if (!this.hasCredits()) {
    throw new Error("Insufficient credits");
  }

  this.subscription.creditsUsed += amount;
  return await this.save();
};

// Method to reset credits (for subscription renewal)
userSchema.methods.resetCredits = async function () {
  this.subscription.creditsUsed = 0;
  this.subscription.startDate = new Date();

  // Set expiry based on subscription type
  const expiryDays = {
    free: 30,
    premium: 30,
    enterprise: 365,
  };

  this.subscription.expiresAt = new Date(
    Date.now() + expiryDays[this.subscription.type] * 24 * 60 * 60 * 1000
  );

  return await this.save();
};

// Index for better query performance
userSchema.index({ email: 1 });
userSchema.index({ linkedinId: 1 });
userSchema.index({ "subscription.type": 1 });

module.exports = mongoose.model("User", userSchema);
