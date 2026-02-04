const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

class AIService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.useMockService = false;
    console.log("🔗 AIService initialized with baseURL:", this.baseURL);
  }

  // Helper method for API calls with enhanced error handling
  async apiCall(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      console.log("🌐 Making API call to:", url);

      const config = {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      };

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout for AI calls

      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("📡 Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("❌ API Error:", errorData);
        throw new Error(
          errorData.error ||
            errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(
        "✅ API Success:",
        data.success ? "Generated successfully" : "Response received"
      );
      return data;
    } catch (error) {
      console.error("🚨 API Call Error:", error);

      // Enhanced error messages
      if (error.name === "AbortError") {
        throw new Error(
          "Request timeout - AI generation is taking longer than expected. Please try again."
        );
      } else if (
        error.message.includes("fetch") ||
        error.message.includes("Failed to fetch")
      ) {
        throw new Error(
          "Unable to connect to server. Please ensure the backend is running on http://localhost:5002"
        );
      } else if (error.message.includes("NetworkError")) {
        throw new Error(
          "Network error - please check your internet connection"
        );
      }

      throw error;
    }
  }

  // Check if backend is available
  async checkBackendHealth() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: "GET",
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });
      return response.ok;
    } catch (error) {
      console.warn("Backend health check failed:", error.message);
      return false;
    }
  }

  // Generate AI Image - Real API only
  async generateImage(prompt, options = {}) {
    const {
      style = "realistic",
      aspectRatio = "square",
      userId = null,
    } = options;

    try {
      // Use the test endpoint that doesn't require authentication
      return await this.apiCall("/ai/test-generate-image", {
        method: "POST",
        body: JSON.stringify({
          prompt,
          style,
          aspectRatio,
        }),
      });
    } catch (error) {
      console.error("AI Image generation failed:", error.message);

      // Don't fall back to mock - throw the real error
      throw new Error(
        error.message ||
          "Failed to generate image. Please check your connection and try again."
      );
    }
  }

  // Mock image response for when backend is unavailable
  getMockImageResponse(prompt, options) {
    const { style = "realistic", aspectRatio = "square" } = options;

    // Create a placeholder image URL based on the prompt
    const encodedPrompt = encodeURIComponent(prompt.substring(0, 50));
    const dimensions =
      aspectRatio === "landscape"
        ? "800x600"
        : aspectRatio === "portrait"
        ? "600x800"
        : "600x600";
    const backgroundColor =
      style === "realistic"
        ? "4F46E5"
        : style === "animation"
        ? "EC4899"
        : "8B5CF6";

    return {
      success: true,
      data: {
        imageUrl: `https://via.placeholder.com/${dimensions}/${backgroundColor}/FFFFFF?text=${encodedPrompt}`,
        revisedPrompt: `Demo image for: ${prompt} in ${style} style`,
        originalPrompt: prompt,
        metadata: {
          style,
          aspectRatio,
          model: "demo-dall-e-3",
          generationTime: 2000,
          creditsUsed: 2,
          isDemo: true,
        },
      },
    };
  }

  // Generate AI Text - Real API only
  async generateText(prompt, options = {}) {
    const {
      writingStyle = "socialsonic",
      postCategory = "thought-leadership",
      useViralTemplate = false,
      length = "medium",
      userId = null,
    } = options;

    try {
      // Use the test endpoint that doesn't require authentication
      return await this.apiCall("/ai/test-generate-text", {
        method: "POST",
        body: JSON.stringify({
          prompt,
          writingStyle,
          postCategory,
          useViralTemplate,
          length,
        }),
      });
    } catch (error) {
      console.error("AI Text generation failed:", error.message);

      // Don't fall back to mock - throw the real error
      throw new Error(
        error.message ||
          "Failed to generate text. Please check your connection and try again."
      );
    }
  }

  // Mock response for when backend is unavailable
  getMockTextResponse(prompt, options) {
    const {
      writingStyle = "professional",
      postCategory = "thought-leadership",
      length = "medium",
    } = options;

    return {
      success: true,
      data: {
        content: `🚀 **${prompt}**

This is a demo AI-generated LinkedIn post. In a real implementation, this would be generated by OpenAI's GPT-4.

✨ **Key insights:**
• Professional perspective on ${prompt.toLowerCase()}
• Engaging content structure with clear value
• Call-to-action to drive engagement

**Style:** ${writingStyle} | **Category:** ${postCategory} | **Length:** ${length}

What are your thoughts on this topic? Share your experience in the comments! 👇

#AI #Innovation #LinkedIn #Demo

---
*This is a demo response. Connect your OpenAI API key and start the backend server for real AI generation.*`,
        metadata: {
          writingStyle,
          postCategory,
          length,
          model: "demo-gpt-4",
          tokensUsed: 150,
          generationTime: 1000,
          creditsUsed: 1,
          isDemo: true,
        },
      },
    };
  }

  // Get content suggestions
  async getSuggestions(type, context = "") {
    return this.apiCall("/ai/suggestions", {
      method: "POST",
      body: JSON.stringify({
        type,
        context,
      }),
    });
  }

  // Get user's content history
  async getContentHistory(userId, options = {}) {
    const { type, page = 1, limit = 10 } = options;
    const params = new URLSearchParams({
      ...(type && { type }),
      page: page.toString(),
      limit: limit.toString(),
    });

    return this.apiCall(`/ai/content/${userId}?${params}`);
  }

  // Get specific content item
  async getContentItem(contentId) {
    return this.apiCall(`/ai/content/item/${contentId}`);
  }

  // Delete content
  async deleteContent(contentId) {
    return this.apiCall(`/ai/content/${contentId}`, {
      method: "DELETE",
    });
  }

  // Get user stats
  async getUserStats(userId) {
    return this.apiCall(`/ai/stats/${userId}`);
  }

  // Health check
  async healthCheck() {
    return this.apiCall("/health");
  }

  // Test AI API
  async testAPI() {
    return this.apiCall("/ai/test");
  }

  // Generate Content for Write Your Own feature
  async generateContent(prompt, options = {}) {
    try {
      // Try to use the backend API first
      return await this.apiCall("/ai/generate-content", {
        method: "POST",
        body: JSON.stringify({
          prompt,
          ...options,
        }),
      });
    } catch (error) {
      console.error("AI Content generation failed:", error.message);

      // Fall back to mock response for demo purposes
      console.log("🔄 Falling back to mock content generation");
      return this.getMockContentResponse(prompt, options);
    }
  }

  // Mock content response for when backend is unavailable
  getMockContentResponse(prompt, options = {}) {
    const {
      contentType = "blog",
      tone = "professional",
      length = "medium",
    } = options;

    const mockContent = this.generateMockContent(
      prompt,
      contentType,
      tone,
      length
    );

    return {
      success: true,
      data: {
        content: mockContent,
        metadata: {
          contentType,
          tone,
          length,
          model: "demo-gpt-4",
          tokensUsed: 200,
          generationTime: 2000,
          creditsUsed: 1,
          isDemo: true,
        },
      },
    };
  }

  // Generate mock content based on parameters
  generateMockContent(topic, contentType, tone, length) {
    const toneAdjectives = {
      professional: "comprehensive and insightful",
      casual: "friendly and approachable",
      friendly: "warm and engaging",
      formal: "structured and authoritative",
      humorous: "entertaining and witty",
      persuasive: "compelling and convincing",
    };

    const lengthWords = {
      short: 150,
      medium: 400,
      long: 700,
      "very-long": 1000,
    };

    const contentTemplates = {
      blog: `# ${topic}

## Introduction

Welcome to this ${toneAdjectives[tone]} exploration of ${topic}. In today's rapidly evolving landscape, understanding this subject has become increasingly important for professionals and enthusiasts alike.

## Key Points

### 1. Understanding the Fundamentals
The foundation of ${topic} lies in its core principles. These fundamental concepts shape how we approach and implement solutions in this domain.

### 2. Practical Applications
Real-world applications of ${topic} demonstrate its versatility and impact across various industries and use cases.

### 3. Best Practices
Following established best practices ensures optimal results and helps avoid common pitfalls when working with ${topic}.

## Benefits and Advantages

The advantages of mastering ${topic} include:
- Enhanced productivity and efficiency
- Better decision-making capabilities
- Improved outcomes and results
- Competitive advantage in the market

## Conclusion

In conclusion, ${topic} represents a valuable area of knowledge that can significantly impact your success. By understanding its principles and applications, you can leverage its power to achieve your goals.

---
*This is a demo content generated for demonstration purposes. Connect your AI service for personalized, high-quality content generation.*`,

      article: `**${topic}: A Comprehensive Analysis**

In the modern era, ${topic} has emerged as a critical factor in determining success across multiple domains. This ${toneAdjectives[tone]} analysis explores the various dimensions of this important subject.

**The Current Landscape**

Today's environment presents unique challenges and opportunities related to ${topic}. Understanding these dynamics is essential for making informed decisions and developing effective strategies.

**Key Insights**

Research and practical experience have revealed several important insights about ${topic}:

• Strategic implementation leads to better outcomes
• Continuous learning and adaptation are crucial
• Collaboration and knowledge sharing enhance results
• Technology plays an increasingly important role

**Future Implications**

Looking ahead, ${topic} will continue to evolve and shape our approaches to problem-solving and innovation. Staying informed and adaptable will be key to success.

**Actionable Recommendations**

Based on this analysis, consider these practical steps:
1. Assess your current understanding and capabilities
2. Identify areas for improvement and growth
3. Develop a structured learning plan
4. Implement best practices consistently
5. Monitor progress and adjust as needed

*Demo content - Connect your AI service for customized, professional content generation.*`,

      social: `🚀 Exciting insights about ${topic}! 

Did you know that understanding ${topic} can transform your approach to problem-solving? Here's what I've learned:

✨ Key takeaways:
• It's more impactful than most people realize
• The right strategy makes all the difference
• Continuous learning is essential
• Results speak for themselves

💡 Pro tip: Start small, think big, and stay consistent!

What's your experience with ${topic}? Share your thoughts below! 👇

#Innovation #Growth #Success #Learning

---
*Demo post - Connect your AI service for engaging, personalized social media content.*`,

      email: `Subject: Important Update About ${topic}

Dear [Name],

I hope this message finds you well. I wanted to share some important insights about ${topic} that could benefit you and your team.

**Why This Matters**

In today's competitive environment, staying informed about ${topic} is crucial for maintaining your edge and achieving your objectives.

**Key Benefits**

By focusing on ${topic}, you can expect to see:
- Improved performance and results
- Enhanced efficiency and productivity
- Better strategic positioning
- Increased competitive advantage

**Next Steps**

I'd love to discuss how these insights can be applied to your specific situation. Would you be available for a brief conversation this week?

**Call to Action**

Reply to this email or schedule a meeting at your convenience. I'm here to help you succeed.

Best regards,
[Your Name]

P.S. This is demo content - connect your AI service for personalized, professional email copy.`,

      product: `**${topic} - Premium Quality Solution**

⭐⭐⭐⭐⭐ (4.9/5 stars - 1,247 reviews)

**Product Overview**
Discover the power of ${topic} with our premium solution designed for professionals who demand excellence. This carefully crafted offering combines innovation, quality, and value to deliver outstanding results.

**Key Features:**
✓ High-quality construction and materials
✓ User-friendly design and interface
✓ Comprehensive functionality and capabilities
✓ Reliable performance and durability
✓ Expert support and documentation

**Benefits:**
• Saves time and increases efficiency
• Delivers consistent, professional results
• Easy to use for beginners and experts alike
• Backed by our satisfaction guarantee
• Continuous updates and improvements

**What Customers Say:**
"This ${topic} solution exceeded my expectations. The quality is outstanding and the results speak for themselves." - Sarah M., Verified Buyer

**Special Offer:**
Limited time: Get 20% off your first order with code DEMO20

**Order Now** - Free shipping on orders over $50
30-day money-back guarantee

*Demo product description - Connect your AI service for compelling, conversion-focused product copy.*`,

      story: `**${topic}: A Journey of Discovery**

Chapter 1: The Beginning

It was a crisp autumn morning when Sarah first encountered ${topic}. Little did she know that this moment would change everything she thought she knew about her field of work.

The office buzzed with its usual energy, but something felt different today. As she sat at her desk, reviewing the quarterly reports, a colleague mentioned something that caught her attention - a new approach to ${topic} that was revolutionizing their industry.

Chapter 2: The Discovery

Intrigued, Sarah began her research. What she found was fascinating - a world of possibilities she had never considered before. The more she learned about ${topic}, the more she realized its potential impact on her work and life.

The ${tone} approach to understanding this subject opened new doors and perspectives. Each piece of information built upon the last, creating a comprehensive picture of what was possible.

Chapter 3: The Transformation

As weeks turned into months, Sarah's expertise in ${topic} grew exponentially. She began implementing what she learned, and the results were remarkable. Her colleagues noticed the change, her productivity soared, and her confidence reached new heights.

The journey wasn't always easy, but the rewards were worth every challenge. Sarah had discovered not just a new skill, but a new way of thinking about problems and solutions.

Epilogue: The Future

Today, Sarah is recognized as an expert in ${topic}. She mentors others, shares her knowledge, and continues to push the boundaries of what's possible. Her story serves as inspiration for anyone willing to embrace learning and growth.

*Demo story - Connect your AI service for engaging, personalized creative content.*`,
    };

    let content = contentTemplates[contentType] || contentTemplates.blog;

    // Adjust content length based on the length parameter
    const targetWords = lengthWords[length] || 400;
    const words = content.split(" ");

    if (words.length > targetWords) {
      content = words.slice(0, targetWords).join(" ") + "...";
    }

    return content;
  }

  // Test backend connection
  async testConnection() {
    try {
      console.log("🔍 Testing backend connection...");
      const response = await fetch(
        `${this.baseURL.replace("/api", "")}/health`
      );
      const data = await response.json();
      console.log("✅ Backend connection successful:", data);
      return { success: true, data };
    } catch (error) {
      console.error("❌ Backend connection failed:", error);
      return { success: false, error: error.message };
    }
  }
}

// Create singleton instance
const aiService = new AIService();

export default aiService;
