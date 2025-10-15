"use client";

import { useState } from "react";

export default function DebugInfo() {
  const [showDebug, setShowDebug] = useState(false);

  if (!showDebug) {
    return (
      <button
        onClick={() => setShowDebug(true)}
        className="fixed bottom-4 left-4 px-3 py-1 bg-gray-800 text-white text-xs rounded"
      >
        Debug OAuth
      </button>
    );
  }

  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
  const redirectUri =
    process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI ||
    `${window.location.origin}/auth/callback`;

  return (
    <div className="fixed bottom-4 left-4 bg-gray-800 text-white p-4 rounded-lg text-xs max-w-md">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">OAuth Debug Info</h3>
        <button
          onClick={() => setShowDebug(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      <div className="space-y-1">
        <div>
          <strong>Client ID:</strong> {clientId || "Not set"}
        </div>
        <div>
          <strong>Redirect URI:</strong> {redirectUri}
        </div>
        <div>
          <strong>Current Origin:</strong> {window.location.origin}
        </div>
      </div>
      <div className="mt-2 text-yellow-300">
        <strong>
          Make sure this redirect URI is registered in your LinkedIn app!
        </strong>
      </div>
    </div>
  );
}
