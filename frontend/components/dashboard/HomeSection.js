"use client";

import LinkedInProfileWidget from "../linkedin/LinkedInProfileWidget";

export default function HomeSection({ 
  activeTab, 
  setActiveTab, 
  currentSlide, 
  nextSlide, 
  prevSlide, 
  setCurrentSlide, 
  openModal 
}) {
  const contentIdeas = [
    {
      title: "The Future of Content: Balancing AI and Human Creativity",
      description:
        "Explore the symbiosis between AI-generated content and human creativity in marketing. Discuss how marketers can leverage AI tools while maintaining a unique brand voice. This topic aligns with your interest in learning new skills and recent trends in AI-assisted content creation.",
      category: "Marketing",
    },
    {
      title: "Redefining Brand Refresh: Lessons from Domino's New Identity",
      description:
        "Analyze Domino's recent brand refresh and extract lessons for marketers in any industry. Discuss the importance of evolving brand identity to stay relevant, especially to younger audiences. This idea draws from recent news and offers practical insights for marketers considering brand updates.",
      category: "Marketing",
    },
    {
      title: "Building User-Centric Products: A Design Thinking Approach",
      description:
        "Explore how design thinking principles can transform product development. Share insights on user research, prototyping, and iterative design processes that lead to better user experiences.",
      category: "User Experience",
    },
    {
      title: "The Future of SaaS: Trends and Predictions",
      description:
        "Analyze current trends in the SaaS industry and make predictions about future developments. Discuss topics like AI integration, user experience evolution, and market consolidation.",
      category: "SaaS",
    },
  ];

  const filteredIdeas = contentIdeas.filter((idea) => idea.category === activeTab);

  return (
    <>
      {/* Main Content - Scrollable */}
      <main
        className="flex-1 p-6 overflow-y-auto h-full pr-80 scrollbar-hide"
        style={{ height: "calc(100vh - 5rem)" }}
      >
        {/* Top Cards Row */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Create a new post */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full mr-3 animate-pulse"></div>
              <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Create a new post
              </h2>
            </div>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              Transform your ideas into compelling LinkedIn content. Create posts based on viral writing styles and
              top-performing formats in your industry for maximum impact.
            </p>
            <button
              onClick={openModal}
              className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500 hover:from-emerald-400 hover:via-cyan-400 hover:to-blue-400 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 shadow-xl shadow-emerald-500/25 hover:shadow-2xl hover:shadow-emerald-500/40 transform hover:scale-105"
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              <span>Start creation</span>
            </button>
          </div>

          {/* Start with an idea */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full mr-3 animate-pulse"></div>
              <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Start with an idea
              </h2>
            </div>
            <p className="text-slate-300 text-sm mb-4 leading-relaxed">
              Get personalized content ideas based on your profile, interests, and industry trends. Discover top-performing
              posts and trending topics to showcase your expertise with engaging content.
            </p>
          </div>
        </div>

        {/* Your Personalized Content Ideas */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-xl border border-slate-700/50">
          <div className="p-6 border-b border-slate-700/50">
            <div className="flex items-center mb-2">
              <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full mr-3 animate-pulse"></div>
              <h2 className="text-lg font-semibold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                Your Personalized Content Ideas
              </h2>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-4">
              Tailored ideas based on your profile, interests, and industry trends. Get inspired by top viral content and
              stay relevant.
            </p>

            {/* Tabs */}
            <div className="flex space-x-1">
              {["Marketing", "User Experience", "SaaS"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
                      : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 hover:shadow-md"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content Ideas Slider */}
          <div className="p-6">
            <div className="relative">
              {/* Slider Container */}
              <div className="overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-500 ease-in-out gap-6"
                  style={{
                    transform: `translateX(-${currentSlide * 50}%)`,
                  }}
                >
                  {filteredIdeas.map((idea, index) => (
                    <div key={index} className="w-1/2 flex-shrink-0">
                      <div className="bg-gradient-to-br from-white/8 to-white/3 border border-white/15 rounded-xl p-6 hover:border-white/25 hover:from-white/12 hover:to-white/6 transition-all duration-300 hover:shadow-2xl hover:scale-105 backdrop-blur-lg h-full">
                        <h3 className="font-semibold bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent mb-3 text-base">
                          {idea.title}
                        </h3>
                        <p className="text-slate-200/80 text-sm mb-4 leading-relaxed">
                          {idea.description}
                        </p>
                        <button
                          onClick={openModal}
                          className="flex items-center space-x-2 text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text hover:from-cyan-300 hover:via-blue-300 hover:to-purple-400 font-medium transition-all duration-300 text-sm group"
                        >
                          <svg
                            className="w-4 h-4 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300 group-hover:rotate-12"
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
                          <span>Start creation</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              {filteredIdeas.length > 2 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:from-white/20 hover:to-white/10 hover:border-white/30 transition-all duration-300 hover:scale-110 shadow-xl"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:from-white/20 hover:to-white/10 hover:border-white/30 transition-all duration-300 hover:scale-110 shadow-xl"
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </>
              )}

              {/* Slide Indicators */}
              {filteredIdeas.length > 2 && (
                <div className="flex justify-center mt-6 space-x-2">
                  {Array.from({ length: Math.max(0, filteredIdeas.length - 1) }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? "bg-gradient-to-r from-cyan-400 to-blue-500 w-8 shadow-lg shadow-cyan-500/50"
                          : "bg-white/30 hover:bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Additional Content for Testing Scroll */}
        <div className="mt-8 space-y-6">
          {Array.from({ length: 5 }, (_, i) => (
            <div
              key={i}
              className="bg-gradient-to-br from-slate-800/70 to-slate-700/70 rounded-xl p-6 shadow-lg border border-slate-700/30 hover:shadow-xl transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex items-center mb-3">
                <div
                  className={`w-2 h-2 rounded-full mr-3 animate-pulse ${
                    i % 3 === 0
                      ? "bg-gradient-to-r from-emerald-400 to-cyan-500"
                      : i % 3 === 1
                      ? "bg-gradient-to-r from-pink-400 to-rose-500"
                      : "bg-gradient-to-r from-amber-400 to-orange-500"
                  }`}
                ></div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                  Additional Content Section {i + 1}
                </h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                This is additional content to demonstrate the scrolling functionality. The main content area should
                scroll independently while the header and right sidebar remain fixed in position. This helps create a
                better user experience for dashboard layouts.
              </p>
            </div>
          ))}
        </div>
      </main>

      {/* Right Sidebar - Fixed */}
      <div
        className="w-80 p-6 overflow-y-auto fixed top-20 right-0 from-slate-900 to-slate-800 scrollbar-hide"
        style={{ height: "calc(100vh - 5rem)" }}
      >
        {/* LinkedIn Profile Widget */}
        <div className="mb-6">
          <LinkedInProfileWidget />
        </div>

        {/* Refer and Earn Rewards */}
        <div className="bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-xl p-6 mb-6 relative overflow-hidden shadow-2xl border border-orange-400/20">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
          <div className="absolute top-4 right-4 z-10">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2 relative z-10">
            Refer and earn rewards
          </h3>
          <p className="text-white text-opacity-90 text-sm mb-4 leading-relaxed relative z-10">
            Invite friends and extend access up to 70 days!
          </p>
          <button className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:scale-105 relative z-10">
            Invite now
          </button>
        </div>

        {/* Quick Links */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 shadow-xl border border-slate-700/50">
          <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent mb-4">
            Quick links
          </h3>

          {/* Slack Link */}
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 transition-all duration-200 cursor-pointer mb-3 hover:shadow-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52-2.523A2.528 2.528 0 0 1 5.042 10.1h2.52v2.542a2.528 2.528 0 0 1-2.52 2.523zm0-6.584A2.528 2.528 0 0 1 2.522 6.058 2.528 2.528 0 0 1 5.042 3.535a2.528 2.528 0 0 1 2.52 2.523v2.523H5.042zm6.584 0a2.528 2.528 0 0 1-2.523-2.523A2.528 2.528 0 0 1 11.626 3.535a2.528 2.528 0 0 1 2.523 2.523v2.523h-2.523zm0 6.584a2.528 2.528 0 0 1 2.523 2.523 2.528 2.528 0 0 1-2.523 2.523H9.103v-2.523a2.528 2.528 0 0 1 2.523-2.523z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium text-sm">Hop into our Slack</span>
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
              <p className="text-slate-400 text-xs">For quick help & cool chats!</p>
            </div>
          </div>

          {/* LinkedIn Updates */}
          <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 transition-all duration-200 cursor-pointer hover:shadow-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center shadow-lg">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-white font-medium text-sm">Follow our updates</span>
                <svg
                  className="w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                  </svg>
              </div>
              <p className="text-slate-400 text-xs">Never miss the boring stuff!</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}