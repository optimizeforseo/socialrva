"use client";

import { useEffect, useState } from "react";

export default function DebugLinkedInData() {
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const token = localStorage.getItem("linkedinAccessToken");
    const userId = localStorage.getItem("linkedinUserId");

    setDebugInfo({
      user,
      hasToken: !!token,
      hasUserId: !!userId,
      token: token ? `${token.substring(0, 20)}...` : null,
    });
  }, []);

  const handleRefresh = async () => {
    const token = localStorage.getItem("linkedinAccessToken");
    if (!token) {
      alert("No LinkedIn token found");
      return;
    }

    try {
      const response = await fetch(
        `/api/linkedin/profile?accessToken=${encodeURIComponent(token)}`
      );
      const result = await response.json();

      if (result.success) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = {
          ...currentUser,
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          profilePicture: result.data.profilePicture,
          email: result.data.email,
          linkedinId: result.data.id,
          platform: "linkedin",
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
        alert("User data updated! Refreshing page...");
        window.location.reload();
      } else {
        alert("Failed to fetch LinkedIn data: " + result.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleClear = () => {
    if (
      confirm("This will clear all data and redirect to login page. Continue?")
    ) {
      localStorage.clear();
      sessionStorage.clear();
      console.log("✅ All data cleared");
      console.log("🔄 Redirecting to login...");
      window.location.href = "/";
    }
  };

  if (!debugInfo) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-slate-900 border border-slate-700 rounded-lg p-4 max-w-md shadow-2xl z-50">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-white font-bold text-sm">🔍 LinkedIn Debug</h3>
        <button
          onClick={() => setDebugInfo(null)}
          className="text-slate-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="bg-slate-800 rounded p-2">
          <div className="text-slate-400">Name:</div>
          <div className="text-white font-mono">
            {debugInfo.user.firstName} {debugInfo.user.lastName}
          </div>
        </div>

        <div className="bg-slate-800 rounded p-2">
          <div className="text-slate-400">Email:</div>
          <div className="text-white font-mono">{debugInfo.user.email}</div>
        </div>

        <div className="bg-slate-800 rounded p-2">
          <div className="text-slate-400">Profile Picture:</div>
          <div className="text-white font-mono break-all">
            {debugInfo.user.profilePicture || "null"}
          </div>
        </div>

        <div className="bg-slate-800 rounded p-2">
          <div className="text-slate-400">Platform:</div>
          <div className="text-white font-mono">
            {debugInfo.user.platform || "not set"}
          </div>
        </div>

        <div className="bg-slate-800 rounded p-2">
          <div className="text-slate-400">Has Token:</div>
          <div
            className={`font-mono ${
              debugInfo.hasToken ? "text-green-400" : "text-red-400"
            }`}
          >
            {debugInfo.hasToken ? "✅ Yes" : "❌ No"}
          </div>
        </div>

        <div className="bg-slate-800 rounded p-2">
          <div className="text-slate-400">Has User ID:</div>
          <div
            className={`font-mono ${
              debugInfo.hasUserId ? "text-green-400" : "text-red-400"
            }`}
          >
            {debugInfo.hasUserId ? "✅ Yes" : "❌ No"}
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <button
          onClick={handleRefresh}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs py-2 px-3 rounded transition-colors"
        >
          🔄 Refresh Data
        </button>
        <button
          onClick={handleClear}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-2 px-3 rounded transition-colors"
        >
          🗑️ Clear & Logout
        </button>
      </div>

      <div className="mt-2 text-xs text-slate-500 text-center">
        Press Ctrl+Shift+D to toggle
      </div>
    </div>
  );
}