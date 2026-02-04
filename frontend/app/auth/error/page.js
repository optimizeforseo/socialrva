"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const errorType = searchParams.get("type");
  const errorMessage = searchParams.get("message");

  const getErrorDetails = () => {
    switch (errorType) {
      case "scope":
        return {
          title: "Permission Error",
          icon: "🔒",
          message: errorMessage || "Required permissions not enabled",
          solution: [
            "Go to LinkedIn Developers Console",
            "Select your app",
            "Click 'Products' tab",
            "Add 'Sign In with LinkedIn using OpenID Connect'",
            "Add 'Share on LinkedIn' (for posting)",
            "Wait for approval (usually instant)",
            "Try logging in again",
          ],
          link: "https://www.linkedin.com/developers/apps",
          linkText: "Open LinkedIn Developers",
        };

      case "denied":
        return {
          title: "Access Denied",
          icon: "🚫",
          message: errorMessage || "You denied access to LinkedIn",
          solution: [
            "Click 'Try Again' below",
            "Approve the requested permissions",
            "These permissions are needed for the app to work",
          ],
        };

      case "no_code":
        return {
          title: "Authentication Failed",
          icon: "❌",
          message: errorMessage || "No authorization code received",
          solution: [
            "Check your internet connection",
            "Try clearing browser cache",
            "Try a different browser",
            "Use Demo Mode to explore the app",
          ],
        };

      default:
        return {
          title: "Authentication Error",
          icon: "⚠️",
          message: errorMessage || "Something went wrong",
          solution: [
            "Try logging in again",
            "Check your LinkedIn credentials",
            "Use Demo Mode as an alternative",
          ],
        };
    }
  };

  const errorDetails = getErrorDetails();

  const handleTryAgain = () => {
    router.push("/");
  };

  const handleDemoMode = () => {
    const demoUser = {
      id: "demo-user-123",
      email: "demo@example.com",
      firstName: "Demo",
      lastName: "User",
      profilePicture: null,
      accessToken: "demo-token",
      isDemoMode: true,
    };

    localStorage.setItem("user", JSON.stringify(demoUser));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-2xl w-full">
        {/* Error Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl shadow-2xl border border-slate-700/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-900/30 to-orange-900/30 border-b border-red-700/50 p-6">
            <div className="flex items-center space-x-4">
              <div className="text-5xl">{errorDetails.icon}</div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {errorDetails.title}
                </h1>
                <p className="text-red-200 mt-1">{errorDetails.message}</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Solution Steps */}
            <div>
              <h2 className="text-lg font-semibold text-white mb-3">
                How to Fix:
              </h2>
              <ol className="space-y-2">
                {errorDetails.solution.map((step, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="text-slate-300 text-sm pt-0.5">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {/* External Link */}
            {errorDetails.link && (
              <a
                href={errorDetails.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 text-center"
              >
                {errorDetails.linkText} →
              </a>
            )}

            {/* Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                onClick={handleTryAgain}
                className="bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
              >
                Try Again
              </button>
              <button
                onClick={handleDemoMode}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200"
              >
                Use Demo Mode
              </button>
            </div>

            {/* Help Text */}
            <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-400 text-sm">
                <strong className="text-white">Need more help?</strong> Check
                the{" "}
                <a
                  href="/LINKEDIN_OAUTH_FIX.md"
                  target="_blank"
                  className="text-blue-400 hover:text-blue-300 underline"
                >
                  OAuth Fix Guide
                </a>{" "}
                or use Demo Mode to explore all features without LinkedIn
                connection.
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push("/")}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
          <div className="text-white">Loading...</div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
