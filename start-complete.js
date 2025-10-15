#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

console.log("🚀 Starting SocialSonic AI Complete System...\n");

// Check if required files exist
const requiredFiles = [
  ".env.local",
  "backend/.env",
  "package.json",
  "backend/package.json",
];

console.log("📋 Checking required files...");
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - Missing!`);
  }
}

// Function to start a process
function startProcess(name, command, args, cwd = process.cwd()) {
  console.log(`\n🔄 Starting ${name}...`);

  const child = spawn(command, args, {
    cwd,
    stdio: "pipe",
    shell: true,
  });

  child.stdout.on("data", (data) => {
    console.log(`[${name}] ${data.toString().trim()}`);
  });

  child.stderr.on("data", (data) => {
    console.error(`[${name} ERROR] ${data.toString().trim()}`);
  });

  child.on("close", (code) => {
    console.log(`[${name}] Process exited with code ${code}`);
  });

  return child;
}

// Start backend
const backend = startProcess(
  "Backend",
  "npm",
  ["start"],
  path.join(process.cwd(), "backend")
);

// Wait a bit for backend to start
setTimeout(() => {
  // Start frontend
  const frontend = startProcess("Frontend", "npm", ["run", "dev"]);

  // Handle graceful shutdown
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down...");
    backend.kill();
    frontend.kill();
    process.exit(0);
  });

  console.log("\n🎉 System started!");
  console.log("📱 Frontend: http://localhost:3000");
  console.log("🔧 Backend: http://localhost:5002");
  console.log("\n💡 Press Ctrl+C to stop all services");
}, 3000);
