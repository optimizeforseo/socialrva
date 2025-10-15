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
