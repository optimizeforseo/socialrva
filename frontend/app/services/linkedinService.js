"use client";

/**
 * LinkedIn Service with Demo Mode
 * Handles LinkedIn API calls with fallback to demo mode
 */

class LinkedInService {
  constructor() {
    this.isDemoMode = false; // Demo mode off by default
    this.apiBaseUrl = "https://api.linkedin.com/v2";
  }

  /**
   * Check if should use demo mode
   * Only if explicitly enabled or no LinkedIn credentials
   */
  shouldUseDemoMode() {
    return (
      this.isDemoMode ||
      !process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID
    );
  }

  /**
   * Enable/Disable demo mode
   */
  setDemoMode(enabled) {
    this.isDemoMode = enabled;
    localStorage.setItem("linkedInDemoMode", enabled.toString());
  }

  /**
   * Get user profile
   */
  async getProfile(accessToken) {
    if (this.shouldUseDemoMode() || !accessToken) {
      return this.getDemoProfile();
    }

    try {
      const response = await fetch(
        `/api/linkedin/profile?accessToken=${encodeURIComponent(accessToken)}`
      );

      if (!response.ok) {
        console.warn("LinkedIn API failed, switching to demo mode");
        this.setDemoMode(true);
        return this.getDemoProfile();
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error("LinkedIn API error:", error);
      this.setDemoMode(true);
      return this.getDemoProfile();
    }
  }

  /**
   * Get demo profile data
   */
  getDemoProfile() {
    return {
      id: "demo-user-123456",
      firstName: "Demo",
      lastName: "User",
      headline: "Content Creator & Marketing Professional",
      profilePicture: null,
      vanityName: "demo-user",
      location: "San Francisco, CA",
      industry: "Marketing and Advertising",
      connections: 500,
      followers: 1250,
    };
  }

  /**
   * Get analytics data
   */
  async getAnalytics(accessToken, userId) {
    if (this.shouldUseDemoMode() || !accessToken) {
      return this.getDemoAnalytics();
    }

    try {
      const response = await fetch(
        `/api/linkedin/analytics?accessToken=${encodeURIComponent(
          accessToken
        )}&userId=${encodeURIComponent(userId)}`
      );

      if (!response.ok) {
        console.warn("LinkedIn Analytics API failed, using demo data");
        return this.getDemoAnalytics();
      }

      const result = await response.json();
      // Merge with demo data for fields not available from API
      return {
        ...this.getDemoAnalytics(),
        ...result.data,
      };
    } catch (error) {
      console.error("LinkedIn Analytics error:", error);
      return this.getDemoAnalytics();
    }
  }

  /**
   * Get demo analytics data
   */
  getDemoAnalytics() {
    return {
      profileViews: 1234,
      postImpressions: 5678,
      engagement: 234,
      followers: 890,
      searchAppearances: 456,
      connectionRequests: 23,
      weeklyData: [
        { date: "Mon", views: 180, engagement: 45 },
        { date: "Tue", views: 220, engagement: 52 },
        { date: "Wed", views: 195, engagement: 48 },
        { date: "Thu", views: 210, engagement: 55 },
        { date: "Fri", views: 185, engagement: 42 },
        { date: "Sat", views: 120, engagement: 28 },
        { date: "Sun", views: 124, engagement: 30 },
      ],
    };
  }

  /**
   * Publish post to LinkedIn
   */
  async publishPost(content, accessToken) {
    if (this.shouldUseDemoMode()) {
      return this.publishDemoPost(content);
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/ugcPosts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify({
          author: `urn:li:person:${this.getUserId(accessToken)}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: content,
              },
              shareMediaCategory: "NONE",
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        }),
      });

      if (!response.ok) {
        console.warn("LinkedIn Post API failed, using demo mode");
        return this.publishDemoPost(content);
      }

      return {
        success: true,
        message: "Post published successfully to LinkedIn",
        data: await response.json(),
      };
    } catch (error) {
      console.error("LinkedIn Publish error:", error);
      return this.publishDemoPost(content);
    }
  }

  /**
   * Simulate publishing post in demo mode
   */
  publishDemoPost(content) {
    console.log("📝 Demo Mode: Post would be published:", content);
    return {
      success: true,
      message: "Demo mode: Post simulated successfully",
      postId: `demo-post-${Date.now()}`,
      isDemoMode: true,
      content: content,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get user posts
   */
  async getUserPosts(accessToken) {
    if (this.shouldUseDemoMode()) {
      return this.getDemoPosts();
    }

    try {
      const response = await fetch(`${this.apiBaseUrl}/ugcPosts`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return this.getDemoPosts();
      }

      return await response.json();
    } catch (error) {
      console.error("LinkedIn Posts error:", error);
      return this.getDemoPosts();
    }
  }

  /**
   * Get demo posts
   */
  getDemoPosts() {
    return {
      posts: [
        {
          id: "demo-post-1",
          content: "Excited to share my latest project! 🚀",
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          likes: 45,
          comments: 12,
          shares: 8,
          impressions: 1234,
        },
        {
          id: "demo-post-2",
          content:
            "5 tips for better LinkedIn engagement:\n1. Post consistently\n2. Use visuals\n3. Engage with others\n4. Share value\n5. Be authentic",
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          likes: 89,
          comments: 23,
          shares: 15,
          impressions: 2456,
        },
        {
          id: "demo-post-3",
          content: "Just hit 1000 followers! Thank you all for the support! 🎉",
          timestamp: new Date(Date.now() - 259200000).toISOString(),
          likes: 156,
          comments: 45,
          shares: 12,
          impressions: 3789,
        },
      ],
    };
  }

  /**
   * Check LinkedIn API status
   */
  async checkStatus() {
    try {
      const response = await fetch(`${this.apiBaseUrl}/me`, {
        method: "HEAD",
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get user ID from access token (simplified)
   */
  getUserId(accessToken) {
    // In real implementation, decode JWT or make API call
    return "demo-user-id";
  }

  /**
   * Clear LinkedIn data
   */
  clearLinkedInData() {
    // Clear localStorage
    Object.keys(localStorage).forEach((key) => {
      if (key.includes("linkedin") || key.includes("LI")) {
        localStorage.removeItem(key);
      }
    });

    // Clear sessionStorage
    Object.keys(sessionStorage).forEach((key) => {
      if (key.includes("linkedin") || key.includes("LI")) {
        sessionStorage.removeItem(key);
      }
    });

    console.log("✅ LinkedIn data cleared");
  }
}

// Export singleton instance
export default new LinkedInService();
