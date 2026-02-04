const OpenAI = require("openai");

class OpenAIService {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is required");
    }

    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORG_ID,
    });

    this.models = {
      text: "gpt-4",
      textFast: "gpt-3.5-turbo",
      image: "dall-e-3",
      imageFast: "dall-e-2",
    };
  }

  /**
   * Generate AI Image using DALL-E
   */
  async generateImage(prompt, options = {}) {
    const startTime = Date.now();

    try {
      const {
        style = "realistic",
        aspectRatio = "square",
        quality = "standard",
        model = "dall-e-3",
      } = options;

      // Map aspect ratios to OpenAI sizes
      const sizeMap = {
        square: model === "dall-e-3" ? "1024x1024" : "512x512",
        landscape: model === "dall-e-3" ? "1792x1024" : "512x512",
        portrait: model === "dall-e-3" ? "1024x1792" : "512x512",
      };

      const enhancedPrompt = this.enhanceImagePrompt(prompt, style);

      const response = await this.openai.images.generate({
        model: model,
        prompt: enhancedPrompt,
        n: 1,
        size: sizeMap[aspectRatio],
        quality: model === "dall-e-3" ? quality : "standard",
        response_format: "url",
      });

      const generationTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          imageUrl: response.data[0].url,
          revisedPrompt: response.data[0].revised_prompt || enhancedPrompt,
          originalPrompt: prompt,
          metadata: {
            style,
            aspectRatio,
            quality,
            size: sizeMap[aspectRatio],
            model,
            generationTime,
            creditsUsed: model === "dall-e-3" ? 2 : 1,
          },
        },
      };
    } catch (error) {
      console.error("OpenAI Image Generation Error:", error);

      return {
        success: false,
        error: {
          message: this.parseOpenAIError(error),
          code: error.code || "GENERATION_FAILED",
          generationTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * Generate AI Text using GPT
   */
  async generateText(prompt, options = {}) {
    const startTime = Date.now();

    try {
      const {
        writingStyle = "professional",
        postCategory = "general",
        useViralTemplate = false,
        length = "medium",
        platform = "linkedin",
        model = "gpt-4",
      } = options;

      const systemPrompt = this.buildTextSystemPrompt(
        writingStyle,
        postCategory,
        useViralTemplate,
        platform
      );

      const userPrompt = this.enhanceTextPrompt(prompt, length);

      const response = await this.openai.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: this.getLengthTokens(length),
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const generationTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          content: response.choices[0].message.content,
          originalPrompt: prompt,
          metadata: {
            writingStyle,
            postCategory,
            useViralTemplate,
            length,
            platform,
            model,
            tokensUsed: response.usage.total_tokens,
            generationTime,
            creditsUsed: model === "gpt-4" ? 2 : 1,
          },
        },
      };
    } catch (error) {
      console.error("OpenAI Text Generation Error:", error);

      return {
        success: false,
        error: {
          message: this.parseOpenAIError(error),
          code: error.code || "GENERATION_FAILED",
          generationTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * Generate Content for Write Your Own feature
   */
  async generateContent(prompt, options = {}) {
    const startTime = Date.now();

    try {
      const {
        contentType = "blog",
        tone = "professional",
        length = "medium",
        targetAudience = "",
        keywords = "",
        model = "gpt-4",
      } = options;

      const systemPrompt = this.buildContentSystemPrompt(
        contentType,
        tone,
        targetAudience
      );

      const userPrompt = this.enhanceContentPrompt(prompt, length, keywords);

      const response = await this.openai.chat.completions.create({
        model: model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: this.getContentLengthTokens(length),
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

      const generationTime = Date.now() - startTime;

      return {
        success: true,
        data: {
          content: response.choices[0].message.content,
          originalPrompt: prompt,
          metadata: {
            contentType,
            tone,
            length,
            targetAudience,
            keywords,
            model,
            tokensUsed: response.usage.total_tokens,
            generationTime,
            creditsUsed: model === "gpt-4" ? 2 : 1,
          },
        },
      };
    } catch (error) {
      console.error("OpenAI Content Generation Error:", error);

      return {
        success: false,
        error: {
          message: this.parseOpenAIError(error),
          code: error.code || "GENERATION_FAILED",
          generationTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * Generate content suggestions
   */
  async generateSuggestions(type, context = "", count = 5) {
    try {
      const prompts = {
        image: `Generate ${count} creative and engaging image prompts for LinkedIn posts about "${
          context || "professional development and business growth"
        }". Each prompt should be detailed and specific for AI image generation.`,
        text: `Generate ${count} engaging LinkedIn post topics about "${
          context || "professional development and business growth"
        }". Each topic should be compelling and likely to generate engagement.`,
        carousel: `Generate ${count} carousel post ideas about "${
          context || "professional development and business growth"
        }". For each idea, provide the main topic and 3-5 slide titles.`,
      };

      const response = await this.openai.chat.completions.create({
        model: this.models.textFast,
        messages: [
          {
            role: "user",
            content: prompts[type] || prompts["text"],
          },
        ],
        max_tokens: 300,
        temperature: 0.8,
      });

      const suggestions = response.choices[0].message.content
        .split("\n")
        .filter((s) => s.trim())
        .map((s) => s.replace(/^\d+\.\s*/, "").trim())
        .filter((s) => s.length > 10);

      return {
        success: true,
        suggestions: suggestions.slice(0, count),
      };
    } catch (error) {
      console.error("OpenAI Suggestions Error:", error);

      return {
        success: false,
        error: {
          message: this.parseOpenAIError(error),
          code: error.code || "SUGGESTIONS_FAILED",
        },
      };
    }
  }

  /**
   * Enhance image prompt based on style
   */
  enhanceImagePrompt(prompt, style) {
    const styleEnhancements = {
      realistic:
        "photorealistic, high quality, detailed, professional photography, sharp focus, good lighting",
      animation:
        "digital art, animated style, colorful, creative illustration, cartoon-like, vibrant colors",
      artistic:
        "artistic, creative, stylized, beautiful composition, painterly, expressive",
      minimalist:
        "clean, minimal, simple, modern design, uncluttered, elegant simplicity",
    };

    const enhancement =
      styleEnhancements[style] || styleEnhancements["realistic"];
    return `${prompt}, ${enhancement}`;
  }

  /**
   * Build system prompt for text generation
   */
  buildTextSystemPrompt(
    writingStyle,
    postCategory,
    useViralTemplate,
    platform
  ) {
    let basePrompt = `You are an expert content creator for ${platform}. `;

    // Writing style instructions
    const styleInstructions = {
      socialsonic:
        "Write in a modern, engaging style that resonates with professionals. Use conversational tone with strategic insights. Be authentic and relatable.",
      professional:
        "Write in a professional, authoritative tone. Focus on expertise and credibility. Use industry terminology appropriately.",
      casual:
        "Write in a friendly, approachable tone. Use simple language and relatable examples. Be conversational and warm.",
      "thought-leader":
        "Write as an industry thought leader. Share unique insights and forward-thinking perspectives. Be visionary and inspiring.",
    };

    // Category instructions
    const categoryInstructions = {
      "thought-leadership":
        "Focus on sharing insights, trends, and forward-thinking perspectives that establish authority.",
      "industry-news":
        "Comment on recent industry developments with expert analysis and implications.",
      "personal-story":
        "Share personal experiences with professional lessons learned. Be authentic and vulnerable.",
      "tips-advice":
        "Provide actionable advice and practical tips that readers can implement immediately.",
      "company-update":
        "Share company news in an engaging, professional manner that builds brand awareness.",
    };

    basePrompt +=
      styleInstructions[writingStyle.toLowerCase()] ||
      styleInstructions["professional"];
    basePrompt +=
      " " +
      (categoryInstructions[postCategory.toLowerCase().replace(" ", "-")] ||
        "");

    if (useViralTemplate) {
      basePrompt +=
        " Use proven viral content structures: compelling hook in first line, storytelling elements, clear value proposition, emotional connection, and strong call-to-action. Include relevant emojis and hashtags.";
    }

    basePrompt += ` Format for ${platform} with appropriate line breaks, emojis, and engagement elements. Keep it authentic and valuable.`;

    return basePrompt;
  }

  /**
   * Enhance text prompt based on length
   */
  enhanceTextPrompt(prompt, length) {
    const lengthInstructions = {
      short: "Create a concise, impactful post (50-100 words) about:",
      medium: "Create a well-structured post (100-200 words) about:",
      long: "Create a comprehensive, detailed post (200-300 words) about:",
    };

    const instruction =
      lengthInstructions[length] || lengthInstructions["medium"];
    return `${instruction} ${prompt}`;
  }

  /**
   * Get token limits based on length
   */
  getLengthTokens(length) {
    const tokenLimits = {
      short: 150,
      medium: 300,
      long: 500,
    };
    return tokenLimits[length] || tokenLimits["medium"];
  }

  /**
   * Build system prompt for content generation
   */
  buildContentSystemPrompt(contentType, tone, targetAudience) {
    let basePrompt = "You are an expert content writer and copywriter. ";

    // Content type instructions
    const typeInstructions = {
      blog: "Create engaging blog post content with clear structure, compelling headlines, and valuable insights. Use proper formatting with headers, bullet points, and engaging introductions and conclusions.",
      article:
        "Write informative, well-researched article content that provides deep insights and analysis. Structure with clear sections and maintain journalistic quality.",
      social:
        "Create engaging social media content that drives interaction. Use appropriate hashtags, emojis, and call-to-actions. Keep it concise and shareable.",
      email:
        "Write compelling email copy that drives action. Include attention-grabbing subject lines, clear value propositions, and strong calls-to-action.",
      product:
        "Create persuasive product descriptions that highlight benefits, features, and value. Focus on solving customer problems and driving conversions.",
      story:
        "Write engaging creative stories with compelling narratives, character development, and emotional resonance. Use vivid descriptions and engaging plot structures.",
    };

    // Tone instructions
    const toneInstructions = {
      professional:
        "Use a professional, authoritative tone. Be credible, informative, and maintain expertise throughout.",
      casual:
        "Write in a friendly, conversational tone. Be approachable, relatable, and use everyday language.",
      friendly:
        "Maintain a warm, welcoming tone. Be personable, encouraging, and create connection with readers.",
      formal:
        "Use formal, structured language. Be precise, objective, and maintain academic or business standards.",
      humorous:
        "Incorporate appropriate humor and wit. Be entertaining while maintaining professionalism and relevance.",
      persuasive:
        "Use compelling, convincing language. Focus on benefits, create urgency, and drive action.",
    };

    basePrompt += typeInstructions[contentType] || typeInstructions["blog"];
    basePrompt +=
      " " + (toneInstructions[tone] || toneInstructions["professional"]);

    if (targetAudience) {
      basePrompt += ` Target this content specifically for: ${targetAudience}. Adjust language, examples, and references to resonate with this audience.`;
    }

    basePrompt +=
      " Ensure the content is original, valuable, and engaging. Use proper formatting and structure for readability.";

    return basePrompt;
  }

  /**
   * Enhance content prompt based on parameters
   */
  enhanceContentPrompt(prompt, length, keywords) {
    const lengthInstructions = {
      short: "Create concise content (100-300 words) about:",
      medium: "Create comprehensive content (300-600 words) about:",
      long: "Create detailed, in-depth content (600-1000 words) about:",
      "very-long": "Create extensive, thorough content (1000+ words) about:",
    };

    const instruction =
      lengthInstructions[length] || lengthInstructions["medium"];
    let enhancedPrompt = `${instruction} ${prompt}`;

    if (keywords && keywords.trim()) {
      enhancedPrompt += ` Make sure to naturally incorporate these keywords: ${keywords}`;
    }

    return enhancedPrompt;
  }

  /**
   * Get token limits for content generation based on length
   */
  getContentLengthTokens(length) {
    const tokenLimits = {
      short: 400,
      medium: 800,
      long: 1200,
      "very-long": 1600,
    };
    return tokenLimits[length] || tokenLimits["medium"];
  }

  /**
   * Parse OpenAI errors into user-friendly messages
   */
  parseOpenAIError(error) {
    if (error.code === "insufficient_quota") {
      return "OpenAI API quota exceeded. Please try again later.";
    }

    if (error.code === "rate_limit_exceeded") {
      return "Rate limit exceeded. Please wait a moment before trying again.";
    }

    if (error.code === "invalid_request_error") {
      return "Invalid request. Please check your input and try again.";
    }

    if (error.message?.includes("content_policy_violation")) {
      return "Content violates OpenAI policy. Please modify your request.";
    }

    return (
      error.message ||
      "An error occurred while generating content. Please try again."
    );
  }

  /**
   * Check API health
   */
  async checkHealth() {
    try {
      const response = await this.openai.models.list();
      return {
        success: true,
        models: response.data.length,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }
}

module.exports = new OpenAIService();
