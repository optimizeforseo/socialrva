"use client";

import { useLinkedInProfile } from "../../hooks/useLinkedInProfile";

export default function LinkedInProfileWidget() {
  const { profile, analytics, loading, error, refreshProfile } =
    useLinkedInProfile();

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 shadow-xl border border-slate-700/50">
        <div className="animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-slate-600 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-slate-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-600 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 shadow-xl border border-slate-700/50">
        <div className="text-center">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-red-400 text-sm mb-3">{error}</p>
          <button
            onClick={refreshProfile}
            className="text-blue-400 hover:text-blue-300 text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl p-6 shadow-xl border border-slate-700/50 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
          LinkedIn Profile
        </h3>
        <button
          onClick={refreshProfile}
          className="p-2 hover:bg-slate-600/50 rounded-lg transition-colors"
          title="Refresh profile"
        >
          <svg
            className="w-4 h-4 text-slate-400 hover:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        {profile.profilePicture ? (
          <img
            src={profile.profilePicture}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="w-16 h-16 rounded-full border-2 border-blue-500/50"
          />
        ) : (
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {profile.firstName?.charAt(0)}
            {profile.lastName?.charAt(0)}
          </div>
        )}
        <div className="flex-1">
          <h4 className="text-white font-semibold text-lg">
            {profile.firstName} {profile.lastName}
          </h4>
          {profile.headline && (
            <p className="text-slate-300 text-sm">{profile.headline}</p>
          )}
          {profile.email && (
            <p className="text-slate-400 text-xs mt-1">{profile.email}</p>
          )}
        </div>
      </div>

      {analytics && (
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-600/50">
          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <svg
                className="w-4 h-4 text-blue-400"
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
              <span className="text-slate-400 text-xs">Connections</span>
            </div>
            <p className="text-white font-bold text-xl">
              {analytics.connections || analytics.followers || 0}
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-1">
              <svg
                className="w-4 h-4 text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span className="text-slate-400 text-xs">Profile Views</span>
            </div>
            <p className="text-white font-bold text-xl">
              {analytics.profileViews || "N/A"}
            </p>
          </div>

          {profile.location && (
            <div className="col-span-2 bg-slate-900/50 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4 text-purple-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span className="text-slate-300 text-sm">
                  {profile.location}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {analytics?.note && (
        <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-blue-300 text-xs">{analytics.note}</p>
        </div>
      )}

      {/* Connection Status */}
      <div className="mt-4 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2">
          <div
            className={`w-2 h-2 rounded-full ${
              localStorage.getItem("linkedinAccessToken")
                ? "bg-green-400 animate-pulse"
                : "bg-yellow-400"
            }`}
          ></div>
          <span className="text-slate-400">
            {localStorage.getItem("linkedinAccessToken")
              ? "Live Data"
              : "Demo Mode"}
          </span>
        </div>
        {!localStorage.getItem("linkedinAccessToken") && (
          <a
            href="/"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            Connect LinkedIn
          </a>
        )}
      </div>
    </div>
  );
}