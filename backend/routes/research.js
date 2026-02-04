const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const openaiService = require('../services/openaiService');

// Get trending topics
router.get('/trends', protect, async (req, res) => {
  try {
    const { industry = 'general', timeframe = 'week' } = req.query;
    
    // Mock trending data - in real app, this would come from social media APIs, Google Trends, etc.
    const trendingTopics = [
      {
        id: 1,
        topic: "AI in Workplace Automation",
        category: "technology",
        engagement: 25420,
        growth: "+65%",
        hashtags: ["#AI", "#Automation", "#FutureOfWork", "#Technology"],
        description: "Discussions about AI tools transforming workplace productivity and job roles",
        trendScore: 98,
        platforms: ["LinkedIn", "Twitter", "Medium"],
        keyInfluencers: ["Tech Leaders", "HR Professionals", "Startup Founders"],
        relatedKeywords: ["machine learning", "productivity tools", "digital transformation"],
        contentOpportunities: [
          "Share your experience with AI tools",
          "Discuss the human side of automation",
          "Predict future workplace changes"
        ]
      },
      {
        id: 2,
        topic: "Sustainable Business Practices",
        category: "sustainability",
        engagement: 18900,
        growth: "+42%",
        hashtags: ["#Sustainability", "#ESG", "#GreenBusiness", "#ClimateAction"],
        description: "Companies adopting eco-friendly practices and sustainable business models",
        trendScore: 92,
        platforms: ["LinkedIn", "Instagram", "Twitter"],
        keyInfluencers: ["Sustainability Experts", "CEOs", "Environmental Activists"],
        relatedKeywords: ["carbon footprint", "renewable energy", "circular economy"],
        contentOpportunities: [
          "Share your company's green initiatives",
          "Discuss ROI of sustainable practices",
          "Highlight eco-friendly innovations"
        ]
      },
      {
        id: 3,
        topic: "Remote Work Mental Health",
        category: "wellness",
        engagement: 16750,
        growth: "+38%",
        hashtags: ["#MentalHealth", "#RemoteWork", "#WorkLifeBalance", "#Wellness"],
        description: "Focus on mental health challenges and solutions for remote workers",
        trendScore: 89,
        platforms: ["LinkedIn", "Twitter", "TikTok"],
        keyInfluencers: ["Mental Health Advocates", "HR Leaders", "Wellness Coaches"],
        relatedKeywords: ["burnout prevention", "work-life balance", "employee wellbeing"],
        contentOpportunities: [
          "Share mental health tips for remote workers",
          "Discuss company wellness programs",
          "Address burnout prevention strategies"
        ]
      },
      {
        id: 4,
        topic: "Personal Branding for Professionals",
        category: "career",
        engagement: 14200,
        growth: "+35%",
        hashtags: ["#PersonalBrand", "#LinkedIn", "#CareerGrowth", "#Networking"],
        description: "Building authentic professional presence and thought leadership online",
        trendScore: 85,
        platforms: ["LinkedIn", "Twitter", "YouTube"],
        keyInfluencers: ["Career Coaches", "LinkedIn Experts", "Business Leaders"],
        relatedKeywords: ["thought leadership", "professional networking", "career development"],
        contentOpportunities: [
          "Share your personal branding journey",
          "Provide networking tips",
          "Discuss authentic leadership"
        ]
      },
      {
        id: 5,
        topic: "Cybersecurity Awareness",
        category: "technology",
        engagement: 12800,
        growth: "+29%",
        hashtags: ["#Cybersecurity", "#DataPrivacy", "#InfoSec", "#DigitalSafety"],
        description: "Growing concerns about data breaches and digital security measures",
        trendScore: 81,
        platforms: ["LinkedIn", "Twitter", "Reddit"],
        keyInfluencers: ["Security Experts", "IT Leaders", "Privacy Advocates"],
        relatedKeywords: ["data protection", "cyber threats", "security awareness"],
        contentOpportunities: [
          "Share cybersecurity best practices",
          "Discuss recent security trends",
          "Educate about digital privacy"
        ]
      }
    ];

    // Filter by industry if specified
    let filteredTopics = trendingTopics;
    if (industry !== 'general') {
      filteredTopics = trendingTopics.filter(topic => 
        topic.category === industry || 
        topic.relatedKeywords.some(keyword => keyword.includes(industry))
      );
    }

    // Add AI-generated content suggestions
    const topicsWithSuggestions = await Promise.all(
      filteredTopics.slice(0, 5).map(async (topic) => {
        try {
          const contentSuggestion = await generateContentSuggestion(topic);
          return {
            ...topic,
            aiSuggestion: contentSuggestion
          };
        } catch (error) {
          return topic;
        }
      })
    );

    res.json({
      success: true,
      data: {
        trends: topicsWithSuggestions,
        summary: {
          totalTrends: filteredTopics.length,
          avgGrowth: calculateAverageGrowth(filteredTopics),
          topCategories: getTopCategories(filteredTopics),
          emergingTopics: getEmergingTopics(filteredTopics)
        },
        recommendations: generateTrendRecommendations(filteredTopics, industry)
      }
    });

  } catch (error) {
    console.error('Trends research error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending topics'
    });
  }
});

