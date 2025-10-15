const axios = require("axios");

const API_BASE = "http://localhost:5000";

async function testBasicEndpoints() {
  console.log("🔍 Testing Basic Backend Endpoints...\n");

  // Test 1: Root endpoint
  try {
    console.log("1. Testing root endpoint...");
    const response = await axios.get(`${API_BASE}/`);
    console.log("✅ Root endpoint:", response.data.message);
  } catch (error) {
    console.log("❌ Root endpoint failed:", error.message);
    console.log("💡 Make sure backend server is running on port 5000");
    return false;
  }

  // Test 2: Health check
  try {
    console.log("\n2. Testing health check...");
    const response = await axios.get(`${API_BASE}/api/health`);
    console.log("✅ Health check:", response.data);
  } catch (error) {
    console.log("❌ Health check failed:", error.message);
  }

  // Test 3: Test invalid route (should return 404)
  try {
    console.log("\n3. Testing 404 handling...");
    await axios.get(`${API_BASE}/api/nonexistent`);
    console.log("❌ 404 handling not working (should have failed)");
  } catch (error) {
    if (error.response?.status === 404) {
      console.log("✅ 404 handling works correctly");
    } else {
      console.log("❌ Unexpected error:", error.message);
    }
  }

  console.log("\n🎉 Basic backend tests completed!");
  return true;
}

// Run if executed directly
if (require.main === module) {
  testBasicEndpoints().catch(console.error);
}

module.exports = { testBasicEndpoints };
