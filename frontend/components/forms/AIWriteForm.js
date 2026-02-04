"use client";

import { useState } from "react";

export default function AIWriteForm({
  topic,
  setTopic,
  writingStyle,
  setWritingStyle,
  postCategory,
  setPostCategory,
  useViralTemplate,
  setUseViralTemplate,
  length,
  setLength,
  onGenerate,
  isGenerating,
}) {
  const [activeTab, setActiveTab] = useState("topic");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      // Read file content for text files
      if (uploadedFile.type.startsWith("text/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setTopic(e.target.result);
        };
        reader.readAsText(uploadedFile);
      }
    }
  };

  const handleGenerate = () => {
    let content = "";
    switch (activeTab) {
      case "topic":
        content = topic;
        break;
      case "url":
        content = `Analyze and create content based on this URL: ${url}`;
        break;
      case "file":
        content = topic; // File content is already loaded into topic
        break;
    }
    onGenerate(content);
  };

  return (
    <div className="space-y-6">
      {/* Input Method Tabs */}
      <div className="space-y-4">
        <div className="flex space-x-1 bg-slate-800 rounded-lg p-1">
          {[
            { key: "topic", label: "Add a topic", icon: "✏️" },
            { key: "url", label: "Add a URL", icon: "🔗" },
            { key: "file", label: "Upload a File", icon: "📁" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center justify-center space-x-2 ${
                activeTab === tab.key
                  ? "bg-slate-700 text-white shadow-md"
                  : "text-slate-300 hover:text-white hover:bg-slate-700/50"
              }`}
            >
              <span>{tab.icon}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-4">
          {activeTab === "topic" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center">
                <span className="mr-2">📝</span>
                Topic
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter your topic here... e.g., 'Tips for remote work productivity'"
                className="w-full h-32 bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-200"
              />
              <div className="flex justify-between text-xs text-slate-400">
                <span>{topic.length} characters</span>
                <span>Recommended: 50-200 characters</span>
              </div>
            </div>
          )}

          {activeTab === "url" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center">
                <span className="mr-2">🔗</span>
                URL
              </label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <p className="text-xs text-slate-400">
                AI will analyze the content from this URL and create a post
                based on it
              </p>
            </div>
          )}

          {activeTab === "file" && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-white flex items-center">
                <span className="mr-2">📁</span>
                Upload File
              </label>
              <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-slate-500 transition-colors">
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".txt,.md,.doc,.docx"
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="text-4xl">📄</div>
                    <p className="text-slate-300">
                      {file ? file.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-slate-400">
                      Supports: TXT, MD, DOC, DOCX
                    </p>
                  </div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Writing Style */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white flex items-center">
          <span className="mr-2">🎨</span>
          Writing Style
        </label>
        <p className="text-xs text-slate-400">
          Choose the tone and style for your content
        </p>
        <select
          value={writingStyle}
          onChange={(e) => setWritingStyle(e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <option value="Socialsonic">
            🚀 Socialsonic (Engaging & Modern)
          </option>
          <option value="Professional">
            💼 Professional (Formal & Authoritative)
          </option>
          <option value="Casual">😊 Casual (Friendly & Approachable)</option>
          <option value="Thought Leader">
            🧠 Thought Leader (Insightful & Expert)
          </option>
          <option value="Storytelling">
            📖 Storytelling (Narrative & Personal)
          </option>
        </select>
      </div>

      {/* Post Category */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white flex items-center">
          <span className="mr-2">📂</span>
          Post Category
        </label>
        <p className="text-xs text-slate-400">
          Define the main focus and purpose of your post
        </p>
        <select
          value={postCategory}
          onChange={(e) => setPostCategory(e.target.value)}
          className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <option value="Thought Leadership">🎯 Thought Leadership</option>
          <option value="Industry News">📰 Industry News</option>
          <option value="Personal Story">👤 Personal Story</option>
          <option value="Tips & Advice">💡 Tips & Advice</option>
          <option value="Company Update">🏢 Company Update</option>
          <option value="Behind the Scenes">🎬 Behind the Scenes</option>
          <option value="Question & Discussion">
            ❓ Question & Discussion
          </option>
        </select>
      </div>

      {/* Viral Template Toggle */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="flex-1">
            <label className="text-sm font-medium text-white flex items-center">
              <span className="mr-2">🔥</span>
              Use Viral Template
              <svg
                className="w-4 h-4 ml-2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </label>
            <p className="text-xs text-slate-400 mt-1">
              Apply proven viral content structures for maximum engagement
            </p>
          </div>
          <button
            onClick={() => setUseViralTemplate(!useViralTemplate)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              useViralTemplate ? "bg-blue-600" : "bg-slate-600"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                useViralTemplate ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {useViralTemplate && (
          <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20 animate-slideIn">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-blue-400">🔥</span>
              <span className="text-sm font-medium text-blue-400">
                Viral Template Active
              </span>
            </div>
            <p className="text-xs text-slate-300">
              Your content will use proven viral structures: compelling hooks,
              storytelling elements, clear value propositions, and strong
              calls-to-action.
            </p>
          </div>
        )}
      </div>

      {/* Length Slider */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-white flex items-center">
          <span className="mr-2">📏</span>
          Content Length
        </label>
        <div className="space-y-4">
          <input
            type="range"
            min="0"
            max="100"
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs">
            <div className="text-center">
              <div className="text-slate-300">Short</div>
              <div className="text-slate-400">50-100 words</div>
            </div>
            <div className="text-center">
              <div className="text-slate-300">Medium</div>
              <div className="text-slate-400">100-200 words</div>
            </div>
            <div className="text-center">
              <div className="text-slate-300">Long</div>
              <div className="text-slate-400">200-300 words</div>
            </div>
          </div>
          <div className="text-center">
            <span className="px-3 py-1 bg-slate-700 rounded-full text-sm text-white">
              {length < 33
                ? "Short Post"
                : length < 66
                ? "Medium Post"
                : "Long Post"}
            </span>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || (!topic && !url && !file)}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium py-4 px-6 rounded-lg flex items-center justify-center space-x-3 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none"
      >
        {isGenerating ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Generating Content...</span>
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
            <span>Generate AI Content</span>
          </>
        )}
      </button>
    </div>
  );
}