// Get hashtag suggestions
router.get('/hashtags', protect, async (req, res) => {
  try {
    const { topic, platform = 'linkedin', count = 20 } = req.query;
    
    if (!topic) {
      return res.status(400).json({
        success: false,
        error: 'Topic is required'
      });
    }

    // Generate hashtag suggestions using AI
    const hashtagPrompt = `Generate ${count} relevant and trending hashtags for a ${platform} post about "${topic}". 
    Include a mix of:
    - Popular hashtags (high volume)
    - Niche hashtags (targeted audience)
    - Trending hashtags (current popularity)
    
    Format as a JSON array with objects containing: hashtag, volume (high/medium/low), and relevance (1-10).`;

    try {
      const aiResponse = await openaiService.generateText(hashtagPrompt, {
        maxTokens: 500,
        temperature: 0.7
      });

      // Parse AI response or use fallback
      let hashtags;
      try {
        hashtags = JSON.parse(aiResponse);
      } catch (parseError) {
        // Fallback hashtags based on topic keywords
        hashtags = generateFallbackHashtags(topic, count);
      }

      // Add performance predictions
      const hashtagsWithPredictions = hashtags.map(hashtag => ({
        ...hashtag,
        predictedReach: Math.floor(Math.random() * 10000) + 1000,
        competitionLevel: ['Low', 'Medium', 'High'][Math.floor(Math.random() * 3)],
        trendDirection: ['Rising', 'Stable', 'Declining'][Math.floor(Math.random() * 3)]
      }));

      res.json({
        success: true,
        data: {
          hashtags: hashtagsWithPredictions,
          topic,
          platform,
          suggestions: {
            optimal: hashtagsWithPredictions.slice(0, 5),
            trending: hashtagsWithPredictions.filter(h => h.trendDirection === 'Rising').slice(0, 3),
            niche: hashtagsWithPredictions.filter(h => h.volume === 'low').slice(0, 3)
          }
        }
      });

    } catch (aiError) {
      console.error('AI hashtag generation error:', aiError);
      // Return fallback hashtags
      const fallbackHashtags = generateFallbackHashtags(topic, count);
      
      res.json({
        success: true,
        data: {
          hashtags: fallbackHashtags,
          topic,
          platform,
          note: 'Generated using fallback method'
        }
      });
    }

  } catch (error) {
    console.error('Hashtag research error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate hashtag suggestions'
    });
  }
});

