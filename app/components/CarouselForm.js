"use client";

import { useState } from "react";

export default function CarouselForm({ onGenerate, isGenerating }) {
  const [carouselTopic, setCarouselTopic] = useState("");
  const [slideCount, setSlideCount] = useState(5);
  const [carouselStyle, setCarouselStyle] = useState("Educational");

  const carouselTypes = [
    {
      name: "Educational",
      icon: "📚",
      description: "Step-by-step guides and tutorials",
    },
    { name: "Tips", icon: "💡", description: "Quick tips and best practices" },
    {
      name: "Statistics",
      icon: "📊",
      description: "Data-driven insights and stats",
    },
    {
      name: "Process",
      icon: "⚙️",
      description: "Workflow and process breakdowns",
    },
    {
      name: "Comparison",
      icon: "⚖️",
      description: "Compare options or solutions",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Topic Input */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white flex items-center">
          <span className="mr-2">📋</span>
          Carousel Topic
        </label>
        <textarea
          value={carouselTopic}
          onChange={(e) => setCarouselTopic(e.target.value)}
          placeholder="What topic should your carousel cover? e.g., '5 Steps to Better Time Management'"
          className="w-full h-24 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none transition-all duration-200"
        />
      </div>

      {/* Carousel Type */}
      <div className="space-y-4">
        <label className="text-sm font-medium text-white flex items-center">
          <span className="mr-2">🎯</span>
          Carousel Type
        </label>
        <div className="grid grid-cols-1 gap-3">
          {carouselTypes.map((type) => (
            <button
              key={type.name}
              onClick={() => setCarouselStyle(type.name)}
              className={`flex items-center space-x-4 p-4 rounded-lg border transition-all duration-200 text-left ${
                carouselStyle === type.name
                  ? "border-green-500 bg-green-500/10 shadow-lg shadow-green-500/25"
                  : "border-slate-600 bg-slate-800 hover:border-slate-500 hover:bg-slate-700/50"
              }`}
            >
              <div className="text-2xl">{type.icon}</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">
                  {type.name}
                </div>
                <div className="text-xs text-slate-400">{type.description}</div>
              </div>
              {carouselStyle === type.name && (
                <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Slide Count */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white flex items-center">
          <span className="mr-2">📄</span>
          Number of Slides
        </label>
        <div className="flex items-center space-x-4">
          <input
            type="range"
            min="3"
            max="10"
            value={slideCount}
            onChange={(e) => setSlideCount(e.target.value)}
            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="px-3 py-2 bg-slate-700 rounded-lg text-white font-medium min-w-[60px] text-center">
            {slideCount} slides
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={() =>
          onGenerate({ topic: carouselTopic, style: carouselStyle, slideCount })
        }
        disabled={isGenerating || !carouselTopic.trim()}
        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Creating Carousel...</span>
          </>
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2"
              />
            </svg>
            <span>Generate Carousel</span>
          </>
        )}
      </button>
    </div>
  );
}
