"use client";

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function PerformanceMetrics({ data, user }) {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeMetric, setActiveMetric] = useState('engagement');

  // Mock data - replace with real data from your API
  const mockData = {
    engagement: [
      { date: '2024-01-01', value: 120, previous: 100 },
      { date: '2024-01-02', value: 150, previous: 120 },
      { date: '2024-01-03', value: 180, previous: 140 },
      { date: '2024-01-04', value: 200, previous: 160 },
      { date: '2024-01-05', value: 170, previous: 150 },
      { date: '2024-01-06', value: 220, previous: 180 },
      { date: '2024-01-07', value: 250, previous: 200 },
    ],
    followers: [
      { date: '2024-01-01', value: 1200, growth: 20 },
      { date: '2024-01-02', value: 1220, growth: 25 },
      { date: '2024-01-03', value: 1245, growth: 30 },
      { date: '2024-01-04', value: 1275, growth: 35 },
      { date: '2024-01-05', value: 1310, growth: 28 },
      { date: '2024-01-06', value: 1338, growth: 32 },
      { date: '2024-01-07', value: 1370, growth: 40 },
    ]
  };

  const metrics = [
    {
      id: 'engagement',
      label: 'Engagement Rate',
      value: '4.2%',
      change: '+12%',
      trend: 'up',
      icon: '❤️',
      color: 'text-red-400'
    },
    {
      id: 'reach',
      label: 'Total Reach',
      value: '12.5K',
      change: '+8%',
      trend: 'up',
      icon: '👁️',
      color: 'text-blue-400'
    },
    {
      id: 'followers',
      label: 'Followers',
      value: '1,370',
      change: '+40',
      trend: 'up',
      icon: '👥',
      color: 'text-green-400'
    },
    {
      id: 'posts',
      label: 'Posts This Week',
      value: '12',
      change: '+3',
      trend: 'up',
      icon: '📝',
      color: 'text-purple-400'
    }
  ];

  const timeRanges = [
    { id: '7d', label: '7 Days' },
    { id: '30d', label: '30 Days' },
    { id: '90d', label: '90 Days' }
  ];

  return (
    <div className="bg-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Performance Overview</h2>
          <p className="text-gray-400">Real-time analytics and insights</p>
        </div>
        
        {/* Time Range Selector */}
        <div className="flex items-center space-x-1 bg-slate-700 rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-3 py-1 rounded-md text-sm transition-all ${
                timeRange === range.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((metric) => (
          <div
            key={metric.id}
            onClick={() => setActiveMetric(metric.id)}
            className={`p-4 rounded-lg cursor-pointer transition-all ${
              activeMetric === metric.id
                ? 'bg-slate-700 border border-blue-500'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl">{metric.icon}</span>
              <div className={`flex items-center space-x-1 text-sm ${
                metric.trend === 'up' ? 'text-green-400' : 'text-red-400'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d={metric.trend === 'up' ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"} />
                </svg>
                <span>{metric.change}</span>
              </div>
            </div>
            <div className="text-2xl font-bold text-white mb-1">{metric.value}</div>
            <div className="text-sm text-gray-400">{metric.label}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-slate-700 rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {metrics.find(m => m.id === activeMetric)?.label} Trend
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              <span>Previous</span>
            </div>
          </div>
        </div>
        
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData[activeMetric] || mockData.engagement}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
              {mockData[activeMetric]?.[0]?.previous && (
                <Line 
                  type="monotone" 
                  dataKey="previous" 
                  stroke="#6B7280" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-lg border border-purple-500/30">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white mb-1">AI Insight</h4>
            <p className="text-sm text-gray-300">
              Your engagement rate increased by 12% this week! Posts with images perform 40% better. 
              Consider posting between 9-11 AM for optimal reach.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}