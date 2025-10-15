"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "../components/ThemeToggle";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Marketing");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      router.push("/");
    }
    setLoading(false);
  }, [router]);

  // Reset slide when tab changes
  useEffect(() => {
    setCurrentSlide(0);
  }, [activeTab]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    console.log("Closing modal"); // Debug log
    setIsModalOpen(false);
  };

  const openCreateAI = () => {
    router.push("/create-ai");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

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

  const filteredIdeas = contentIdeas.filter(
    (idea) => idea.category === activeTab
  );

  // Slider navigation functions
  const nextSlide = () => {
    setCurrentSlide((prev) =>
      prev >= filteredIdeas.length - 2 ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev <= 0 ? Math.max(0, filteredIdeas.length - 2) : prev - 1
    );
  };

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-colors duration-300 overflow-hidden">
      {/* Theme Toggle */}

      <div className="flex h-full">
        {/* Left Sidebar - Fixed */}
        <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl border-r border-slate-700/50 flex flex-col fixed h-full z-10 backdrop-blur-sm">
          {/* Logo */}
          <div className="p-4 border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-semibold text-white text-lg">
                Socialsonic
              </span>
            </div>
          </div>

          {/* Create Button */}
          <div className="p-4">
            <button
              onClick={openModal}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>Create</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="px-4 space-y-1 flex-1">
            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 text-white bg-gradient-to-r from-slate-700 to-slate-600 rounded-lg transition-all duration-200 shadow-md"
            >
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              <span className="text-sm font-medium">Home</span>
            </a>

            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 rounded-lg transition-all duration-200 hover:shadow-md"
            >
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <span className="text-sm">Research</span>
              <svg
                className="w-4 h-4 ml-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </a>

            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <span className="text-sm">My posts</span>
            </a>

            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
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
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              <span className="text-sm">Analyze</span>
            </a>

            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
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
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="text-sm">Carousels</span>
            </a>

            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
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
              <span className="text-sm">Engage</span>
              <span className="ml-auto text-xs text-slate-400">Soon</span>
            </a>

            <a
              href="#"
              className="flex items-center space-x-3 px-3 py-2 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
            >
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
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
              <span className="text-sm">Top voice</span>
              <span className="ml-auto text-xs text-slate-400">Soon</span>
            </a>
          </nav>

          {/* Bottom Section */}
          <div className="p-4 border-t border-slate-700 mt-auto">
            <div className="bg-slate-800 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">
                  Early Adopter Trial
                </span>
                <span className="px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded-full">
                  Trial
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-2">
                6 days left in your free trial
              </p>
              <div className="w-full bg-slate-600 rounded-full h-2 mb-3">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: "20%" }}
                ></div>
              </div>
              <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition-colors">
                Upgrade now
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {user.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                    {user.firstName?.charAt(0)}
                    {user.lastName?.charAt(0)}
                  </div>
                )}
                <span className="text-sm font-medium text-white">
                  {user.firstName} {user.lastName}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="text-slate-400 hover:text-white transition-colors duration-200"
              >
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="ml-64 flex flex-col w-full h-full">
          {/* Header - Fixed */}
          <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 px-6 py-4 fixed top-0 right-0 left-64 z-20 backdrop-blur-md shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent flex items-center">
                  Good afternoon, {user.firstName}!
                  <span className="ml-2 text-white">👋</span>
                </h1>
              </div>
              <div className="flex items-center space-x-4">
                <button className="p-2 text-slate-400 hover:text-white transition-all duration-200 rounded-lg hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 hover:shadow-lg transform hover:scale-105">
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
                      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                </button>
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-lg">
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </div>
              </div>
            </div>
          </header>

          {/* Content Area with Main and Right Sidebar */}
          <div className="flex flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-20 h-full">
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
                    Transform your ideas into compelling LinkedIn content.
                    Create posts based on viral writing styles and
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
                    Get personalized content ideas based on your profile,
                    interests, and industry trends. Discover top-performing
                    posts and trending topics to showcase your expertise with
                    engaging content.
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
                    Tailored ideas based on your profile, interests, and
                    industry trends. Get inspired by top viral content and stay
                    relevant.
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
                        {Array.from(
                          { length: Math.max(0, filteredIdeas.length - 1) },
                          (_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                currentSlide === index
                                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 w-8 shadow-lg shadow-cyan-500/50"
                                  : "bg-white/30 hover:bg-white/50"
                              }`}
                            />
                          )
                        )}
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
                      This is additional content to demonstrate the scrolling
                      functionality. The main content area should scroll
                      independently while the header and right sidebar remain
                      fixed in position. This helps create a better user
                      experience for dashboard layouts.
                    </p>
                  </div>
                ))}
              </div>
            </main>

            {/* Right Sidebar - Fixed */}
            <div
              className="w-80 p-6 overflow-y-auto fixed top-20 right-0  from-slate-900 to-slate-800 scrollbar-hide "
              style={{ height: "calc(100vh - 5rem)" }}
            >
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
                      <span className="text-white font-medium text-sm">
                        Hop into our Slack
                      </span>
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
                    <p className="text-slate-400 text-xs">
                      For quick help & cool chats!
                    </p>
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
                      <span className="text-white font-medium text-sm">
                        Follow our updates
                      </span>
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
                    <p className="text-slate-400 text-xs">
                      Never miss the boring stuff!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-gradient-to-br from-gray-950 via-slate-950 to-gray-900 rounded-2xl shadow-2xl border border-white/20 w-[800px] max-w-full max-h-full overflow-y-auto">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-emerald-600/20 to-cyan-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-full flex items-center justify-center hover:from-white/20 hover:to-white/10 hover:border-white/30 transition-all duration-300 hover:scale-110 shadow-xl"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {/* Modal Header */}
            <div className="relative z-10 p-8 pb-6">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent text-center mb-2">
                Ready to create your next LinkedIn post?
              </h2>
              <p className="text-slate-300 text-center text-sm">
                Choose how you'd like to create your content
              </p>
            </div>

            {/* Modal Body */}
            <div className="relative z-10 px-8 pb-8">
              {/* Main Options */}
              <div className="grid grid-cols-2 gap-6 mb-8">
                {/* Create with AI */}
                <div
                  onClick={openCreateAI}
                  className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer group"
                >
                  <div className="bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-xl p-4 mb-4 w-fit">
                    <svg
                      className="w-8 h-8 text-purple-400"
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
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent mb-2">
                    Create with AI
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Let AI generate content based on your brief input
                  </p>
                </div>

                {/* Write your own */}
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 cursor-pointer group">
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-xl p-4 mb-4 w-fit">
                    <svg
                      className="w-8 h-8 text-cyan-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent mb-2">
                    Write your own
                  </h3>
                  <p className="text-slate-300 text-sm">
                    Get AI assistance while writing your own content
                  </p>
                </div>
              </div>

              {/* Additional Options */}
              <div className="space-y-4">
                <p className="text-slate-400 text-sm font-medium">
                  LinkedIn post assets
                </p>

                {/* Create a carousel */}
                <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl rounded-xl p-4 border border-white/15 hover:border-white/25 transition-all duration-300 cursor-pointer group flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-red-500/20 to-pink-600/20 rounded-lg p-3 flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold bg-gradient-to-r from-white to-red-100 bg-clip-text text-transparent">
                      Create a carousel
                    </h4>
                    <p className="text-slate-300 text-sm">
                      Let AI generate high-performing carousels in minutes
                    </p>
                  </div>
                </div>

                {/* Generate AI image */}
                <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl rounded-xl p-4 border border-white/15 hover:border-white/25 transition-all duration-300 cursor-pointer group flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-lg p-3 flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-amber-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold bg-gradient-to-r from-white to-amber-100 bg-clip-text text-transparent">
                      Generate AI image
                    </h4>
                    <p className="text-slate-300 text-sm">
                      Create stunning images instantly with AI
                    </p>
                  </div>
                </div>

                {/* Generate your AI twin */}
                <div className="bg-gradient-to-br from-white/8 to-white/3 backdrop-blur-xl rounded-xl p-4 border border-white/15 hover:border-white/25 transition-all duration-300 cursor-pointer group flex items-center space-x-4">
                  <div className="bg-gradient-to-br from-emerald-500/20 to-teal-600/20 rounded-lg p-3 flex-shrink-0">
                    <svg
                      className="w-6 h-6 text-emerald-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold bg-gradient-to-r from-white to-emerald-100 bg-clip-text text-transparent">
                      Generate your AI twin
                    </h4>
                    <p className="text-slate-300 text-sm">
                      Create eye-catching AI images that feature you
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
