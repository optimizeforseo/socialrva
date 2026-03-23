"use client";

export default function Sidebar({ 
  activeSection, 
  setActiveSection, 
  openModal, 
  user, 
  handleLogout 
}) {
  return (
    <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 shadow-2xl border-r border-slate-700/50 flex flex-col fixed h-screen z-10 backdrop-blur-sm overflow-hidden">
      {/* Logo */}
      <div className="p-4 border-slate-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="font-semibold text-white text-lg">Socialsonic</span>
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
      <nav className="px-4 space-y-1 flex-1 overflow-y-auto py-2">
        <button
          onClick={() => setActiveSection("home")}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
            activeSection === "home"
              ? "text-white bg-gradient-to-r from-slate-700 to-slate-600 shadow-md"
              : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 hover:shadow-md"
          }`}
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
        </button>

        <button
          onClick={() => setActiveSection("research")}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
            activeSection === "research"
              ? "text-white bg-gradient-to-r from-slate-700 to-slate-600 shadow-md"
              : "text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-slate-700 hover:to-slate-600 hover:shadow-md"
          }`}
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
        </button>

        <button
          onClick={() => setActiveSection("myposts")}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
            activeSection === "myposts"
              ? "text-white bg-gradient-to-r from-slate-700 to-slate-600 shadow-md"
              : "text-slate-300 hover:text-white hover:bg-slate-700"
          }`}
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
        </button>

        <button
          onClick={() => setActiveSection("analyze")}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
            activeSection === "analyze"
              ? "text-white bg-gradient-to-r from-slate-700 to-slate-600 shadow-md"
              : "text-slate-300 hover:text-white hover:bg-slate-700"
          }`}
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
        </button>

        <button
          onClick={() => setActiveSection("carousels")}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
            activeSection === "carousels"
              ? "text-white bg-gradient-to-r from-slate-700 to-slate-600 shadow-md"
              : "text-slate-300 hover:text-white hover:bg-slate-700"
          }`}
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
        </button>

        <button
          onClick={() => setActiveSection("engage")}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
            activeSection === "engage"
              ? "text-white bg-gradient-to-r from-slate-700 to-slate-600 shadow-md"
              : "text-slate-300 hover:text-white hover:bg-slate-700"
          }`}
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
        </button>

        <button
          onClick={() => setActiveSection("topvoice")}
          className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 ${
            activeSection === "topvoice"
              ? "text-white bg-gradient-to-r from-slate-700 to-slate-600 shadow-md"
              : "text-slate-300 hover:text-white hover:bg-slate-700"
          }`}
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
        </button>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-slate-700 flex-shrink-0">
        <div className="bg-slate-800 rounded-lg p-3 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-white">Early Adopter Trial</span>
            <span className="px-2 py-1 bg-blue-600 text-blue-100 text-xs rounded-full">
              Trial
            </span>
          </div>
          <p className="text-xs text-slate-300 mb-2">6 days left in your free trial</p>
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
  );
}