// Get content ideas based on trends
router.get('/content-ideas', protect, async (req, res) => {
  try {
    const { industry = 'general', contentType = 'all', count = 10 } = req.query;
    
    const contentIdeas = [
      {
        id: 1,
        title: "The AI Revolution: How It's Changing Your Industry",
        type: "thought-leadership",
        description: "Share insights on AI's impact in your specific field",
        estimatedEngagement: "High",
        difficulty: "Medium",
        timeToCreate: "30 minutes",
        suggestedFormat: "Carousel post with 5-7 slides",
        hooks: [
          "AI isn't coming for your job. It's coming for your inefficiencies.",
          "The biggest AI mistake I see professionals make...",
          "Here's what AI can't replace in your industry:"
        ],
        hashtags: ["#AI", "#FutureOfWork", "#Innovation", "#Technology"],
        callToAction: "What's your experience with AI tools? Share in comments!"
      },
      {
        id: 2,
        title: "Behind the Scenes: A Day in My Remote Work Life",
        type: "personal-story",
        description: "Show the reality of remote work with tips and insights",
        estimatedEngagement: "Medium-High",
        difficulty: "Easy",
        timeToCreate: "15 minutes",
        suggestedFormat: "Image carousel with captions",
        hooks: [
          "Remote work isn't all pajamas and coffee...",
          "Here's what my actual remote workday looks like:",
          "The remote work reality nobody talks about:"
        ],
        hashtags: ["#RemoteWork", "#WorkFromHome", "#Productivity", "#WorkLifeBalance"],
        callToAction: "Remote workers, what's your biggest challenge?"
      },
      {
        id: 3,
        title: "5 Mistakes That Are Killing Your Personal Brand",
        type: "educational",
        description: "Common personal branding mistakes and how to fix them",
        estimatedEngagement: "High",
        difficulty: "Medium",
        timeToCreate: "45 minutes",
        suggestedFormat: "Text post with bullet points",
        hooks: [
          "Your personal brand is broken. Here's why:",
          "I see these personal branding mistakes everywhere:",
          "Stop making these 5 personal branding errors:"
        ],
        hashtags: ["#PersonalBrand", "#LinkedIn", "#CareerGrowth", "#ProfessionalDevelopment"],
        callToAction: "Which mistake have you made? Let me know below!"
      }
    ];

    // Filter by content type if specified
    let filteredIdeas = contentIdeas;
    if (contentType !== 'all') {
      filteredIdeas = contentIdeas.filter(idea => idea.type === contentType);
    }

    res.json({
      success: true,
      data: {
        ideas: filteredIdeas.slice(0, count),
        categories: {
          'thought-leadership': 'Share industry insights and opinions',
          'personal-story': 'Tell authentic personal experiences',
          'educational': 'Teach valuable skills and knowledge',
          'behind-the-scenes': 'Show your work process',
          'industry-news': 'Comment on recent developments'
        },
        tips: [
          'Personal stories get 2x more engagement',
          'Educational content builds authority',
          'Behind-the-scenes posts humanize your brand',
          'Industry commentary positions you as a thought leader'
        ]
      }
    });

  } catch (error) {
    console.error('Content ideas error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate content ideas'
    });
  }
});

// Helper functions
async function generateContentSuggestion(topic) {
  try {
    const prompt = `Create a brief LinkedIn post idea about "${topic.topic}". Include:
    1. A compelling hook
    2. Key points to cover
    3. A call-to-action
    Keep it under 100 words.`;
    
    const suggestion = await openaiService.generateText(prompt, {
      maxTokens: 150,
      temperature: 0.8
    });
    
    return suggestion;
  } catch (error) {
    return `Share your thoughts on ${topic.topic} and how it impacts your industry.`;
  }
}

function calculateAverageGrowth(trends) {
  const growthValues = trends.map(trend => 
    parseInt(trend.growth.replace('%', '').replace('+', ''))
  );
  const average = growthValues.reduce((sum, val) => sum + val, 0) / growthValues.length;
  return `+${average.toFixed(1)}%`;
}

function getTopCategories(trends) {
  const categories = {};
  trends.forEach(trend => {
    categories[trend.category] = (categories[trend.category] || 0) + 1;
  });
  
  return Object.entries(categories)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([category, count]) => ({ category, count }));
}

function getEmergingTopics(trends) {
  return trends
    .filter(trend => parseInt(trend.growth.replace('%', '').replace('+', '')) > 40)
    .slice(0, 3)
    .map(trend => trend.topic);
}

function generateTrendRecommendations(trends, industry) {
  const recommendations = [
    `Focus on ${trends[0]?.topic} - it's showing ${trends[0]?.growth} growth`,
    'Create content around trending hashtags to increase visibility',
    'Engage with trending topics early to establish thought leadership'
  ];
  
  if (industry !== 'general') {
    recommendations.push(`Consider cross-industry trends that relate to ${industry}`);
  }
  
  return recommendations;
}

function generateFallbackHashtags(topic, count) {
  const baseHashtags = [
    { hashtag: '#LinkedIn', volume: 'high', relevance: 8 },
    { hashtag: '#Business', volume: 'high', relevance: 7 },
    { hashtag: '#Professional', volume: 'medium', relevance: 6 },
    { hashtag: '#Career', volume: 'medium', relevance: 7 },
    { hashtag: '#Growth', volume: 'medium', relevance: 8 },
    { hashtag: '#Success', volume: 'medium', relevance: 6 },
    { hashtag: '#Leadership', volume: 'medium', relevance: 8 },
    { hashtag: '#Innovation', volume: 'medium', relevance: 7 },
    { hashtag: '#Networking', volume: 'low', relevance: 6 },
    { hashtag: '#Inspiration', volume: 'medium', relevance: 5 }
  ];
  
  // Add topic-specific hashtags
  const topicWords = topic.toLowerCase().split(' ');
  topicWords.forEach(word => {
    if (word.length > 3) {
      baseHashtags.push({
        hashtag: `#${word.charAt(0).toUpperCase() + word.slice(1)}`,
        volume: 'low',
        relevance: 9
      });
    }
  });
  
  return baseHashtags.slice(0, count);
}

module.exports = router;