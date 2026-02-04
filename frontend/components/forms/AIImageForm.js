"use client";

import { useState } from "react";

export default function AIImageForm({
  imageDescription,
  setImageDescription,
  imageStyle,
  setImageStyle,
  aspectRatio,
  setAspectRatio,
  onGenerate,
  isGenerating,
  onGetSuggestions,
  myCreations = [],
}) {
  const [activeTab, setActiveTab] = useState("Generate");
  const [selectedCreation, setSelectedCreation] = useState(null);

  const styles = [
    {
      name: "Realistic",
      preview: "🖼️",
      description: "Photorealistic, high-quality images",
      example: "Professional photography style",
    },
    {
      name: "Animation",
      preview: "🎨",
      description: "Animated, cartoon-style images",
      example: "Digital art and illustrations",
    },
    {
      name: "Artistic",
      preview: "🎭",
      description: "Creative, stylized artwork",
      example: "Artistic interpretations",
    },
    {
      name: "Minimalist",
      preview: "⚪",
      description: "Clean, simple designs",
      example: "Modern, minimal aesthetics",
    },
  ];

  const aspectRatios = [
    {
      name: "Square",
      icon: "⬜",
      ratio: "1:1",
      description: "Perfect for social media posts",
    },
    {
      name: "Landscape",
      icon: "▭",
      ratio: "16:9",
      description: "Great for headers and banners",
    },
    {
      name: "Portrait",
      icon: "▯",
      ratio: "9:16",
      description: "Ideal for mobile content",
    },
  ];

  const inspirationPrompts = [
    "A modern office workspace with natural lighting",
    "Abstract representation of digital transformation",
    "Team collaboration in a creative environment",
    "Futuristic technology concept illustration",
    "Professional networking event scene",
  ];

  const handleInspiration = (prompt) => {
    setImageDescription(prompt);
  };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-800 rounded-lg p-1">
        {["Generate", "My Creations"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center space-x-2 ${
              activeTab === tab
                ? "bg-slate-700 text-white shadow-md"
                : "text-slate-300 hover:text-white hover:bg-slate-700/50"
            }`}
          >
            <span>{tab === "Generate" ? "✨" : "🖼️"}</span>
            <span>{tab}</span>
          </button>
        ))}
      </div>

      {activeTab === "Generate" && (
        <div className="space-y-6">
          {/* Description Input */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white flex items-center">
              <span className="mr-2">💭</span>
              Describe your image in detail
            </label>
            <textarea
              value={imageDescription}
              onChange={(e) => setImageDescription(e.target.value)}
              placeholder="What would you like to create? Be specific about colors, style, mood, and composition..."
              className="w-full h-32 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-slate-400">
                {imageDescription.length} characters
              </span>
              <button
                onClick={() => onGetSuggestions && onGetSuggestions("image")}
                className="flex items-center space-x-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
                <span>Inspire me</span>
              </button>
            </div>
          </div>

          {/* Quick Inspiration */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-white flex items-center">
              <span className="mr-2">💡</span>
              Quick Inspiration
            </label>
            <div className="grid grid-cols-1 gap-2">
              {inspirationPrompts.map((prompt, index) => (
                <button
                  key={index}
                  onClick={() => handleInspiration(prompt)}
                  className="text-left p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-slate-600 rounded-lg text-sm text-slate-300 hover:text-white transition-all duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Style Selection */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-white flex items-center">
              <span className="mr-2">🎨</span>
              Style
            </label>
            <div className="grid grid-cols-2 gap-3">
              {styles.map((style) => (
                <button
                  key={style.name}
                  onClick={() => setImageStyle(style.name)}
                  className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                    imageStyle === style.name
                      ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/25"
                      : "border-slate-600 bg-slate-800 hover:border-slate-500 hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-2xl">{style.preview}</div>
                    <div className="text-sm font-medium text-white">
                      {style.name}
                    </div>
                  </div>
                  <div className="text-xs text-slate-400 mb-1">
                    {style.description}
                  </div>
                  <div className="text-xs text-slate-500">{style.example}</div>
                  {imageStyle === style.name && (
                    <div className="absolute top-2 right-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
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
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="space-y-4">
            <label className="text-sm font-medium text-white flex items-center">
              <span className="mr-2">📐</span>
              Aspect Ratio
            </label>
            <div className="grid grid-cols-3 gap-3">
              {aspectRatios.map((ratio) => (
                <button
                  key={ratio.name}
                  onClick={() => setAspectRatio(ratio.name)}
                  className={`flex flex-col items-center space-y-2 p-4 rounded-lg border transition-all duration-200 ${
                    aspectRatio === ratio.name
                      ? "border-blue-500 bg-blue-500/10 text-white shadow-lg shadow-blue-500/25"
                      : "border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-500 hover:text-white hover:bg-slate-700/50"
                  }`}
                >
                  <span className="text-2xl">{ratio.icon}</span>
                  <div className="text-center">
                    <div className="text-sm font-medium">{ratio.name}</div>
                    <div className="text-xs text-slate-400">{ratio.ratio}</div>
                    <div className="text-xs text-slate-500 mt-1">
                      {ratio.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={() => onGenerate(imageDescription)}
            disabled={isGenerating || !imageDescription.trim()}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
          >
            {isGenerating ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Generating Image...</span>
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
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Generate AI Image</span>
              </>
            )}
          </button>
        </div>
      )}

      {activeTab === "My Creations" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Your AI Images</h3>
            <span className="text-sm text-slate-400">
              {myCreations.length} images
            </span>
          </div>

          {myCreations.length > 0 ? (
            <div className="grid grid-cols-2 gap-4">
              {myCreations.map((creation, index) => (
                <div
                  key={index}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedCreation(creation)}
                >
                  <div className="aspect-square bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-slate-600 transition-colors">
                    <img
                      src={creation.imageUrl}
                      alt={creation.prompt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg transition-colors">
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs bg-black/50 rounded px-2 py-1 truncate">
                        {creation.prompt}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🖼️</div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No images yet
              </h3>
              <p className="text-slate-400 mb-4">
                Generate your first AI image to see it here
              </p>
              <button
                onClick={() => setActiveTab("Generate")}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
              >
                Create First Image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}