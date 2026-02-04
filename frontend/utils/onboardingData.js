// LinkedIn Topic Categories and Data for Onboarding

export const LINKEDIN_TOPICS = {
  'Business & Leadership': {
    icon: 'briefcase',
    color: 'from-blue-500 to-blue-600',
    topics: [
      'Entrepreneurship',
      'Leadership',
      'Business Strategy',
      'Management',
      'Startups',
      'Innovation',
      'Business Development',
      'Corporate Culture',
      'Team Building',
      'Decision Making'
    ]
  },
  'Technology': {
    icon: 'cpu',
    color: 'from-purple-500 to-purple-600',
    topics: [
      'Artificial Intelligence',
      'Machine Learning',
      'Software Development',
      'Data Science',
      'Cybersecurity',
      'Cloud Computing',
      'Web Development',
      'Mobile Development',
      'DevOps',
      'Blockchain'
    ]
  },
  'Marketing & Sales': {
    icon: 'trending-up',
    color: 'from-green-500 to-green-600',
    topics: [
      'Digital Marketing',
      'Content Marketing',
      'Social Media Marketing',
      'Sales Strategy',
      'Brand Management',
      'SEO/SEM',
      'Email Marketing',
      'Growth Hacking',
      'Customer Acquisition',
      'Marketing Analytics'
    ]
  },
  'Career Development': {
    icon: 'user-plus',
    color: 'from-orange-500 to-orange-600',
    topics: [
      'Professional Growth',
      'Networking',
      'Job Search',
      'Skills Development',
      'Industry Insights',
      'Career Transition',
      'Personal Branding',
      'Interview Tips',
      'Resume Writing',
      'Work-Life Balance'
    ]
  },
  'Finance & Business': {
    icon: 'dollar-sign',
    color: 'from-emerald-500 to-emerald-600',
    topics: [
      'Finance',
      'Investment',
      'Banking',
      'Accounting',
      'Financial Planning',
      'Cryptocurrency',
      'Stock Market',
      'Business Finance',
      'Risk Management',
      'Economic Trends'
    ]
  },
  'Industry Specific': {
    icon: 'building',
    color: 'from-indigo-500 to-indigo-600',
    topics: [
      'Healthcare',
      'Education',
      'Real Estate',
      'Manufacturing',
      'Retail',
      'Consulting',
      'Legal',
      'Media & Entertainment',
      'Non-Profit',
      'Government'
    ]
  }
};

export const CONTENT_PREFERENCES = {
  contentTypes: [
    {
      id: 'posts',
      title: 'LinkedIn Posts',
      description: 'Regular text posts with insights',
      icon: 'file-text',
      popular: true
    },
    {
      id: 'articles',
      title: 'Long-form Articles',
      description: 'Detailed articles on your expertise',
      icon: 'book-open',
      popular: false
    },
    {
      id: 'polls',
      title: 'Polls & Questions',
      description: 'Engage audience with interactive content',
      icon: 'bar-chart-3',
      popular: true
    },
    {
      id: 'carousel',
      title: 'Carousel Posts',
      description: 'Multi-slide visual content',
      icon: 'images',
      popular: true
    },
    {
      id: 'video',
      title: 'Video Content',
      description: 'Video posts and stories',
      icon: 'video',
      popular: false
    },
    {
      id: 'infographics',
      title: 'Infographics',
      description: 'Visual data representation',
      icon: 'pie-chart',
      popular: false
    }
  ],
  
  postingFrequency: [
    {
      id: 'daily',
      title: 'Daily',
      description: '1 post per day',
      recommended: false
    },
    {
      id: 'alternate',
      title: 'Every Other Day',
      description: '3-4 posts per week',
      recommended: true
    },
    {
      id: 'weekly',
      title: 'Weekly',
      description: '1-2 posts per week',
      recommended: false
    },
    {
      id: 'custom',
      title: 'Custom Schedule',
      description: 'Set your own frequency',
      recommended: false
    }
  ],

  contentTone: [
    {
      id: 'professional',
      title: 'Professional',
      description: 'Formal, business-focused tone',
      example: 'Industry insights and professional advice'
    },
    {
      id: 'conversational',
      title: 'Conversational',
      description: 'Friendly, approachable tone',
      example: 'Sharing experiences and lessons learned'
    },
    {
      id: 'thought-leader',
      title: 'Thought Leadership',
      description: 'Authoritative, expert perspective',
      example: 'Industry predictions and strategic insights'
    },
    {
      id: 'storytelling',
      title: 'Storytelling',
      description: 'Narrative-driven, personal stories',
      example: 'Career journey and personal experiences'
    }
  ]
};

