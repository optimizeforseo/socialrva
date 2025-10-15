"use client";

import LinkedInAuth from "./components/LinkedInAuth";
import LinkedInAnalytics from "./components/LinkedInAnalytics";
import ThemeToggle from "./components/ThemeToggle";
import DebugInfo from "./components/DebugInfo";
import LinkedInStatus from "./components/LinkedInStatus";

export default function Home() {
  return (
    <div className="h-screen overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
      {/* Theme Toggle */}
      <ThemeToggle />

      {/* LinkedIn Status */}
      <LinkedInStatus />

      {/* Debug Info */}
      <DebugInfo />

      <div className="h-full flex items-center">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center h-full max-h-screen">
            {/* Left Side - Authentication */}
            <div className="flex flex-col justify-center">
              <div className="max-w-md mx-auto w-full">
                {/* Logo */}
                <div className="text-center mb-10">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-full mb-6 shadow-lg">
                    <span className="text-white text-2xl font-bold">S</span>
                  </div>
                  <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                    Let's get started
                  </h1>
                  <p className="text-gray-600 dark:text-gray-300 text-lg">
                    Get hyper-personalized, ready to publish LinkedIn content in
                    minutes.
                  </p>
                </div>

                {/* LinkedIn Auth Component */}
                <LinkedInAuth />

                {/* Terms */}
                <div className="text-center mt-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    By continuing you agree to the{" "}
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Terms of use
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Privacy policy
                    </a>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Side - LinkedIn Analytics */}
            <div className="flex flex-col justify-center h-full py-8">
              <div className="max-h-full overflow-y-auto scrollbar-hide">
                <LinkedInAnalytics />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
