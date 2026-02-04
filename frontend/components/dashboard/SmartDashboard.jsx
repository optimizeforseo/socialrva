"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PerformanceMetrics from './PerformanceMetrics';
import TrendingTopics from './TrendingTopics';
import QuickActionsHub from './QuickActionsHub';
import AIAssistantChat from './AIAssistantChat';

export default function SmartDashboard({ user }) {
  const [dashboardData, setDashboardData] = useState({
    metrics: null,
    trends: null,
    loading: true
  });

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }));
      
      // Fetch dashboard data
      const [metricsRes, trendsRes] = await Promise.all([
        fetch(`/api/analytics/metrics?userId=${user?.id}`),
        fetch(`/api/research/trends?industry=${user?.industry || 'general'}`)
      ]);

      const metrics = await metricsRes.json();
      const trends = await trendsRes.json();

      setDashboardData({
        metrics: metrics.data,
        trends: trends.data,
        loading: false
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  if (dashboardData.loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your personalized dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Smart Dashboard</h1>
            <p className="text-gray-400">AI-powered insights for your content strategy</p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              onClick={loadDashboardData}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Performance & Trends */}
          <div className="lg:col-span-2 space-y-6">
            {/* Performance Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PerformanceMetrics 
                data={dashboardData.metrics} 
                user={user}
              />
            </motion.div>

            {/* Trending Topics */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <TrendingTopics 
                data={dashboardData.trends}
                onTopicSelect={(topic) => {
                  // Navigate to create page with pre-filled topic
                  window.location.href = `/create-ai?topic=${encodeURIComponent(topic)}`;
                }}
              />
            </motion.div>

            {/* Quick Actions Hub */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <QuickActionsHub user={user} />
            </motion.div>
          </div>

          {/* Right Column - AI Assistant */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <AIAssistantChat user={user} />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}