"use client";

import { useState, useEffect } from "react";

export default function LinkedInAnalytics() {
  const [animatedValues, setAnimatedValues] = useState({
    connections: 0,
    followers: 0,
    profileViews: 0,
  });

  // Animate numbers on component mount
  useEffect(() => {
    const targets = {
      connections: 1300,
      followers: 872,
      profileViews: 872,
    };

    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;

      setAnimatedValues({
        connections: Math.floor(targets.connections * progress),
        followers: Math.floor(targets.followers * progress),
        profileViews: Math.floor(targets.profileViews * progress),
      });

      if (currentStep >= steps) {
        clearInterval(interval);
        setAnimatedValues(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-lg mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-blue-400 mb-2">
          Track your LinkedIn growth with real-time analytics and insights
        </h2>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Connections Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Connections
          </p>
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {animatedValues.connections.toLocaleString()}
            </span>
            <span className="text-xs text-green-500 font-medium">+2%</span>
          </div>
          <div className="w-full h-6 mt-2">
            <svg viewBox="0 0 64 24" className="w-full h-full">
              <path
                d="M2 18 Q16 12 32 15 Q48 18 62 9"
                stroke="#10B981"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Posts Published Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            4 posts published
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-500 mb-2">
            Last 7 days
          </p>
          <div className="flex items-end space-x-1 h-8">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div
                key={i}
                className="flex-1 bg-blue-500 rounded-sm"
                style={{
                  height: `${Math.random() * 60 + 20}%`,
                  opacity: i <= 4 ? 1 : 0.3,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Followers Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Followers
          </p>
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {animatedValues.followers}
            </span>
            <span className="text-xs text-green-500 font-medium">+4%</span>
          </div>
          <div className="w-full h-6 mt-2">
            <svg viewBox="0 0 64 24" className="w-full h-full">
              <path
                d="M2 20 Q16 15 32 12 Q48 9 62 6"
                stroke="#10B981"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
        </div>

        {/* Profile Views Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
            Profile views
          </p>
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              {animatedValues.profileViews}
            </span>
            <span className="text-xs text-green-500 font-medium">+9%</span>
          </div>
          <div className="w-full h-6 mt-2">
            <svg viewBox="0 0 64 24" className="w-full h-full">
              <path
                d="M2 15 Q16 9 32 11 Q48 12 62 5"
                stroke="#10B981"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Top Performing Posts Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
          Top performing posts
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-500 mb-3">
          Last 7 days
        </p>
        <div className="space-y-2">
          {[
            { title: "How to build a personal brand", engagement: "245" },
            { title: "5 tips for better networking", engagement: "189" },
            { title: "My journey in tech industry", engagement: "156" },
          ].map((post, index) => (
            <div key={index} className="flex items-center justify-between py-1">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-900 dark:text-white truncate">
                  {post.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {post.engagement} likes
                </p>
              </div>
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full ml-2 flex-shrink-0"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
