"use client";

import { useState, useEffect } from 'react';

export default function TrendingTopics({ data, onTopicSelect }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [trendingData, setTrendingData] = useState([]);

  // Mock trending topics data - replace with real API data
  const mockTrends = [
    {
      id: 1,
      topic: "AI in Workplace",
      category: "technology",
      engagement: 15420,
      growth: "+45%",
      hashtags: ["#AI", "#FutureOfWork", "#Technology"],
      description: "Discussions about AI integration in modern workplaces",
      trendScore: 95
    },
    {
      id: 2,
      topic: "Remote Work Culture",
      category: "business",
      engagement: 12800,
      growth: "+32%",
      hashtags: ["#RemoteWork", "#WorkCulture", "#Productivity"],
      description: "Best practices for remote team management",
      trendScore: 88
    },
    {
      id: 3,
      topic: "Sustainable Business",
      category: "sustainability",
      engagement: 9600,
      growth: "+28%",
      hashtags: ["#Sustainability", "#GreenBusiness", "#ESG"],
      description: "Environmental responsibility in business operations",
      trendScore: 82
    },
    {
      id: 4,
      topic: "Personal Branding",
      category: "marketing",
      engagement: 11200,
      growth: "+38%",
      hashtags: ["#PersonalBrand", "#LinkedIn", "#Networking"],
      description: "Building authentic professional presence online",
      trendScore: 90
    },
    {
      id: 5,
      topic: "Data Privacy",
      category: "technology",
      engagement: 8900,
      growth: "+25%",
      hashtags: ["#DataPrivacy", "#Cybersecurity", "#GDPR"],
      description: "Privacy concerns in digital transformation",
      trendScore: 78
    }
  ];

  const categories = [
    { id: 'all', label: 'All Topics', icon: '🌐' },
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'business', label: 'Business', icon: '💼' },
    { id: 'marketing', label: 'Marketing', icon: '📈' },
    { id: 'sustainability', label: 'Sustainability', icon: '🌱' }
  ];

  useEffect(() => {
    // Filter trends based on selected category
    const filtered = selectedCategory === 'all' 
      ? mockTrends 
      : mockTrends.filter(trend => trend.category === selectedCategory);
    
    setTrendingData(filtered.sort((a, b) => b.trendScore - a.trendScore));
  }, [selectedCategory]);

  const getTrendIcon = (growth) => {
    const growthNum = parseInt(growth.replace('%', '').replace('+', ''));
    if (growthNum >= 40) return '🔥';
    if (growthNum >= 30) return '📈';
    if (growthNum >= 20) return '⬆️';
    return '📊';
  };

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Trending Topics</h2>
          <p className="text-gray-400">What's hot in your industry right now</p>
        </div>
        
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm flex items-center space-x-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Refresh</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="flex items-center space-x-2 mb-6 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-700 text-gray-400 hover:text-white hover:bg-slate-600'
            }`}
          >
            <span>{category.icon}</span>
            <span>{category.label}</span>
          </button>
        ))}
      </div>

      {/* Trending Topics List */}
      <div className="space-y-4">
        {trendingData.map((trend, index) => (
          <div
            key={trend.id}
            onClick={() => onTopicSelect(trend.topic)}
            className="p-4 bg-slate-700 rounded-lg hover:bg-slate-600 cursor-pointer transition-all group"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getTrendIcon(trend.growth)}</span>
                    <span className="text-sm text-gray-400">#{index + 1}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {trend.topic}
                  </h3>
                  <div className="flex items-center space-x-1 text-green-400 text-sm">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>{trend.growth}</span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mb-3">{trend.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{trend.engagement.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span>Score: {trend.trendScore}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {trend.hashtags.slice(0, 3).map((hashtag, idx) => (
                      <span key={idx} className="px-2 py-1 bg-slate-600 text-blue-400 text-xs rounded">
                        {hashtag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="ml-4 flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTopicSelect(trend.topic);
                  }}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                >
                  Create Post
                </button>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Trend Prediction */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-lg border border-green-500/30">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">AI Trend Prediction</h4>
            <p className="text-sm text-gray-300">
              "Quantum Computing" is predicted to trend next week. Consider creating content about quantum applications in business to get ahead of the curve.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}