export const AI_PERSONALIZATION_STEPS = [
  {
    id: 'profile-analysis',
    title: 'LinkedIn Profile Analysis',
    description: 'AI analyzes your LinkedIn profile for insights',
    duration: 3000,
    icon: 'user-search'
  },
  {
    id: 'content-analysis',
    title: 'Content History Review',
    description: 'Reviewing your past posts and engagement',
    duration: 4000,
    icon: 'file-search'
  },
  {
    id: 'audience-analysis',
    title: 'Audience Insights',
    description: 'Understanding your network and followers',
    duration: 3500,
    icon: 'users'
  },
  {
    id: 'topic-matching',
    title: 'Topic Personalization',
    description: 'Matching topics with your expertise',
    duration: 2500,
    icon: 'brain'
  },
  {
    id: 'strategy-creation',
    title: 'Content Strategy Creation',
    description: 'Building your personalized content plan',
    duration: 4500,
    icon: 'target'
  }
];

export const DASHBOARD_FEATURES = [
  {
    id: 'content-calendar',
    title: 'Content Calendar',
    description: 'Plan and schedule your posts',
    icon: 'calendar',
    preview: 'Next 7 days planned with AI-generated content'
  },
  {
    id: 'analytics',
    title: 'Performance Analytics',
    description: 'Track engagement and growth',
    icon: 'bar-chart-3',
    preview: '↗️ 25% increase in engagement this week'
  },
  {
    id: 'ai-assistant',
    title: 'AI Content Assistant',
    description: 'Generate content ideas instantly',
    icon: 'sparkles',
    preview: '12 new content ideas ready for you'
  },
  {
    id: 'audience-insights',
    title: 'Audience Insights',
    description: 'Understand your followers better',
    icon: 'users',
    preview: 'Your audience is most active at 9 AM'
  },
  {
    id: 'competitor-analysis',
    title: 'Competitor Tracking',
    description: 'Monitor industry leaders',
    icon: 'eye',
    preview: 'Tracking 5 competitors in your niche'
  },
  {
    id: 'growth-recommendations',
    title: 'Growth Recommendations',
    description: 'AI-powered growth suggestions',
    icon: 'trending-up',
    preview: 'Try posting carousel content for 40% more engagement'
  }
];

// Helper functions
export const getTopicsByCategory = (category) => {
  return LINKEDIN_TOPICS[category]?.topics || [];
};

export const getAllTopics = () => {
  return Object.values(LINKEDIN_TOPICS).flatMap(category => category.topics);
};

export const searchTopics = (query) => {
  const allTopics = getAllTopics();
  return allTopics.filter(topic => 
    topic.toLowerCase().includes(query.toLowerCase())
  );
};

export const getRecommendedTopics = (jobTitle, industry) => {
  // Simple recommendation logic based on job title and industry
  const recommendations = [];
  
  if (jobTitle?.toLowerCase().includes('engineer') || jobTitle?.toLowerCase().includes('developer')) {
    recommendations.push(...LINKEDIN_TOPICS['Technology'].topics.slice(0, 5));
  }
  
  if (jobTitle?.toLowerCase().includes('manager') || jobTitle?.toLowerCase().includes('lead')) {
    recommendations.push(...LINKEDIN_TOPICS['Business & Leadership'].topics.slice(0, 3));
  }
  
  if (jobTitle?.toLowerCase().includes('marketing') || jobTitle?.toLowerCase().includes('sales')) {
    recommendations.push(...LINKEDIN_TOPICS['Marketing & Sales'].topics.slice(0, 4));
  }
  
  // Add some general career development topics
  recommendations.push(...LINKEDIN_TOPICS['Career Development'].topics.slice(0, 2));
  
  return [...new Set(recommendations)]; // Remove duplicates
};