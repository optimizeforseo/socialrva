// Test script to check if backend starts properly
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env.local" });

console.log("🧪 Testing Backend Configuration...");
console.log("MongoDB URI:", process.env.MONGODB_URI ? "Set ✅" : "Missing ❌");
console.log(
  "OpenAI API Key:",
  process.env.OPENAI_API_KEY ? "Set ✅" : "Missing ❌"
);
console.log("Port:", process.env.PORT || 5001);

// Test MongoDB connection
async function testMongoDB() {
  try {
    console.log("\n📡 Testing MongoDB connection...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected successfully!");

    // Test creating a user
    const User = require("./backend/models/User");
    const testUser = await User.findOne({ email: "test@example.com" });

    if (testUser) {
      console.log("✅ Test user found:", testUser._id);
    } else {
      console.log("ℹ️  No test user found, will be created on first API call");
    }

    await mongoose.disconnect();
    console.log("✅ MongoDB test completed");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
}

// Test OpenAI service
async function testOpenAI() {
  try {
    console.log("\n🤖 Testing OpenAI service...");
    const openaiService = require("./backend/services/openaiService");
    console.log("✅ OpenAI service loaded successfully");
  } catch (error) {
    console.error("❌ OpenAI service failed:", error.message);
  }
}

// Run tests
async function runTests() {
  await testMongoDB();
  await testOpenAI();
  console.log("\n🎉 Backend test completed!");
  process.exit(0);
}

runTests();
