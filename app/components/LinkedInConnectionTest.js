"use client";

import { useState } from "react";

export default function LinkedInConnectionTest() {
  const [testResult, setTestResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const testLinkedInConnection = async () => {
    setIsLoading(true);
    setTestResult(null);

    try {
      // Check if user is authenticated
      const userData = localStorage.getItem("user");
      if (!userData) {
        setTestResult({
          success: false,
          message: "No user authentication found. Please log in first.",
        });
        return;
      }

      const user = JSON.parse(userData);

      if (user.isDemoMode) {
        setTestResult({
          success: true,
          message: "Demo mode active. LinkedIn features are simulated.",
          user: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
            mode: "Demo Mode",
          },
        });
        return;
      }

      // Test LinkedIn API connection
      const response = await fetch("https://api.linkedin.com/v2/me", {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      });

      if (response.ok) {
        const profileData = await response.json();
        setTestResult({
          success: true,
          message: "LinkedIn connection successful!",
          user: {
            name: `${profileData.localizedFirstName} ${profileData.localizedLastName}`,
            email: user.email,
            mode: "LinkedIn Connected",
            linkedInId: profileData.id,
          },
        });
      } else {
        setTestResult({
          success: false,
          message: "LinkedIn token expired or invalid. Please re-authenticate.",
        });
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: `Connection test failed: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">
        LinkedIn Connection Test
      </h3>

      <button
        onClick={testLinkedInConnection}
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 mb-4"
      >
        {isLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Testing...</span>
          </>
        ) : (
          <>
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
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Test LinkedIn Connection</span>
          </>
        )}
      </button>

      {testResult && (
        <div
          className={`p-4 rounded-lg ${
            testResult.success
              ? "bg-green-900/30 border border-green-700"
              : "bg-red-900/30 border border-red-700"
          }`}
        >
          <div className="flex items-center space-x-2 mb-2">
            {testResult.success ? (
              <svg
                className="w-5 h-5 text-green-400"
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
            ) : (
              <svg
                className="w-5 h-5 text-red-400"
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
            )}
            <span
              className={`font-medium ${
                testResult.success ? "text-green-300" : "text-red-300"
              }`}
            >
              {testResult.success ? "Success" : "Failed"}
            </span>
          </div>

          <p
            className={`text-sm mb-3 ${
              testResult.success ? "text-green-200" : "text-red-200"
            }`}
          >
            {testResult.message}
          </p>

          {testResult.user && (
            <div className="bg-slate-700 rounded p-3 text-sm">
              <div className="grid grid-cols-2 gap-2 text-gray-300">
                <div>
                  <strong>Name:</strong> {testResult.user.name}
                </div>
                <div>
                  <strong>Mode:</strong> {testResult.user.mode}
                </div>
                <div>
                  <strong>Email:</strong> {testResult.user.email}
                </div>
                {testResult.user.linkedInId && (
                  <div>
                    <strong>LinkedIn ID:</strong> {testResult.user.linkedInId}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 text-xs text-gray-400">
        <p>This test verifies your LinkedIn authentication and API access.</p>
        <p>
          If the test fails, check your OAuth credentials in the environment
          variables.
        </p>
      </div>
    </div>
  );
}
