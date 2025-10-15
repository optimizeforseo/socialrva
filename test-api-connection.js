#!/usr/bin/env node

/**
 * Test script to check API connection and identify fetch issues
 */

const API_BASE_URL = "http://localhost:5002/api";

async function testAPIConnection() {
  console.log("🔍 Testing API Connection...\n");

  // Test 1: Health Check
  console.log("1️⃣ Testing Health Check...");
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      console.log("✅ Health check passed:", data);
    } else {
      console.log(
        "❌ Health check failed:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.log("❌ Health check error:", error.message);
  }

  // Test 2: AI Health Check
  console.log("\n2️⃣ Testing AI Health Check...");
  try {
    const response = await fetch(`${API_BASE_URL}/ai/health`);
    if (response.ok) {
      const data = await response.json();
      console.log("✅ AI health check passed:", data);
    } else {
      console.log(
        "❌ AI health check failed:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.log("❌ AI health check error:", error.message);
  }

  // Test 3: Test Text Generation (without auth)
  console.log("\n3️⃣ Testing Text Generation Endpoint...");
  try {
    const response = await fetch(`${API_BASE_URL}/ai/generate-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "Test prompt for AI generation",
        writingStyle: "professional",
        postCategory: "thought-leadership",
        length: "medium",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Text generation endpoint accessible");
    } else {
      console.log("❌ Text generation failed:", response.status, data);
    }
  } catch (error) {
    console.log("❌ Text generation error:", error.message);
  }

  // Test 4: Check if server is running
  console.log("\n4️⃣ Testing Server Availability...");
  try {
    const response = await fetch("http://localhost:5002");
    if (response.ok) {
      console.log("✅ Server is running on port 5002");
    } else {
      console.log("❌ Server responded with:", response.status);
    }
  } catch (error) {
    console.log("❌ Server connection error:", error.message);
    console.log(
      "💡 Make sure the backend server is running: cd backend && npm start"
    );
  }

  console.log("\n📋 Troubleshooting Tips:");
  console.log(
    "1. Make sure backend server is running: cd backend && npm start"
  );
  console.log("2. Check if port 5002 is available");
  console.log("3. Verify NEXT_PUBLIC_API_URL in .env.local");
  console.log("4. Check MongoDB connection in backend");
  console.log("5. Verify OpenAI API key is valid");
}

// Run the test
testAPIConnection().catch(console.error);
