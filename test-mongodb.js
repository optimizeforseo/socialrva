const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

async function testMongoConnection() {
  console.log("🔍 Testing MongoDB Connection...\n");

  const mongoUri = process.env.MONGODB_URI;
  console.log(
    "📍 MongoDB URI:",
    mongoUri?.replace(/\/\/.*@/, "//***:***@") || "Not set"
  );

  if (!mongoUri) {
    console.log("❌ MONGODB_URI not found in .env.local");
    console.log("💡 Please add MONGODB_URI to your .env.local file");
    return false;
  }

  try {
    console.log("🔌 Attempting to connect to MongoDB...");
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB connected successfully!");

    // Test basic operations
    console.log("\n📝 Testing basic database operations...");

    // Create a test collection
    const TestSchema = new mongoose.Schema({
      name: String,
      createdAt: { type: Date, default: Date.now },
    });

    const TestModel = mongoose.model("Test", TestSchema);

    // Insert test document
    const testDoc = new TestModel({ name: "Backend Test" });
    await testDoc.save();
    console.log("✅ Test document created:", testDoc._id);

    // Find test document
    const foundDoc = await TestModel.findById(testDoc._id);
    console.log("✅ Test document found:", foundDoc.name);

    // Delete test document
    await TestModel.findByIdAndDelete(testDoc._id);
    console.log("✅ Test document deleted");

    // Clean up test collection
    await mongoose.connection.db.dropCollection("tests");
    console.log("✅ Test collection cleaned up");

    await mongoose.disconnect();
    console.log("✅ MongoDB disconnected");

    console.log("\n🎉 MongoDB test completed successfully!");
    return true;
  } catch (error) {
    console.log("❌ MongoDB connection failed:", error.message);

    if (error.message.includes("ECONNREFUSED")) {
      console.log("\n💡 Troubleshooting tips:");
      console.log("   1. Make sure MongoDB is running locally");
      console.log("   2. Or use MongoDB Atlas cloud database");
      console.log("   3. Check if the connection string is correct");
    }

    return false;
  }
}

// Run if executed directly
if (require.main === module) {
  testMongoConnection().catch(console.error);
}

module.exports = { testMongoConnection };
