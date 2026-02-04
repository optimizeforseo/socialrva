"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Users,
  Target,
  Calendar,
  Award,
  BarChart3,
  Activity,
} from "lucide-react";

export default function ProfileAnalytics() {
  const [timeRange, setTimeRange] = useState("7days");
  const [selectedMetric, setSelectedMetric] = useState("all");
  const [linkedInData, setLinkedInData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isLiveData, setIsLiveData] = useState(false);

  // Fetch LinkedIn data on component mount
  useEffect(() => {
    fetchLinkedInStats();
  }, []);

  const fetchLinkedInStats = async () => {
    try {
      const accessToken = localStorage.getItem("linkedinAccessToken");
      const userId = localStorage.getItem("linkedinUserId");

      if (accessToken && userId) {
        const response = await fetch(
          `/api/linkedin/stats?accessToken=${encodeURIComponent(
            accessToken
          )}&userId=${encodeURIComponent(userId)}`
        );

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setLinkedInData(result.data);
            setIsLiveData(true);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching LinkedIn stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Mock data for engagement over time
  const engagementData = [
    { date: "Mon", views: 2400, likes: 400, comments: 240, shares: 120 },
    { date: "Tue", views: 1398, likes: 300, comments: 221, shares: 100 },
    { date: "Wed", views: 9800, likes: 800, comments: 229, shares: 200 },
    { date: "Thu", views: 3908, likes: 470, comments: 200, shares: 150 },
    { date: "Fri", views: 4800, likes: 600, comments: 281, shares: 180 },
    { date: "Sat", views: 3800, likes: 500, comments: 250, shares: 140 },
    { date: "Sun", views: 4300, likes: 550, comments: 210, shares: 160 },
  ];

  // Post performance data
  const postPerformanceData = [
    { name: "Post 1", engagement: 4000, reach: 2400 },
    { name: "Post 2", engagement: 3000, reach: 1398 },
    { name: "Post 3", engagement: 2000, reach: 9800 },
    { name: "Post 4", engagement: 2780, reach: 3908 },
    { name: "Post 5", engagement: 1890, reach: 4800 },
  ];

  // Content type distribution
  const contentTypeData = [
    { name: "Text Posts", value: 400, color: "#8b5cf6" },
    { name: "Images", value: 300, color: "#3b82f6" },
    { name: "Carousels", value: 200, color: "#10b981" },
    { name: "Videos", value: 100, color: "#f59e0b" },
  ];

  // Audience growth
  const audienceGrowthData = [
    { month: "Jan", followers: 1200 },
    { month: "Feb", followers: 1900 },
    { month: "Mar", followers: 2400 },
    { month: "Apr", followers: 3200 },
    { month: "May", followers: 4100 },
    { month: "Jun", followers: 5300 },
  ];

  // Stats cards data - use real LinkedIn data when available
  const getStatsCards = () => {
    const baseStats = [
      {
        title: "Total Impressions",
        value: linkedInData?.stats?.impressions
          ? linkedInData.stats.impressions.toLocaleString()
          : "124.5K",
        change: "+12.5%",
        trend: "up",
        icon: Eye,
        color: "from-blue-500 to-cyan-500",
        isDemo: !linkedInData?.stats?.impressions,
      },
      {
        title: "Engagement Rate",
        value: linkedInData?.stats?.engagementRate
          ? `${linkedInData.stats.engagementRate}%`
          : "8.4%",
        change: "+2.1%",
        trend: "up",
        icon: Heart,
        color: "from-purple-500 to-pink-500",
        isDemo: !linkedInData?.stats?.engagementRate,
      },
      {
        title: "Total Connections",
        value: linkedInData?.stats?.connections
          ? linkedInData.stats.connections.toLocaleString()
          : "5,342",
        change: "+18.2%",
        trend: "up",
        icon: Users,
        color: "from-green-500 to-emerald-500",
        isDemo: !linkedInData?.stats?.connections,
      },
      {
        title: "Profile Views",
        value: linkedInData?.stats?.profileViews
          ? linkedInData.stats.profileViews.toLocaleString()
          : "234",
        change: "-3.2%",
        trend: "down",
        icon: MessageCircle,
        color: "from-orange-500 to-red-500",
        isDemo: !linkedInData?.stats?.profileViews,
      },
    ];
    return baseStats;
  };

  const statsCards = getStatsCards();

  // Top performing posts
  const topPosts = [
    {
      id: 1,
      content: "The future of AI in content creation is here...",
      views: 12500,
      likes: 890,
      comments: 156,
      shares: 234,
      date: "2 days ago",
    },
    {
      id: 2,
      content: "5 strategies that transformed my LinkedIn presence...",
      views: 9800,
      likes: 720,
      comments: 98,
      shares: 187,
      date: "5 days ago",
    },
    {
      id: 3,
      content: "Why authenticity matters more than perfection...",
      views: 8200,
      likes: 650,
      comments: 87,
      shares: 145,
      date: "1 week ago",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
              Profile Analytics
            </h1>
            {loading ? (
              <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded-full animate-pulse">
                Loading...
              </span>
            ) : isLiveData ? (
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs rounded-full flex items-center space-x-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                <span>Live Data</span>
              </span>
            ) : (
              <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded-full flex items-center space-x-1">
                <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                <span>Demo Mode</span>
              </span>
            )}
          </div>
          <p className="text-slate-400 text-sm mt-1">
            {isLiveData
              ? `Showing data for ${
                  linkedInData?.profile?.firstName || "your"
                } ${linkedInData?.profile?.lastName || "profile"}`
              : "Track your LinkedIn performance and engagement metrics"}
          </p>
          {linkedInData?.note && (
            <div className="mt-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-300 text-xs flex items-start space-x-2">
                <span className="text-blue-400 mt-0.5">ℹ️</span>
                <span>
                  <strong>Note:</strong> LinkedIn's standard API only provides
                  connection count. Advanced metrics (impressions, engagement
                  rate, profile views) require Marketing API access.{" "}
                  <a
                    href="https://www.linkedin.com/help/linkedin/answer/a1339724"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Learn more
                  </a>
                </span>
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchLinkedInStats}
            disabled={loading}
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 disabled:opacity-50"
            title="Refresh LinkedIn data"
          >
            <Activity className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
            <option value="1year">Last year</option>
          </select>
          <a
            href="https://www.linkedin.com/analytics/"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
          >
            <BarChart3 className="w-4 h-4" />
            <span>View Full Analytics</span>
          </a>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105 relative"
            >
              {!stat.isDemo && isLiveData && (
                <div className="absolute top-3 right-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full block animate-pulse"></span>
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div
                  className={`flex items-center space-x-1 text-sm font-medium ${
                    stat.trend === "up" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <h3 className="text-slate-400 text-sm mb-1">{stat.title}</h3>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                {stat.isDemo && (
                  <span className="text-xs text-slate-500 italic">Demo</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Over Time */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span>Engagement Over Time</span>
                <span className="text-xs text-slate-500 font-normal">
                  (Demo)
                </span>
              </h3>
              <p className="text-slate-400 text-sm">
                Example data - Connect Marketing API for real metrics
              </p>
            </div>
            <Activity className="w-5 h-5 text-blue-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={engagementData}>
              <defs>
                <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="views"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorViews)"
              />
              <Area
                type="monotone"
                dataKey="likes"
                stroke="#8b5cf6"
                fillOpacity={1}
                fill="url(#colorLikes)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Content Type Distribution */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span>Content Type Distribution</span>
                <span className="text-xs text-slate-500 font-normal">
                  (Demo)
                </span>
              </h3>
              <p className="text-slate-400 text-sm">
                Example data - Visit LinkedIn for real breakdown
              </p>
            </div>
            <Target className="w-5 h-5 text-purple-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={contentTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {contentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Post Performance */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span>Post Performance</span>
                <span className="text-xs text-slate-500 font-normal">
                  (Demo)
                </span>
              </h3>
              <p className="text-slate-400 text-sm">
                Example data - Visit LinkedIn for real post analytics
              </p>
            </div>
            <BarChart3 className="w-5 h-5 text-green-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={postPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="engagement" fill="#10b981" radius={[8, 8, 0, 0]} />
              <Bar dataKey="reach" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Audience Growth */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <span>Audience Growth</span>
                <span className="text-xs text-slate-500 font-normal">
                  (Demo)
                </span>
              </h3>
              <p className="text-slate-400 text-sm">
                Example trend - Real connection count:{" "}
                {linkedInData?.stats?.connections?.toLocaleString() ||
                  "Login to see"}
              </p>
            </div>
            <Users className="w-5 h-5 text-cyan-400" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={audienceGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="followers"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ fill: "#06b6d4", r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Posts */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">
              Top Performing Posts
            </h3>
            <p className="text-slate-400 text-sm">
              Your best content from the selected period
            </p>
          </div>
          <Award className="w-5 h-5 text-yellow-400" />
        </div>
        <div className="space-y-4">
          {topPosts.map((post, index) => (
            <div
              key={post.id}
              className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm line-clamp-1">
                      {post.content}
                    </p>
                    <p className="text-slate-400 text-xs mt-1">{post.date}</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Eye className="w-4 h-4 text-blue-400" />
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {post.views.toLocaleString()}
                    </p>
                    <p className="text-slate-400 text-xs">Views</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-pink-400" />
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {post.likes}
                    </p>
                    <p className="text-slate-400 text-xs">Likes</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MessageCircle className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {post.comments}
                    </p>
                    <p className="text-slate-400 text-xs">Comments</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Share2 className="w-4 h-4 text-purple-400" />
                  <div>
                    <p className="text-white text-sm font-semibold">
                      {post.shares}
                    </p>
                    <p className="text-slate-400 text-xs">Shares</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Source Info */}
      {!isLiveData && (
        <div className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 rounded-xl p-6 border border-yellow-700/30">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-600/20 flex items-center justify-center flex-shrink-0">
              <Eye className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                📊 About This Data
              </h3>
              <p className="text-slate-300 text-sm mb-3">
                You're viewing <strong>demo analytics data</strong>. To see your
                real LinkedIn metrics:
              </p>
              <ol className="space-y-2 text-sm text-slate-300 mb-4">
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-400 font-bold">1.</span>
                  <span>
                    <strong>Login with LinkedIn</strong> to see your real
                    connection count
                  </span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-yellow-400 font-bold">2.</span>
                  <span>
                    For detailed analytics (impressions, engagement, views),
                    visit{" "}
                    <a
                      href="https://www.linkedin.com/analytics/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-yellow-400 hover:text-yellow-300 underline"
                    >
                      LinkedIn Analytics
                    </a>
                  </span>
                </li>
              </ol>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Connect LinkedIn
                </button>
                <a
                  href="https://www.linkedin.com/help/linkedin/answer/a1339724"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400 hover:text-yellow-300 text-sm underline"
                >
                  Learn about API limitations
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLiveData && (
        <div className="bg-gradient-to-br from-green-900/20 to-green-800/10 rounded-xl p-6 border border-green-700/30">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                ✅ Connected to LinkedIn
              </h3>
              <p className="text-slate-300 text-sm mb-3">
                Showing your real connection count:{" "}
                <strong className="text-green-400">
                  {linkedInData?.stats?.connections?.toLocaleString() ||
                    "Loading..."}
                </strong>
              </p>
              <p className="text-slate-400 text-xs mb-3">
                <strong>Note:</strong> Advanced metrics (impressions, engagement
                rate, profile views) require LinkedIn Marketing API access.
                These are shown as demo data for now.
              </p>
              <a
                href="https://www.linkedin.com/analytics/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-400 hover:text-green-300 text-sm underline"
              >
                View full analytics on LinkedIn →
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Insights & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-6 border border-blue-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Key Insights</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
              <p className="text-slate-300 text-sm">
                Your engagement rate increased by 12.5% this week
              </p>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
              <p className="text-slate-300 text-sm">
                Wednesday posts perform 40% better than other days
              </p>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
              <p className="text-slate-300 text-sm">
                Carousel posts generate 3x more engagement
              </p>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-6 border border-purple-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Recommendations
            </h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2"></div>
              <p className="text-slate-300 text-sm">
                Post between 9-11 AM for maximum reach
              </p>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2"></div>
              <p className="text-slate-300 text-sm">
                Include more visual content to boost engagement
              </p>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2"></div>
              <p className="text-slate-300 text-sm">
                Respond to comments within 2 hours for better visibility
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}