"use client";

import { useState } from "react";

export default function LinkedInAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLinkedInLogin = async () => {
    setIsLoading(true);

    try {
      const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;

      // Check if LinkedIn credentials are configured
      if (!clientId || clientId === "your_linkedin_client_id_here") {
        setIsLoading(false);
        alert(
          "LinkedIn OAuth is not configured yet. Please check LINKEDIN_SETUP.md for setup instructions, or try Demo Mode below."
        );
        return;
      }

      const redirectUri = encodeURIComponent(
        process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI ||
          `${window.location.origin}/auth/callback`
      );
      const scope = encodeURIComponent(
        "r_liteprofile r_emailaddress w_member_social"
      );
      const state = encodeURIComponent("socialsonic-auth-" + Date.now());

      const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&state=${state}`;

      // Redirect to LinkedIn OAuth authorization page
      window.location.href = linkedinAuthUrl;
    } catch (error) {
      console.error("LinkedIn OAuth error:", error);
      setIsLoading(false);
      alert(
        "LinkedIn authentication failed. Please try demo mode or check your setup."
      );
    }
  };

  const handleDemoLogin = () => {
    setIsLoading(true);

    // Demo mode - simulate successful LinkedIn login
    const demoUser = {
      id: "demo-12345",
      firstName: "Demo",
      lastName: "User",
      email: "demo@socialsonic.com",
      profilePicture:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      accessToken: "demo-access-token",
      connectedAt: new Date().toISOString(),
      isDemoMode: true,
    };

    localStorage.setItem("user", JSON.stringify(demoUser));

    // Simulate loading time
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 1500);
  };

  const handleGoogleLogin = () => {
    // Placeholder for Google auth
    alert("Google authentication coming soon!");
  };

  return (
    <div className="space-y-4">
      {/* LinkedIn Login Button */}
      <button
        onClick={handleLinkedInLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-3 bg-linkedin hover:bg-linkedin-hover text-white font-medium rounded-lg transition-colors disabled:opacity-50 shadow-lg"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        {isLoading ? "Connecting..." : "Continue with LinkedIn"}
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
            OR
          </span>
        </div>
      </div>

      {/* Google Login Button */}
      <button
        onClick={handleGoogleLogin}
        className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-lg"
      >
        <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </button>

      {/* Demo Mode Button */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400">
            LinkedIn Down?
          </span>
        </div>
      </div>

      <button
        onClick={handleDemoLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors shadow-lg disabled:opacity-50"
      >
        <svg
          className="w-5 h-5 mr-3"
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
        {isLoading ? "Loading Demo..." : "Try Demo Mode"}
      </button>

      {/* Security Note */}
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
        Securely connect with LinkedIn to effortlessly schedule posts and craft
        personalized content 🔒
      </p>
    </div>
  );
}
