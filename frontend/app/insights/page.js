"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icon';
import { Badge } from '../../components/ui/Badge';
import AnimatedIcon from '../../components/icons/AnimatedIcon';

export default function InsightsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const insights = [
    {
      id: 1,
      title: "Peak Engagement Hours",
      description: "Your audience is most active between 9-11 AM and 6-8 PM IST",
      type: "timing",
      impact: "high",
      recommendation: "Schedule your posts during these peak hours for maximum visibility",
      icon: "clock",
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      title: "Content Performance",
      description: "Posts with questions get 40% more engagement than statements",
      type: "content",
      impact: "medium",
      recommendation: "Include thought-provoking questions in your posts",
      icon: "message-circle",
      color: "from-blue-600 to-blue-700"
    },
    {
      id: 3,
      title: "Hashtag Optimization",
      description: "Using 3-5 relevant hashtags increases reach by 25%",
      type: "hashtags",
      impact: "medium",
      recommendation: "Focus on quality over quantity for hashtag usage",
      icon: "hash",
      color: "from-blue-400 to-blue-500"
    },
    {
      id: 4,
      title: "Audience Growth",
      description: "Your follower growth rate is 15% above industry average",
      type: "growth",
      impact: "high",
      recommendation: "Continue your current content strategy",
      icon: "trending-up",
      color: "from-blue-500 to-indigo-600"
    }
  ];

  const aiPredictions = [
    {
      title: "Next Viral Post Prediction",
      confidence: 87,
      suggestion: "Tech career advice posts perform 3x better on Tuesdays",
      icon: "zap"
    },
    {
      title: "Optimal Posting Frequency",
      confidence: 92,
      suggestion: "Post 4-5 times per week for maximum engagement",
      icon: "calendar"
    },
    {
      title: "Content Gap Analysis",
      confidence: 78,
      suggestion: "Your audience wants more content about AI and automation",
      icon: "target"
    }
  ];

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-blue-300 bg-blue-500/20 border-blue-500/30';
      case 'medium': return 'text-blue-400 bg-blue-600/20 border-blue-600/30';
      case 'low': return 'text-blue-500 bg-blue-700/20 border-blue-700/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-4"
          >
            <Icon name="brain" size={64} className="text-blue-500" />
          </motion.div>
          <p className="text-gray-400 text-lg">Analyzing your content insights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
          className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl"
              >
                <Icon name="brain" size={32} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">AI Insights</h1>
                <p className="text-gray-400">Intelligent recommendations powered by machine learning</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="success" pulse className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                <AnimatedIcon name="activity" animation="pulse" size={12} className="mr-1" />
                Live Analysis
              </Badge>
              
              <div className="flex bg-slate-900/50 rounded-lg p-1 backdrop-blur-sm border border-blue-500/30">
                {['7d', '30d', '90d'].map((period) => (
                  <button
                    key={period}
                    onClick={() => setSelectedTimeframe(period)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      selectedTimeframe === period
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Predictions Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <AnimatedIcon name="sparkles" animation="glow" size={24} className="mr-3" />
            AI Predictions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {aiPredictions.map((prediction, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="bg-slate-900/80 backdrop-blur-xl border-blue-500/30 hover:bg-slate-900/90 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                        <Icon name={prediction.icon} size={24} className="text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{prediction.confidence}%</div>
                        <div className="text-xs text-gray-400">Confidence</div>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-white mb-2">{prediction.title}</h3>
                    <p className="text-gray-300 text-sm">{prediction.suggestion}</p>
                    
                    {/* Confidence Bar */}
                    <div className="mt-4">
                      <div className="w-full bg-slate-800 rounded-full h-2">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${prediction.confidence}%` }}
                          transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Insights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <Icon name="lightbulb" size={24} className="mr-3 text-blue-400" />
            Content Insights
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <Card className="bg-slate-900/80 backdrop-blur-xl border-blue-500/30 hover:bg-slate-900/90 transition-all duration-300 h-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className={`w-12 h-12 bg-gradient-to-r ${insight.color} rounded-xl flex items-center justify-center shadow-lg`}
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Icon name={insight.icon} size={24} className="text-white" />
                        </motion.div>
                        <CardTitle className="text-white text-lg">{insight.title}</CardTitle>
                      </div>
                      <Badge 
                        className={`${getImpactColor(insight.impact)} border`}
                        size="sm"
                      >
                        {insight.impact} impact
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-300 mb-4 leading-relaxed">{insight.description}</p>
                    
                    <div className="bg-slate-800/30 rounded-lg p-4 border border-blue-500/20">
                      <div className="flex items-start space-x-2">
                        <Icon name="lightbulb" size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-blue-400 mb-1">Recommendation</p>
                          <p className="text-sm text-gray-300">{insight.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
              <Icon name="download" size={20} className="mr-2" />
              Export Insights Report
            </Button>
            <Button variant="outline" size="lg" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
              <Icon name="settings" size={20} className="mr-2" />
              Customize Analysis
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}