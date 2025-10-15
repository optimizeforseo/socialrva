const mongoose = require("mongoose");
require("dotenv").config();

const User = require("../models/User");
const AIContent = require("../models/AIContent");

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await AIContent.deleteMany({});
    console.log("Cleared existing data");

    // Create sample users
    const users = await User.create([
      {
        email: "john@example.com",
        firstName: "John",
        lastName: "Doe",
        password: "password123",
        isVerified: true,
        subscription: {
          type: "premium",
          creditsLimit: 100,
          creditsUsed: 25,
        },
      },
      {
        email: "jane@example.com",
        firstName: "Jane",
        lastName: "Smith",
        password: "password123",
        isVerified: true,
        subscription: {
          type: "free",
          creditsLimit: 10,
          creditsUsed: 3,
        },
      },
      {
        email: "admin@socialsonic.com",
        firstName: "Admin",
        lastName: "User",
        password: "admin123",
        isVerified: true,
        subscription: {
          type: "enterprise",
          creditsLimit: 1000,
          creditsUsed: 50,
        },
      },
    ]);

    console.log("Created sample users");

    // Create sample AI content
    const sampleContent = [
      {
        userId: users[0]._id,
        type: "text",
        prompt: "Tips for remote work productivity",
        generatedContent: {
          content:
            "🏠 Working from home? Here are 5 game-changing productivity tips:\n\n1️⃣ Create a dedicated workspace\n2️⃣ Set clear boundaries with family\n3️⃣ Use the Pomodoro technique\n4️⃣ Take regular breaks\n5️⃣ Maintain social connections\n\nWhat's your best remote work tip? 💼\n\n#RemoteWork #Productivity #WorkFromHome",
        },
        metadata: {
          writingStyle: "professional",
          postCategory: "tips-advice",
          length: "medium",
          creditsUsed: 1,
        },
        status: "completed",
        isPublic: true,
        likes: 15,
        views: 120,
      },
      {
        userId: users[1]._id,
        type: "image",
        prompt: "Professional team meeting in modern office",
        generatedContent: {
          imageUrl: "https://example.com/sample-image.jpg",
          revisedPrompt:
            "Professional team meeting in modern office with diverse group of people collaborating",
        },
        metadata: {
          style: "realistic",
          aspectRatio: "landscape",
          creditsUsed: 2,
        },
        status: "completed",
        isPublic: true,
        likes: 8,
        views: 65,
      },
    ];

    await AIContent.create(sampleContent);
    console.log("Created sample AI content");

    console.log("✅ Database seeded successfully!");
    console.log("\nSample Users:");
    console.log("- john@example.com (Premium) - password: password123");
    console.log("- jane@example.com (Free) - password: password123");
    console.log("- admin@socialsonic.com (Enterprise) - password: admin123");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Database connection closed");
    process.exit(0);
  }
};

seedData();
