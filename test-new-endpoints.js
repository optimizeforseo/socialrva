#!/usr/bin/env node

/**
 * Test script for the new public test endpoints
 */

const API_BASE_URL = "http://localhost:5002/api";

async function testNewEndpoints() {
  console.log("🧪 Testing New Public Endpoints...\n");

  // Test 1: Test Text Generation
  console.log("1️⃣ Testing Public Text Generation...");
  try {
    const response = await fetch(`${API_BASE_URL}/ai/test-generate-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "The future of artificial intelligence in business",
        writingStyle: "professional",
        postCategory: "thought-leadership",
        length: "medium",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Text generation successful!");
      console.log(
        "📝 Generated content preview:",
        data.data.content.substring(0, 100) + "..."
      );
    } else {
      console.log("❌ Text generation failed:", response.status, data);
    }
  } catch (error) {
    console.log("❌ Text generation error:", error.message);
  }

  // Test 2: Test Image Generation
  console.log("\n2️⃣ Testing Public Image Generation...");
  try {
    const response = await fetch(`${API_BASE_URL}/ai/test-generate-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "A professional business meeting in a modern office",
        style: "realistic",
        aspectRatio: "square",
      }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Image generation successful!");
      console.log("🖼️ Image URL:", data.data.imageUrl);
    } else {
      console.log("❌ Image generation failed:", response.status, data);
    }
  } catch (error) {
    console.log("❌ Image generation error:", error.message);
  }

  console.log("\n🎉 Test completed!");
}

// Run the test
testNewEndpoints().catch(console.error);
