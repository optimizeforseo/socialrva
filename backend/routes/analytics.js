const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const AIContent = require('../models/AIContent');
const User = require('../models/User');

// Get performance metrics
router.get('/metrics', protect, async (req, res) => {
  try {
    const { timeRange = '7d' } = req.query;
    const userId = req.user.id;

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    // Get user's content for the time range
    const content = await AIContent.find({
      userId,
      createdAt: { $gte: startDate }
    }).sort({ createdAt: -1 });

    // Calculate metrics
    const totalPosts = content.length;
    const totalEngagement = content.reduce((sum, post) => sum + (post.engagement?.total || 0), 0);
    const avgEngagement = totalPosts > 0 ? totalEngagement / totalPosts : 0;
    const totalReach = content.reduce((sum, post) => sum + (post.reach || 0), 0);

    // Get previous period for comparison
    const prevStartDate = new Date(startDate.getTime() - (now.getTime() - startDate.getTime()));
    const prevContent = await AIContent.find({
      userId,
      createdAt: { $gte: prevStartDate, $lt: startDate }
    });

    const prevTotalPosts = prevContent.length;
    const prevTotalEngagement = prevContent.reduce((sum, post) => sum + (post.engagement?.total || 0), 0);
    const prevAvgEngagement = prevTotalPosts > 0 ? prevTotalEngagement / prevTotalPosts : 0;
    const prevTotalReach = prevContent.reduce((sum, post) => sum + (post.reach || 0), 0);

    // Calculate percentage changes
    const engagementChange = prevAvgEngagement > 0 
      ? ((avgEngagement - prevAvgEngagement) / prevAvgEngagement * 100).toFixed(1)
      : 0;
    const reachChange = prevTotalReach > 0 
      ? ((totalReach - prevTotalReach) / prevTotalReach * 100).toFixed(1)
      : 0;
    const postsChange = prevTotalPosts > 0 
      ? ((totalPosts - prevTotalPosts) / prevTotalPosts * 100).toFixed(1)
      : 0;

    // Generate daily breakdown for charts
    const dailyData = [];
    for (let d = new Date(startDate); d <= now; d.setDate(d.getDate() + 1)) {
      const dayStart = new Date(d);
      const dayEnd = new Date(d.getTime() + 24 * 60 * 60 * 1000);
      
      const dayContent = content.filter(post => 
        post.createdAt >= dayStart && post.createdAt < dayEnd
      );
      
      const dayEngagement = dayContent.reduce((sum, post) => sum + (post.engagement?.total || 0), 0);
      const dayReach = dayContent.reduce((sum, post) => sum + (post.reach || 0), 0);
      
      dailyData.push({
        date: dayStart.toISOString().split('T')[0],
        engagement: dayEngagement,
        reach: dayReach,
        posts: dayContent.length
      });
    }

    // Get user's follower count (mock data for now)
    const user = await User.findById(userId);
    const followerCount = user.linkedinData?.followerCount || 1370;

    const metrics = {
      overview: {
        engagementRate: `${avgEngagement.toFixed(1)}%`,
        engagementChange: `${engagementChange >= 0 ? '+' : ''}${engagementChange}%`,
        totalReach: totalReach.toLocaleString(),
        reachChange: `${reachChange >= 0 ? '+' : ''}${reachChange}%`,
        followers: followerCount.toLocaleString(),
        followersChange: '+40', // Mock data
        totalPosts: totalPosts,
        postsChange: `${postsChange >= 0 ? '+' : ''}${postsChange}`
      },
      dailyData,
      insights: generateInsights(content, engagementChange, reachChange),
      optimalTiming: calculateOptimalTiming(content),
      topPerformingContent: getTopPerformingContent(content)
    };

    res.json({
      success: true,
      data: metrics
    });

  } catch (error) {
    console.error('Analytics metrics error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics metrics'
    });
  }
});

// Get competitor analysis
router.get('/competitors', protect, async (req, res) => {
  try {
    const { industry = 'general' } = req.query;
    
    // Mock competitor data - in real app, this would come from social media APIs
    const competitors = [
      {
        name: 'Industry Leader A',
        followers: 25000,
        avgEngagement: 5.2,
        postFrequency: 'Daily',
        topHashtags: ['#Leadership', '#Innovation', '#Growth'],
        recentGrowth: '+15%'
      },
      {
        name: 'Thought Leader B',
        followers: 18500,
        avgEngagement: 7.8,
        postFrequency: '3x/week',
        topHashtags: ['#TechTrends', '#AI', '#Future'],
        recentGrowth: '+22%'
      },
      {
        name: 'Expert C',
        followers: 12000,
        avgEngagement: 6.1,
        postFrequency: '5x/week',
        topHashtags: ['#Business', '#Strategy', '#Success'],
        recentGrowth: '+8%'
      }
    ];

    res.json({
      success: true,
      data: {
        competitors,
        industryBenchmarks: {
          avgEngagementRate: 4.5,
          avgPostFrequency: '4x/week',
          topIndustryHashtags: ['#Leadership', '#Innovation', '#Business', '#Growth', '#Success']
        },
        recommendations: [
          'Your engagement rate is above industry average - keep it up!',
          'Consider posting more frequently to match top performers',
          'Use trending hashtags like #Innovation and #Leadership'
        ]
      }
    });

  } catch (error) {
    console.error('Competitor analysis error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch competitor analysis'
    });
  }
});

// Helper functions
function generateInsights(content, engagementChange, reachChange) {
  const insights = [];
  
  if (engagementChange > 10) {
    insights.push('Your engagement rate increased significantly! Posts with images perform 40% better.');
  } else if (engagementChange < -10) {
    insights.push('Engagement is down. Try posting more personal stories and asking questions.');
  }
  
  if (reachChange > 15) {
    insights.push('Great reach improvement! Your content is being discovered by more people.');
  }
  
  // Analyze content types
  const imageContent = content.filter(post => post.contentType === 'image').length;
  const textContent = content.filter(post => post.contentType === 'text').length;
  
  if (imageContent > textContent) {
    insights.push('Visual content is working well for you. Continue using images and carousels.');
  }
  
  insights.push('Consider posting between 9-11 AM for optimal reach.');
  
  return insights;
}

function calculateOptimalTiming(content) {
  // Analyze posting times and engagement
  const hourlyData = {};
  
  content.forEach(post => {
    const hour = new Date(post.createdAt).getHours();
    if (!hourlyData[hour]) {
      hourlyData[hour] = { posts: 0, totalEngagement: 0 };
    }
    hourlyData[hour].posts++;
    hourlyData[hour].totalEngagement += post.engagement?.total || 0;
  });
  
  // Find best performing hours
  const bestHours = Object.entries(hourlyData)
    .map(([hour, data]) => ({
      hour: parseInt(hour),
      avgEngagement: data.totalEngagement / data.posts
    }))
    .sort((a, b) => b.avgEngagement - a.avgEngagement)
    .slice(0, 3);
  
  return {
    bestHours: bestHours.map(h => `${h.hour}:00`),
    recommendation: 'Post between 9-11 AM for best engagement'
  };
}

function getTopPerformingContent(content) {
  return content
    .sort((a, b) => (b.engagement?.total || 0) - (a.engagement?.total || 0))
    .slice(0, 5)
    .map(post => ({
      id: post._id,
      content: post.content.substring(0, 100) + '...',
      engagement: post.engagement?.total || 0,
      type: post.contentType,
      createdAt: post.createdAt
    }));
}

module.exports = router;