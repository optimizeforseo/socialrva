#!/usr/bin/env node

/**
 * Demo script to showcase AI features
 * Run this after starting the backend server
 */

const fetch = require("node-fetch");

const API_BASE = "http://localhost:5002/api";

// Demo user for testing
const demoUser = {
  email: "demo@socialsonic.ai",
  firstName: "Demo",
  lastName: "User",
  password: "demo123",
};

async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function demoAIFeatures() {
  console.log("🎭 SocialSonic AI Features Demo\n");

  // 1. Health Check
  console.log("1️⃣ Checking API Health...");
  const health = await apiCall("/ai/health");
  if (health.success) {
    console.log("✅ API is healthy");
    console.log(
      `   OpenAI Status: ${health.data.openai.success ? "Connected" : "Error"}`
    );
  } else {
    console.log("❌ API health check failed");
    return;
  }

  // 2. Test Text Generation (without auth for demo)
  console.log("\n2️⃣ Testing AI Text Generation...");
  const textPrompt = "The future of artificial intelligence in business";
  console.log(`   Prompt: "${textPrompt}"`);

  // Note: This would normally require authentication
  console.log("   📝 Text generation requires user authentication");
  console.log("   💡 Use the web interface to test text generation");

  // 3. Test Image Generation (without auth for demo)
  console.log("\n3️⃣ Testing AI Image Generation...");
  const imagePrompt = "A professional business meeting in a modern office";
  console.log(`   Prompt: "${imagePrompt}"`);
  console.log("   🖼️ Image generation requires user authentication");
  console.log("   💡 Use the web interface to test image generation");

  // 4. Show available endpoints
  console.log("\n4️⃣ Available API Endpoints:");
  const endpoints = [
    "POST /api/ai/generate-text - Generate AI text content",
    "POST /api/ai/generate-image - Generate AI images",
    "POST /api/ai/suggestions - Get content suggestions",
    "GET  /api/ai/content - Get user content history",
    "GET  /api/ai/stats - Get user statistics",
    "GET  /api/ai/health - Check API health",
  ];

  endpoints.forEach((endpoint) => {
    console.log(`   📡 ${endpoint}`);
  });

  // 5. Feature showcase
  console.log("\n5️⃣ Available Features:");
  const features = [
    "✍️ AI Write - Multiple input methods (topic, URL, file)",
    "🎨 AI Image - Multiple styles and aspect ratios",
    "📚 My Creations - View and reuse previous content",
    "👀 Live Preview - Real-time content preview",
    "🎯 Style Options - Professional, casual, thought leader",
    "📊 Credit System - Track usage and limits",
    "🔄 Template Reuse - Save and reuse successful prompts",
  ];

  features.forEach((feature) => {
    console.log(`   ${feature}`);
  });

  console.log("\n🚀 Demo completed!");
  console.log("💡 Start the web interface to try all features:");
  console.log("   Frontend: http://localhost:3000");
  console.log("   Backend:  http://localhost:5002");
}

// Run demo
demoAIFeatures().catch(console.error);
