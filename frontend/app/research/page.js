"use client";

import { useState, useEffect } from 'react';
import AppLayout from '../../components/layout/AppLayout';

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState('trends');
  const [trends, setTrends] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [contentIdeas, setContentIdeas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTopic, setSearchTopic] = useState('');

  const tabs = [
    { id: 'trends', label: 'Trending Topics', icon: '🔥' },
    { id: 'hashtags', label: 'Hashtag Research', icon: '#️⃣' },
    { id: 'ideas', label: 'Content Ideas', icon: '💡' },
    { id: 'competitors', label: 'Competitor Analysis', icon: '🎯' }
  ];

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/research/trends');
      const data = await response.json();
      if (data.success) {
        setTrends(data.data.trends);
      }
    } catch (error) {
      console.error('Failed to fetch trends:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHashtags = async (topic) => {
    if (!topic.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/research/hashtags?topic=${encodeURIComponent(topic)}`);
      const data = await response.json();
      if (data.success) {
        setHashtags(data.data.hashtags);
      }
    } catch (error) {
      console.error('Failed to fetch hashtags:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchContentIdeas = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/research/content-ideas');
      const data = await response.json();
      if (data.success) {
        setContentIdeas(data.data.ideas);
      }
    } catch (error) {
      console.error('Failed to fetch content ideas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'trends') {
      fetchTrends();
    } else if (activeTab === 'ideas') {
      fetchContentIdeas();
    }
  }, [activeTab]);

  return (
    <AppLayout>
      <div className="min-h-screen bg-slate-900 text-white">
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Research Hub</h1>
              <p className="text-gray-400">Discover trends, hashtags, and content opportunities</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-4 border-b border-slate-700">
          <div className="flex space-x-1 bg-slate-800 rounded-lg p-1 max-w-2xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Trending Topics */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Trending Topics</h2>
                <button 
                  onClick={fetchTrends}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                >
                  Refresh Trends
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading trending topics...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {trends.map((trend) => (
                    <div key={trend.id} className="bg-slate-800 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-2">{trend.topic}</h3>
                          <p className="text-gray-400 text-sm">{trend.description}</p>
                        </div>
                        <div className="text-green-400 text-sm font-medium">{trend.growth}</div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-400 mb-4">
                        <span>💬 {trend.engagement.toLocaleString()}</span>
                        <span>📊 Score: {trend.trendScore}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {trend.hashtags.slice(0, 4).map((hashtag, idx) => (
                          <span key={idx} className="px-2 py-1 bg-slate-700 text-blue-400 text-xs rounded">
                            {hashtag}
                          </span>
                        ))}
                      </div>
                      
                      <button 
                        onClick={() => window.location.href = `/create-ai?topic=${encodeURIComponent(trend.topic)}`}
                        className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                      >
                        Create Content
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Hashtag Research */}
          {activeTab === 'hashtags' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold mb-4">Hashtag Research</h2>
                <div className="flex space-x-3 max-w-2xl">
                  <input
                    type="text"
                    value={searchTopic}
                    onChange={(e) => setSearchTopic(e.target.value)}
                    placeholder="Enter topic to research hashtags..."
                    className="flex-1 bg-slate-800 border border-slate-600 rounded-lg px-4 py-2 text-white"
                    onKeyPress={(e) => e.key === 'Enter' && fetchHashtags(searchTopic)}
                  />
                  <button 
                    onClick={() => fetchHashtags(searchTopic)}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Research
                  </button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Researching hashtags...</p>
                </div>
              ) : hashtags.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {hashtags.map((hashtag, idx) => (
                    <div key={idx} className="bg-slate-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-blue-400 font-medium">{hashtag.hashtag}</span>
                        <span className={`px-2 py-1 text-xs rounded ${
                          hashtag.volume === 'high' ? 'bg-red-600' :
                          hashtag.volume === 'medium' ? 'bg-yellow-600' : 'bg-green-600'
                        }`}>
                          {hashtag.volume}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Relevance: {hashtag.relevance}/10
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Enter a topic to research hashtags
                </div>
              )}
            </div>
          )}

          {/* Content Ideas */}
          {activeTab === 'ideas' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Content Ideas</h2>
                <button 
                  onClick={fetchContentIdeas}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                >
                  Generate New Ideas
                </button>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-400">Generating content ideas...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {contentIdeas.map((idea) => (
                    <div key={idea.id} className="bg-slate-800 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-white mb-2">{idea.title}</h3>
                          <p className="text-gray-400 mb-3">{idea.description}</p>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
                            <span>📊 {idea.estimatedEngagement}</span>
                            <span>⏱️ {idea.timeToCreate}</span>
                            <span>🎯 {idea.difficulty}</span>
                          </div>
                          
                          <div className="text-sm text-gray-300 mb-3">
                            <strong>Format:</strong> {idea.suggestedFormat}
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {idea.hashtags.map((hashtag, idx) => (
                              <span key={idx} className="px-2 py-1 bg-slate-700 text-blue-400 text-xs rounded">
                                {hashtag}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <button 
                          onClick={() => window.location.href = `/create-ai?idea=${encodeURIComponent(idea.title)}`}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm"
                        >
                          Create
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Competitor Analysis */}
          {activeTab === 'competitors' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Competitor Analysis</h3>
              <p className="text-gray-400 mb-4">Coming soon! Track competitor performance and strategies.</p>
              <button className="px-6 py-2 bg-gray-600 text-gray-300 rounded-lg cursor-not-allowed">
                Coming Soon
              </button>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}