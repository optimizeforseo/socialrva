const OpenAI = require("openai");

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // Generate AI Image
  async generateImage(prompt, options = {}) {
    try {
      const {
        style = "natural",
        aspectRatio = "square",
        quality = "standard",
        size = "1024x1024",
      } = options;

      // Map aspect ratios to OpenAI sizes
      const sizeMap = {
        square: "1024x1024",
        landscape: "1792x1024",
        portrait: "1024x1792",
      };

      const response = await this.openai.images.generate({
        model: "dall-e-3",
        prompt: this.enhanceImagePrompt(prompt, style),
        n: 1,
        size: sizeMap[aspectRatio] || size,
        quality: quality,
        response_format: "url",
      });

      return {
        success: true,
        data: {
          imageUrl: response.data[0].url,
          revisedPrompt: response.data[0].revised_prompt,
          originalPrompt: prompt,
          metadata: {
            style,
            aspectRatio,
            size: sizeMap[aspectRatio] || size,
            quality,
          },
        },
      };
    } catch (error) {
      console.error("OpenAI Image Generation Error:", error);
      return {
        success: false,
        error: error.message || "Failed to generate image",
      };
    }
  }

  // Generate AI Text Content
  async generateText(prompt, options = {}) {
    try {
      const {
        writingStyle = "professional",
        postCategory = "general",
        useViralTemplate = false,
        length = "medium",
        platform = "linkedin",
      } = options;

      const systemPrompt = this.buildTextSystemPrompt(
        writingStyle,
        postCategory,
        useViralTemplate,
        platform
      );
      const userPrompt = this.enhanceTextPrompt(prompt, length);

      const response = await this.openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        max_tokens: this.getLengthTokens(length),
        temperature: 0.7,
        presence_penalty: 0.1,
        frequency_penalty: 0.1,
      });

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
            tokensUsed: response.usage.total_tokens,
          },
        },
      };
    } catch (error) {
      console.error("OpenAI Text Generation Error:", error);
      return {
        success: false,
        error: error.message || "Failed to generate text",
      };
    }
  }

  // Enhance image prompt based on style
  enhanceImagePrompt(prompt, style) {
    const styleEnhancements = {
      realistic:
        "photorealistic, high quality, detailed, professional photography",
      animation: "digital art, animated style, colorful, creative illustration",
      artistic: "artistic, creative, stylized, beautiful composition",
      minimalist: "clean, minimal, simple, modern design",
    };

    const enhancement =
      styleEnhancements[style] || styleEnhancements["realistic"];
    return `${prompt}, ${enhancement}`;
  }

  // Build system prompt for text generation
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
        "Write in a modern, engaging style that resonates with professionals. Use conversational tone with strategic insights.",
      professional:
        "Write in a professional, authoritative tone. Focus on expertise and credibility.",
      casual:
        "Write in a friendly, approachable tone. Use simple language and relatable examples.",
      "thought-leader":
        "Write as an industry thought leader. Share unique insights and forward-thinking perspectives.",
    };

    // Category instructions
    const categoryInstructions = {
      "thought-leadership":
        "Focus on sharing insights, trends, and forward-thinking perspectives.",
      "industry-news":
        "Comment on recent industry developments with expert analysis.",
      "personal-story":
        "Share personal experiences with professional lessons learned.",
      "tips-advice": "Provide actionable advice and practical tips.",
      "company-update":
        "Share company news in an engaging, professional manner.",
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
        " Use proven viral content structures: hook in first line, storytelling elements, clear value proposition, and strong call-to-action.";
    }

    basePrompt +=
      " Format for LinkedIn with appropriate line breaks and engagement elements.";

    return basePrompt;
  }

  // Enhance text prompt based on length
  enhanceTextPrompt(prompt, length) {
    const lengthInstructions = {
      short: "Create a concise post (50-100 words)",
      medium: "Create a medium-length post (100-200 words)",
      long: "Create a comprehensive post (200-300 words)",
    };

    const instruction =
      lengthInstructions[length] || lengthInstructions["medium"];
    return `${instruction} about: ${prompt}`;
  }

  // Get token limits based on length
  getLengthTokens(length) {
    const tokenLimits = {
      short: 150,
      medium: 300,
      long: 500,
    };
    return tokenLimits[length] || tokenLimits["medium"];
  }

  // Generate content suggestions
  async generateSuggestions(type, context = "") {
    try {
      const prompts = {
        image: "Generate 5 creative image prompts for LinkedIn posts about",
        text: "Generate 5 engaging LinkedIn post topics about",
        carousel: "Generate 5 carousel post ideas with slide topics about",
      };

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: `${prompts[type] || prompts["text"]} ${
              context || "professional development and business growth"
            }`,
          },
        ],
        max_tokens: 200,
        temperature: 0.8,
      });

      return {
        success: true,
        suggestions: response.choices[0].message.content
          .split("\n")
          .filter((s) => s.trim()),
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

module.exports = new OpenAIService();
