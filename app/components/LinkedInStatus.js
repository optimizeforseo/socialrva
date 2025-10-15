"use client";

import { useState, useEffect } from "react";

export default function LinkedInStatus() {
  const [isLinkedInDown, setIsLinkedInDown] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  useEffect(() => {
    // Check LinkedIn status by trying to load their favicon
    const checkLinkedInStatus = async () => {
      try {
        const response = await fetch("https://www.linkedin.com/favicon.ico", {
          mode: "no-cors",
          method: "HEAD",
        });
        setIsLinkedInDown(false);
      } catch (error) {
        setIsLinkedInDown(true);
        setShowStatus(true);
      }
    };

    checkLinkedInStatus();

    // Check every 30 seconds
    const interval = setInterval(checkLinkedInStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!showStatus && !isLinkedInDown) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 dark:border-yellow-600 text-yellow-800 dark:text-yellow-200 px-4 py-3 rounded-lg shadow-lg max-w-md">
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-medium">LinkedIn Service Notice</p>
            <p className="text-sm">
              LinkedIn is experiencing connectivity issues. You can still test
              the app with demo mode.
            </p>
          </div>
          <button
            onClick={() => setShowStatus(false)}
            className="ml-4 text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
