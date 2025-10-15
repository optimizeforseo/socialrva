// Simple script to start the backend server
const { spawn } = require("child_process");
const path = require("path");

console.log("🚀 Starting SocialSonic Backend Server...");

// Start the backend server
const backend = spawn("node", ["server/index.js"], {
  stdio: "inherit",
  cwd: process.cwd(),
});

backend.on("error", (error) => {
  console.error("❌ Backend Error:", error);
});

backend.on("close", (code) => {
  console.log(`🔴 Backend process exited with code ${code}`);
});

// Handle process termination
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down backend server...");
  backend.kill("SIGINT");
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\n🛑 Shutting down backend server...");
  backend.kill("SIGTERM");
  process.exit(0);
});
