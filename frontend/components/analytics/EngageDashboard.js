"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Heart,
  MessageCircle,
  Share2,
  TrendingUp,
  TrendingDown,
  Eye,
  UserPlus,
  Clock,
  Target,
  Zap,
  Award,
  Activity,
  Bell,
  Filter,
  Search,
  MoreVertical,
  ExternalLink,
  ThumbsUp,
  Repeat,
  Send,
} from "lucide-react";

export default function EngageDashboard() {
  const [timeRange, setTimeRange] = useState("7days");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);

  // Mock LinkedIn Profile Data
  const profileData = {
    name: "John Doe",
    headline:
      "Digital Marketing Expert | Content Creator | LinkedIn Growth Specialist",
    followers: 12543,
    connections: 8234,
    profileViews: 2341,
    searchAppearances: 1876,
    postImpressions: 45678,
    avatar: null,
    engagementRate: 8.4,
    responseRate: 92,
  };

  // Mock Engagement Stats
  const engagementStats = [
    {
      id: 1,
      label: "Total Reactions",
      value: "3,456",
      change: "+12.5%",
      trend: "up",
      icon: Heart,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-500/10",
    },
    {
      id: 2,
      label: "Comments",
      value: "892",
      change: "+8.3%",
      trend: "up",
      icon: MessageCircle,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-500/10",
    },
    {
      id: 3,
      label: "Shares",
      value: "234",
      change: "+15.7%",
      trend: "up",
      icon: Share2,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-500/10",
    },
    {
      id: 4,
      label: "New Followers",
      value: "156",
      change: "-3.2%",
      trend: "down",
      icon: UserPlus,
      color: "from-purple-500 to-indigo-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  // Mock Recent Posts with Engagement
  const recentPosts = [
    {
      id: 1,
      content:
        "Just launched our new AI-powered content creation tool! 🚀 This changes everything...",
      timestamp: "2 hours ago",
      impressions: 5234,
      reactions: 342,
      comments: 67,
      shares: 45,
      engagementRate: 8.7,
      topReaction: "👍",
      status: "trending",
    },
    {
      id: 2,
      content:
        "5 proven strategies to boost your LinkedIn engagement in 2024. Thread 🧵",
      timestamp: "1 day ago",
      impressions: 8901,
      reactions: 567,
      comments: 123,
      shares: 89,
      engagementRate: 9.2,
      topReaction: "💡",
      status: "hot",
    },
    {
      id: 3,
      content:
        "Behind the scenes of building a SaaS product from scratch. Lessons learned...",
      timestamp: "3 days ago",
      impressions: 3456,
      reactions: 234,
      comments: 45,
      shares: 23,
      engagementRate: 7.1,
      topReaction: "❤️",
      status: "normal",
    },
    {
      id: 4,
      content:
        "The future of AI in content marketing is here. Here's what you need to know...",
      timestamp: "5 days ago",
      impressions: 6789,
      reactions: 445,
      comments: 89,
      shares: 67,
      engagementRate: 8.9,
      topReaction: "🔥",
      status: "hot",
    },
  ];

  // Mock Active Engagers
  const activeEngagers = [
    {
      id: 1,
      name: "Sarah Johnson",
      title: "Marketing Director",
      avatar: null,
      interactions: 45,
      lastEngaged: "2 hours ago",
      type: "frequent",
    },
    {
      id: 2,
      name: "Michael Chen",
      title: "Content Strategist",
      avatar: null,
      interactions: 38,
      lastEngaged: "5 hours ago",
      type: "frequent",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      title: "Social Media Manager",
      avatar: null,
      interactions: 32,
      lastEngaged: "1 day ago",
      type: "regular",
    },
    {
      id: 4,
      name: "David Kim",
      title: "Digital Marketing Lead",
      avatar: null,
      interactions: 28,
      lastEngaged: "1 day ago",
      type: "regular",
    },
  ];

  // Mock Engagement Timeline
  const engagementTimeline = [
    {
      id: 1,
      user: "Sarah Johnson",
      action: "commented on",
      post: "AI-powered content creation tool",
      time: "5 minutes ago",
      type: "comment",
    },
    {
      id: 2,
      user: "Michael Chen",
      action: "liked",
      post: "5 proven strategies to boost engagement",
      time: "15 minutes ago",
      type: "like",
    },
    {
      id: 3,
      user: "Emily Rodriguez",
      action: "shared",
      post: "Behind the scenes of building a SaaS",
      time: "1 hour ago",
      type: "share",
    },
    {
      id: 4,
      user: "David Kim",
      action: "commented on",
      post: "The future of AI in content marketing",
      time: "2 hours ago",
      type: "comment",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            Engagement Dashboard
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor your LinkedIn profile and post engagement in real-time
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-white px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="24hours">Last 24 hours</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="90days">Last 90 days</option>
          </select>
          <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2">
            <Bell className="w-4 h-4" />
            <span>Set Alerts</span>
          </button>
        </div>
      </div>

      {/* Profile Overview Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {profileData.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {profileData.name}
              </h2>
              <p className="text-slate-300 text-sm mt-1">
                {profileData.headline}
              </p>
              <div className="flex items-center space-x-4 mt-3">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <span className="text-white text-sm font-medium">
                    {profileData.followers.toLocaleString()} followers
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-green-400" />
                  <span className="text-white text-sm font-medium">
                    {profileData.connections.toLocaleString()} connections
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-2 justify-end mb-2">
              <Activity className="w-5 h-5 text-green-400" />
              <span className="text-2xl font-bold text-white">
                {profileData.engagementRate}%
              </span>
            </div>
            <p className="text-slate-400 text-sm">Engagement Rate</p>
            <div className="mt-3 flex items-center space-x-2 justify-end">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-white text-sm font-medium">
                {profileData.responseRate}% Response Rate
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Eye className="w-4 h-4 text-blue-400" />
              <span className="text-2xl font-bold text-white">
                {profileData.profileViews.toLocaleString()}
              </span>
            </div>
            <p className="text-slate-400 text-sm">Profile Views</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <Search className="w-4 h-4 text-purple-400" />
              <span className="text-2xl font-bold text-white">
                {profileData.searchAppearances.toLocaleString()}
              </span>
            </div>
            <p className="text-slate-400 text-sm">Search Appearances</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-1">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-2xl font-bold text-white">
                {profileData.postImpressions.toLocaleString()}
              </span>
            </div>
            <p className="text-slate-400 text-sm">Post Impressions</p>
          </div>
        </div>
      </div>

      {/* Engagement Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {engagementStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.id}
              className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 hover:scale-105"
            >
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
              <h3 className="text-slate-400 text-sm mb-1">{stat.label}</h3>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Posts with Engagement */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-400" />
                <span>Recent Posts Performance</span>
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Track engagement on your latest content
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white rounded-lg transition-all duration-200">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50 hover:border-slate-600 transition-all duration-200 cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {post.status === "trending" && (
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs font-medium rounded-full flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>Trending</span>
                        </span>
                      )}
                      {post.status === "hot" && (
                        <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full flex items-center space-x-1">
                          <Zap className="w-3 h-3" />
                          <span>Hot</span>
                        </span>
                      )}
                      <span className="text-slate-400 text-xs flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.timestamp}</span>
                      </span>
                    </div>
                    <p className="text-white text-sm line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                  <button className="p-2 text-slate-400 hover:text-white transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-5 gap-3 mt-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Eye className="w-4 h-4 text-blue-400" />
                      <span className="text-white text-sm font-semibold">
                        {post.impressions.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">Views</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Heart className="w-4 h-4 text-pink-400" />
                      <span className="text-white text-sm font-semibold">
                        {post.reactions}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">Reactions</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <MessageCircle className="w-4 h-4 text-green-400" />
                      <span className="text-white text-sm font-semibold">
                        {post.comments}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">Comments</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <Share2 className="w-4 h-4 text-purple-400" />
                      <span className="text-white text-sm font-semibold">
                        {post.shares}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">Shares</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <span className="text-xl">{post.topReaction}</span>
                      <span className="text-white text-sm font-semibold">
                        {post.engagementRate}%
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs">Engagement</p>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-700 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-medium rounded-lg transition-all duration-200 flex items-center space-x-1">
                      <ExternalLink className="w-3 h-3" />
                      <span>View on LinkedIn</span>
                    </button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white rounded transition-all duration-200">
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white rounded transition-all duration-200">
                      <MessageCircle className="w-3 h-3" />
                    </button>
                    <button className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-400 hover:text-white rounded transition-all duration-200">
                      <Send className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Active Engagers */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Award className="w-5 h-5 text-yellow-400" />
                <span>Top Engagers</span>
              </h3>
            </div>
            <div className="space-y-3">
              {activeEngagers.map((engager, index) => (
                <div
                  key={engager.id}
                  className="flex items-center space-x-3 p-3 bg-slate-800/50 rounded-lg hover:bg-slate-800 transition-all duration-200 cursor-pointer"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold">
                      {engager.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center text-xs font-bold text-slate-900">
                        {index + 1}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {engager.name}
                    </p>
                    <p className="text-slate-400 text-xs truncate">
                      {engager.title}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-semibold">
                      {engager.interactions}
                    </p>
                    <p className="text-slate-400 text-xs">interactions</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white rounded-lg text-sm font-medium transition-all duration-200">
              View All Engagers
            </button>
          </div>

          {/* Engagement Timeline */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 border border-slate-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>Live Activity</span>
              </h3>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div className="space-y-4">
              {engagementTimeline.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      activity.type === "comment"
                        ? "bg-blue-500/20"
                        : activity.type === "like"
                        ? "bg-pink-500/20"
                        : "bg-green-500/20"
                    }`}
                  >
                    {activity.type === "comment" && (
                      <MessageCircle className="w-4 h-4 text-blue-400" />
                    )}
                    {activity.type === "like" && (
                      <Heart className="w-4 h-4 text-pink-400" />
                    )}
                    {activity.type === "share" && (
                      <Share2 className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-slate-400">
                        {" "}
                        {activity.action}{" "}
                      </span>
                      <span className="font-medium">"{activity.post}"</span>
                    </p>
                    <p className="text-slate-400 text-xs mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Engagement Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-xl p-6 border border-blue-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              Engagement Insights
            </h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
              <p className="text-slate-300 text-sm">
                Your posts get 3x more engagement on Wednesday mornings
              </p>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
              <p className="text-slate-300 text-sm">
                Posts with questions get 45% more comments
              </p>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
              <p className="text-slate-300 text-sm">
                Your audience is most active between 9-11 AM
              </p>
            </li>
          </ul>
        </div>

        <div className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 rounded-xl p-6 border border-purple-700/50">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-600 flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Action Items</h3>
          </div>
          <ul className="space-y-3">
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2"></div>
              <p className="text-slate-300 text-sm">
                Reply to 12 pending comments to boost engagement
              </p>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2"></div>
              <p className="text-slate-300 text-sm">
                Connect with 5 new people who engaged with your posts
              </p>
            </li>
            <li className="flex items-start space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2"></div>
              <p className="text-slate-300 text-sm">
                Schedule your next post for optimal engagement time
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}