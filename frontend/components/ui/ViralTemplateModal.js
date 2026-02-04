"use client";

import { useState, useEffect } from "react";
import aiService from "../../app/services/aiService";
import linkedinDataService from "../../app/services/linkedinDataService";
import {
  MagnifyingGlassIcon,
  SparklesIcon,
  FireIcon,
  StarIcon,
  XMarkIcon,
  HeartIcon,
  ChatBubbleLeftIcon,
  ArrowPathRoundedSquareIcon,
  EyeIcon,
  CheckBadgeIcon,
  FunnelIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import { HandThumbUpIcon } from "./CustomIcons";

export default function ViralTemplateModal({
  isOpen,
  onClose,
  onSelectTemplate,
}) {
  const [activeTab, setActiveTab] = useState("Trending");
  const [searchQuery, setSearchQuery] = useState("");
  const [templates, setTemplates] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    category: "all",
    minEngagement: 0,
    timeRange: "all",
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    {
      id: "Trending",
      label: "Trending",
      icon: FireIcon,
      color: "text-red-400",
      bgColor: "bg-red-600",
    },
    {
      id: "AI Recommended",
      label: "AI Recommended",
      icon: SparklesIcon,
      color: "text-blue-400",
      bgColor: "bg-blue-600",
    },
    {
      id: "Editor's Choice",
      label: "Editor's Choice",
      icon: StarIcon,
      color: "text-yellow-400",
      bgColor: "bg-yellow-600",
    },
  ];

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen, activeTab, searchQuery]);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      let posts;

      if (searchQuery.trim()) {
        posts = await linkedinDataService.searchViralPosts(
          searchQuery,
          activeTab
        );
      } else {
        const categoryMap = {
          Trending: "trending",
          "AI Recommended": "recommended",
          "Editor's Choice": "editors_choice",
        };
        posts = await linkedinDataService.getViralPosts(
          categoryMap[activeTab] || "trending"
        );
      }

      setTemplates(posts);
    } catch (error) {
      console.error("Failed to load templates:", error);
      setTemplates([]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelectTemplate = async (template) => {
    try {
      // Generate AI-powered breakdown
      const breakdown = await generateTemplateBreakdown(template);

      onSelectTemplate({
        ...template,
        breakdown,
        structure: extractTemplateStructure(template.content),
      });

      onClose();
    } catch (error) {
      console.error("Failed to process template:", error);
      onSelectTemplate(template);
      onClose();
    }
  };

  const generateTemplateBreakdown = async (template) => {
    try {
      const prompt = `Analyze this viral LinkedIn post and explain why it works:

"${template.content}"

Author: ${template.author?.name || "Unknown"} (${
        template.author?.followers || "0"
      } followers)
Engagement: ${linkedinDataService.formatEngagement(
        template.engagement?.reactions || 0
      )} reactions, ${linkedinDataService.formatEngagement(
        template.engagement?.comments || 0
      )} comments
Viral Score: ${template.viralScore}/100

Provide a breakdown of:
1. Hook strategy
2. Content structure  
3. Psychological triggers
4. Why it went viral
5. How to adapt this pattern

Keep it concise and actionable.`;

      const response = await aiService.generateText(prompt, {
        writingStyle: "analytical",
        postCategory: "breakdown",
        length: "medium",
      });

      return response.success
        ? response.data.content
        : "Analysis not available";
    } catch (error) {
      return "Analysis not available";
    }
  };

  const extractTemplateStructure = (content) => {
    const lines = content.split("\n").filter((line) => line.trim());
    return {
      hook: lines[0] || "",
      body: lines.slice(1, -1).join("\n") || "",
      cta: lines[lines.length - 1] || "",
      hasNumbers: /\d+/.test(content),
      hasEmojis:
        /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/u.test(
          content
        ),
      hasBulletPoints:
        content.includes("→") || content.includes("•") || content.includes("-"),
      wordCount: content.split(" ").length,
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-slate-700">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                Viral Post Templates
              </h2>
              <p className="text-sm text-gray-400">
                Choose from high-performing LinkedIn posts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-slate-700 rounded-lg"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Sidebar */}
          <div className="w-80 bg-slate-900 border-r border-slate-700 flex flex-col">
            {/* Search */}
            <div className="p-4 border-b border-slate-700">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search viral posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex-1 p-4">
              <div className="space-y-2">
                {categories.map((category) => {
                  const IconComponent = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveTab(category.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center space-x-3 ${
                        activeTab === category.id
                          ? `${category.bgColor} text-white shadow-lg`
                          : "text-gray-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <IconComponent
                        className={`w-5 h-5 ${
                          activeTab === category.id
                            ? "text-white"
                            : category.color
                        }`}
                      />
                      <span className="font-medium">{category.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Filters */}
              <div className="mt-6 pt-6 border-t border-slate-700">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="w-full flex items-center justify-between px-4 py-2 text-gray-300 hover:text-white transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <FunnelIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Filters</span>
                  </div>
                  <div
                    className={`transform transition-transform ${
                      showFilters ? "rotate-180" : ""
                    }`}
                  >
                    ↓
                  </div>
                </button>

                {showFilters && (
                  <div className="mt-3 space-y-3 px-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-400 mb-1">
                        Min Engagement
                      </label>
                      <select
                        value={filters.minEngagement}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            minEngagement: parseInt(e.target.value),
                          })
                        }
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-white text-xs"
                      >
                        <option value={0}>Any</option>
                        <option value={1000}>1K+</option>
                        <option value={10000}>10K+</option>
                        <option value={50000}>50K+</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Header with stats */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {activeTab}
                  </h3>
                  <p className="text-sm text-gray-400">
                    {isLoading
                      ? "Loading..."
                      : `${templates.length} viral posts found`}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <ClockIcon className="w-4 h-4" />
                  <span>Updated 5 min ago</span>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading viral posts...</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      className="bg-slate-700/50 rounded-xl p-6 hover:bg-slate-700 transition-all duration-200 border border-slate-600/50 hover:border-slate-500 group"
                    >
                      {/* Author Info */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <img
                              src={
                                template.author?.profileImage ||
                                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                              }
                              alt={template.author?.name || "User"}
                              className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-600"
                            />
                            {template.author?.verified && (
                              <CheckBadgeIcon className="absolute -bottom-1 -right-1 w-5 h-5 text-blue-400 bg-slate-700 rounded-full" />
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <h4 className="font-semibold text-white text-sm">
                                {template.author?.name || "Unknown Author"}
                              </h4>
                              <span className="text-blue-400 text-xs">
                                • 1st
                              </span>
                            </div>
                            <p className="text-gray-400 text-xs">
                              {template.author?.title || "Professional"}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {template.author?.followers || "0"} followers
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <div className="px-2 py-1 bg-green-900/30 text-green-400 text-xs rounded-full border border-green-700/30">
                            {template.viralScore || 0}/100
                          </div>
                          <span className="text-gray-500 text-xs">
                            {template.timestamp
                              ? linkedinDataService.getTimeAgo(
                                  template.timestamp
                                )
                              : "Recently"}
                          </span>
                        </div>
                      </div>

                      {/* Content Preview */}
                      <div className="text-gray-300 text-sm mb-4 leading-relaxed line-clamp-4">
                        {template.content || "No content available"}
                      </div>

                      {/* Hashtags */}
                      {template.hashtags && template.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {template.hashtags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="text-blue-400 text-xs bg-blue-900/20 px-2 py-1 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Engagement Stats */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6 text-xs text-gray-400">
                          <div className="flex items-center space-x-2">
                            <div className="flex -space-x-1">
                              <div className="w-5 h-5 bg-blue-500 rounded-full border-2 border-slate-700 flex items-center justify-center">
                                <HandThumbUpIcon className="w-3 h-3 text-white" />
                              </div>
                              <div className="w-5 h-5 bg-red-500 rounded-full border-2 border-slate-700 flex items-center justify-center">
                                <HeartIcon className="w-3 h-3 text-white" />
                              </div>
                            </div>
                            <span className="font-medium">
                              {linkedinDataService.formatEngagement(
                                template.engagement?.reactions || 0
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ChatBubbleLeftIcon className="w-4 h-4" />
                            <span>
                              {linkedinDataService.formatEngagement(
                                template.engagement?.comments || 0
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ArrowPathRoundedSquareIcon className="w-4 h-4" />
                            <span>
                              {linkedinDataService.formatEngagement(
                                template.engagement?.reposts || 0
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <EyeIcon className="w-4 h-4" />
                            <span>
                              {linkedinDataService.formatEngagement(
                                template.engagement?.views || 0
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <button className="px-3 py-1.5 bg-slate-600 hover:bg-slate-500 text-white text-xs rounded-lg transition-colors">
                            Breakdown
                          </button>
                          <button
                            onClick={() => handleSelectTemplate(template)}
                            className="px-4 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs rounded-lg transition-all transform hover:scale-105 font-medium"
                          >
                            Use Template
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!isLoading && templates.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MagnifyingGlassIcon className="w-10 h-10 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-400 mb-2">
                    No templates found
                  </h3>
                  <p className="text-gray-500 text-sm">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}