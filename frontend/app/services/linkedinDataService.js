class LinkedInDataService {
  constructor() {
    this.baseURL = "https://api.linkedin.com/v2";
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
  }

  // Get viral posts from LinkedIn using search API
  async getViralPosts(category = "trending", limit = 20) {
    const cacheKey = `viral_posts_${category}_${limit}`;

    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.cacheExpiry) {
        return cached.data;
      }
    }

    try {
      // In a real implementation, you'd use LinkedIn's API
      // For now, we'll simulate with curated high-engagement posts
      const viralPosts = await this.fetchCuratedViralPosts(category, limit);

      // Cache the results
      this.cache.set(cacheKey, {
        data: viralPosts,
        timestamp: Date.now(),
      });

      return viralPosts;
    } catch (error) {
      console.error("Error fetching viral posts:", error);
      return this.getFallbackPosts(category);
    }
  }

  // Fetch curated viral posts (simulating real LinkedIn data)
  async fetchCuratedViralPosts(category, limit) {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const allPosts = {
      trending: [
        {
          id: "viral_1",
          author: {
            name: "Gary Vaynerchuk",
            title: "CEO at VaynerMedia",
            profileImage:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            verified: true,
            followers: "3.2M",
          },
          content:
            "The biggest mistake I see entrepreneurs make:\n\nThey focus on the competition instead of their customers.\n\nStop watching what others are doing.\nStart listening to what your customers need.\n\nThe market will tell you everything you need to know.\n\nBut only if you're actually listening. 👂",
          engagement: {
            reactions: 15420,
            comments: 892,
            reposts: 1205,
            views: 234567,
          },
          timestamp: "2024-01-20T10:30:00Z",
          viralScore: 98,
          category: "Business Advice",
          hashtags: ["#entrepreneurship", "#business", "#customers"],
          mediaType: "text",
        },
        {
          id: "viral_2",
          author: {
            name: "Melinda Gates",
            title: "Co-founder, Pivotal Ventures",
            profileImage:
              "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
            verified: true,
            followers: "2.8M",
          },
          content:
            'I\'ve learned that the most powerful question you can ask is:\n\n"What would this look like if it were easy?"\n\nComplexity is often a choice.\nSimplicity is a superpower.\n\nThe best solutions are usually the simplest ones.',
          engagement: {
            reactions: 23156,
            comments: 1456,
            reposts: 2890,
            views: 456789,
          },
          timestamp: "2024-01-19T14:15:00Z",
          viralScore: 96,
          category: "Leadership",
          hashtags: ["#leadership", "#simplicity", "#innovation"],
          mediaType: "text",
        },
        {
          id: "viral_3",
          author: {
            name: "Reid Hoffman",
            title: "Co-founder, LinkedIn",
            profileImage:
              "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
            verified: true,
            followers: "4.1M",
          },
          content:
            "Silicon Valley's best-kept secret:\n\nThe most successful people I know are also the most helpful.\n\nThey:\n→ Make introductions freely\n→ Share knowledge without expecting returns\n→ Celebrate others' wins\n→ Ask \"How can I help?\" in every conversation\n\nGenerosity compounds faster than any investment.",
          engagement: {
            reactions: 18934,
            comments: 1123,
            reposts: 2456,
            views: 378901,
          },
          timestamp: "2024-01-18T09:45:00Z",
          viralScore: 94,
          category: "Networking",
          hashtags: ["#networking", "#generosity", "#success"],
          mediaType: "text",
        },
      ],
      recommended: [
        {
          id: "viral_4",
          author: {
            name: "Satya Nadella",
            title: "CEO at Microsoft",
            profileImage:
              "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face",
            verified: true,
            followers: "5.2M",
          },
          content:
            "AI won't replace humans.\n\nBut humans with AI will replace humans without AI.\n\nThe question isn't whether to adopt AI.\nThe question is how quickly you can learn to work with it.\n\nStart today. Start small. Start learning.",
          engagement: {
            reactions: 34567,
            comments: 2890,
            reposts: 4123,
            views: 678901,
          },
          timestamp: "2024-01-21T11:20:00Z",
          viralScore: 99,
          category: "Technology",
          hashtags: ["#AI", "#future", "#technology", "#learning"],
          mediaType: "text",
        },
        {
          id: "viral_5",
          author: {
            name: "Oprah Winfrey",
            title: "Media Executive & Philanthropist",
            profileImage:
              "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
            verified: true,
            followers: "6.8M",
          },
          content:
            "Your biggest breakthrough is always on the other side of your biggest breakdown.\n\nI've seen this pattern in every successful person I've interviewed:\n\n• They failed publicly\n• They questioned everything\n• They rebuilt from scratch\n• They emerged stronger\n\nYour setback is your setup for a comeback. 💪",
          engagement: {
            reactions: 45123,
            comments: 3456,
            reposts: 5678,
            views: 890123,
          },
          timestamp: "2024-01-17T16:30:00Z",
          viralScore: 97,
          category: "Motivation",
          hashtags: ["#motivation", "#resilience", "#success"],
          mediaType: "text",
        },
      ],
      editors_choice: [
        {
          id: "viral_6",
          author: {
            name: "Tim Cook",
            title: "CEO at Apple",
            profileImage:
              "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
            verified: true,
            followers: "4.5M",
          },
          content:
            "The best products aren't built by committees.\n\nThey're built by small teams of passionate people who:\n\n1. Obsess over details others ignore\n2. Say no to 1000 good ideas for 1 great one\n3. Ship when it's ready, not when it's scheduled\n4. Care more about the user than the user manual\n\nSimplicity is the ultimate sophistication.",
          engagement: {
            reactions: 28901,
            comments: 1890,
            reposts: 3456,
            views: 567890,
          },
          timestamp: "2024-01-16T13:45:00Z",
          viralScore: 95,
          category: "Product",
          hashtags: ["#product", "#design", "#innovation"],
          mediaType: "text",
        },
      ],
    };

    const categoryPosts =
      allPosts[category.toLowerCase().replace(" ", "_")] || allPosts.trending;
    return categoryPosts.slice(0, limit);
  }

  // Get fallback posts if API fails
  getFallbackPosts(category) {
    return [
      {
        id: "fallback_1",
        author: {
          name: "Demo User",
          title: "Content Creator",
          profileImage:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
          verified: false,
          followers: "10K",
        },
        content:
          "This is a demo viral post template.\n\nIn a real implementation, this would be fetched from LinkedIn's API.\n\nFor now, enjoy the demo! 🚀",
        engagement: {
          reactions: 100,
          comments: 10,
          reposts: 5,
          views: 1000,
        },
        timestamp: new Date().toISOString(),
        viralScore: 50,
        category: "Demo",
        hashtags: ["#demo"],
        mediaType: "text",
      },
    ];
  }

  // Search viral posts
  async searchViralPosts(query, category = "all") {
    try {
      const allCategories =
        category === "all"
          ? ["trending", "recommended", "editors_choice"]
          : [category.toLowerCase().replace(" ", "_")];

      let allPosts = [];
      for (const cat of allCategories) {
        const posts = await this.getViralPosts(cat, 50);
        allPosts = [...allPosts, ...posts];
      }

      // Filter by search query
      const filteredPosts = allPosts.filter(
        (post) =>
          post.content.toLowerCase().includes(query.toLowerCase()) ||
          post.author.name.toLowerCase().includes(query.toLowerCase()) ||
          post.category.toLowerCase().includes(query.toLowerCase()) ||
          post.hashtags.some((tag) =>
            tag.toLowerCase().includes(query.toLowerCase())
          )
      );

      return filteredPosts.sort((a, b) => b.viralScore - a.viralScore);
    } catch (error) {
      console.error("Error searching viral posts:", error);
      return [];
    }
  }

  // Get post analytics
  async getPostAnalytics(postId) {
    try {
      // Simulate analytics data
      return {
        hourlyViews: [120, 340, 567, 890, 1200, 1456, 1890, 2234],
        topCountries: ["United States", "India", "United Kingdom", "Canada"],
        ageGroups: {
          "18-24": 15,
          "25-34": 35,
          "35-44": 30,
          "45-54": 15,
          "55+": 5,
        },
        industries: {
          Technology: 40,
          Marketing: 25,
          Finance: 15,
          Healthcare: 10,
          Other: 10,
        },
      };
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return null;
    }
  }

  // Format engagement numbers
  formatEngagement(number) {
    if (number >= 1000000) {
      return (number / 1000000).toFixed(1) + "M";
    } else if (number >= 1000) {
      return (number / 1000).toFixed(1) + "K";
    }
    return number.toString();
  }

  // Get time ago string
  getTimeAgo(timestamp) {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now - postTime) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  }
}

export default new LinkedInDataService();
