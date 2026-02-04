"use client";

import { useState, useEffect } from "react";
import linkedinService from "../../app/services/linkedinService";

export default function LinkedInStatusBanner() {
  const [status, setStatus] = useState("checking");
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    checkLinkedInStatus();
  }, []);

  async function checkLinkedInStatus() {
    const isAvailable = await linkedinService.checkStatus();

    if (!isAvailable || linkedinService.shouldUseDemoMode()) {
      setStatus("demo");
      setShowBanner(true);
    } else {
      setStatus("connected");
      setShowBanner(false);
    }
  }

  function handleDismiss() {
    setShowBanner(false);
    localStorage.setItem("linkedInBannerDismissed", "true");
  }

  function handleClearData() {
    linkedinService.clearLinkedInData();
    alert(
      "LinkedIn data cleared. Please refresh the page and try logging in again."
    );
  }

  if (!showBanner) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-yellow-900/95 to-orange-900/95 backdrop-blur-sm border-b border-yellow-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 flex-1">
            {/* Warning Icon */}
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-yellow-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>

            {/* Message */}
            <div className="flex-1">
              <p className="text-yellow-100 font-semibold text-sm">
                LinkedIn Temporarily Unavailable
              </p>
              <p className="text-yellow-200 text-xs mt-0.5">
                Using demo mode. Your data is safe and will sync when LinkedIn
                is back online.{" "}
                <button
                  onClick={handleClearData}
                  className="underline hover:text-white transition-colors"
                >
                  Clear LinkedIn data
                </button>{" "}
                or{" "}
                <a
                  href="/LINKEDIN_ERROR_FIX.md"
                  target="_blank"
                  className="underline hover:text-white transition-colors"
                >
                  view fix guide
                </a>
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={checkLinkedInStatus}
                className="px-3 py-1.5 bg-yellow-700 hover:bg-yellow-600 text-white text-xs font-medium rounded-lg transition-colors"
              >
                Retry Connection
              </button>
              <button
                onClick={handleDismiss}
                className="p-1.5 text-yellow-300 hover:text-white transition-colors"
                aria-label="Dismiss"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}