const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  res.status(404).json({
    success: false,
    error: error.message,
    availableRoutes: [
      "GET /health",
      "POST /api/auth/register",
      "POST /api/auth/login",
      "POST /api/ai/generate-image",
      "POST /api/ai/generate-text",
      "GET /api/ai/content/:userId",
      "GET /api/ai/stats/:userId",
    ],
  });
};

module.exports = notFound;
