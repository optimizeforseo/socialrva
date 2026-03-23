const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const authRoutes = require("../routes/auth");
const aiRoutes = require("../routes/ai");
const userRoutes = require("../routes/users");
const contentRoutes = require("../routes/content");
const analyticsRoutes = require("../routes/analytics");
const researchRoutes = require("../routes/research");
const onboardingRoutes = require("../routes/onboarding");
const errorHandler = require("../middleware/errorHandler");
const notFound = require("../middleware/notFound");

const app = express();

// MongoDB - cache connection across serverless invocations
let isConnected = false;
const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
};

app.use(helmet());

app.use(cors({
  origin: process.env.FRONTEND_URL || "*",
  credentials: true,
}));

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Connect DB before each request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

app.get("/health", (req, res) => res.json({ status: "OK" }));

app.use("/api/auth", authRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/users", userRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/research", researchRoutes);
app.use("/api/onboarding", onboardingRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
