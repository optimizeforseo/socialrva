class LinkedInService {
  constructor() {
    this.baseURL = "https://api.linkedin.com/v2";
  }

  // Get user profile information
  async getUserProfile(accessToken) {
    try {
      const response = await fetch(`${this.baseURL}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch profile: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching LinkedIn profile:", error);
      throw error;
    }
  }

  // Get user email
  async getUserEmail(accessToken) {
    try {
      const response = await fetch(
        `${this.baseURL}/emailAddress?q=members&projection=(elements*(handle~))`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch email: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.elements && data.elements.length > 0) {
        return data.elements[0]["handle~"].emailAddress;
      }

      return null;
    } catch (error) {
      console.error("Error fetching LinkedIn email:", error);
      return null;
    }
  }

  // Create a LinkedIn post
  async createPost(accessToken, content, userId) {
    try {
      const postData = {
        author: `urn:li:person:${userId}`,
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
      };

      const response = await fetch(`${this.baseURL}/ugcPosts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create post: ${errorData}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating LinkedIn post:", error);
      throw error;
    }
  }

  // Get user's posts
  async getUserPosts(accessToken, userId, count = 10) {
    try {
      const response = await fetch(
        `${this.baseURL}/shares?q=owners&owners=urn:li:person:${userId}&count=${count}&sortBy=CREATED`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-Restli-Protocol-Version": "2.0.0",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch posts: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching LinkedIn posts:", error);
      throw error;
    }
  }

  // Validate access token
  async validateToken(accessToken) {
    try {
      const response = await fetch(`${this.baseURL}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      });

      return response.ok;
    } catch (error) {
      console.error("Error validating LinkedIn token:", error);
      return false;
    }
  }

  // Refresh access token (LinkedIn tokens don't refresh, need re-auth)
  async refreshToken(refreshToken) {
    // LinkedIn doesn't support refresh tokens
    // Users need to re-authenticate when token expires
    throw new Error(
      "LinkedIn doesn't support token refresh. Please re-authenticate."
    );
  }
}

export default new LinkedInService();
