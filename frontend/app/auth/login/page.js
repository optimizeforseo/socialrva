"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeToggle from "../../../components/ui/ThemeToggle";

export default function LinkedInLogin() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate authentication process
    setTimeout(() => {
      // Store mock user data
      const mockUser = {
        id: "12345",
        firstName: "John",
        lastName: "Doe",
        email: formData.email,
        profilePicture:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
        accessToken: "mock-access-token",
        connectedAt: new Date().toISOString(),
      };

      localStorage.setItem("user", JSON.stringify(mockUser));
      router.push("/dashboard");
    }, 2000);
  };

  const handleGoogleLogin = () => {
    alert("Google authentication coming soon!");
  };

  const handleAppleLogin = () => {
    alert("Apple authentication coming soon!");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Theme Toggle */}
      <ThemeToggle />

      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          {/* LinkedIn Logo */}
          <div className="flex justify-center mb-8">
            <svg className="w-32 h-8" viewBox="0 0 128 32" fill="none">
              <path
                d="M0 2.4h6.4v19.2H0V2.4zm3.2-2.4C1.44 0 0 1.44 0 3.2s1.44 3.2 3.2 3.2 3.2-1.44 3.2-3.2S4.96 0 3.2 0z"
                fill="#0077B5"
              />
              <path
                d="M9.6 8h6.08v2.88h.08c.85-1.6 2.91-3.28 5.99-3.28 6.4 0 7.59 4.21 7.59 9.69V28.8h-6.32V18.24c0-2.36-.04-5.39-3.28-5.39-3.29 0-3.79 2.57-3.79 5.22V28.8H9.6V8z"
                fill="#0077B5"
              />
              <path
                d="M32 2.4h6.4v19.2H32V2.4zm3.2-2.4c-1.76 0-3.2 1.44-3.2 3.2s1.44 3.2 3.2 3.2 3.2-1.44 3.2-3.2S36.96 0 35.2 0z"
                fill="#0077B5"
              />
              <path
                d="M41.6 8h6.08v2.88h.08c.85-1.6 2.91-3.28 5.99-3.28 6.4 0 7.59 4.21 7.59 9.69V28.8h-6.32V18.24c0-2.36-.04-5.39-3.28-5.39-3.29 0-3.79 2.57-3.79 5.22V28.8H41.6V8z"
                fill="#0077B5"
              />
              <path
                d="M64 8h6.08v2.88h.08c.85-1.6 2.91-3.28 5.99-3.28 6.4 0 7.59 4.21 7.59 9.69V28.8h-6.32V18.24c0-2.36-.04-5.39-3.28-5.39-3.29 0-3.79 2.57-3.79 5.22V28.8H64V8z"
                fill="#0077B5"
              />
              <path
                d="M86.4 2.4h6.4v19.2h-6.4V2.4zm3.2-2.4c-1.76 0-3.2 1.44-3.2 3.2s1.44 3.2 3.2 3.2 3.2-1.44 3.2-3.2S91.36 0 89.6 0z"
                fill="#0077B5"
              />
              <path
                d="M96 8h6.08v2.88h.08c.85-1.6 2.91-3.28 5.99-3.28 6.4 0 7.59 4.21 7.59 9.69V28.8h-6.32V18.24c0-2.36-.04-5.39-3.28-5.39-3.29 0-3.79 2.57-3.79 5.22V28.8H96V8z"
                fill="#0077B5"
              />
            </svg>
          </div>

          {/* Sign In Card */}
          <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center">
                Sign in
              </h2>
            </div>

            {/* Social Login Buttons */}
            <div className="space-y-3 mb-6">
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
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

              <button
                onClick={handleAppleLogin}
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                Sign in with Apple
              </button>
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                  or
                </span>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email or phone
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Email or phone"
                />
              </div>

              <div className="relative">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <div className="text-left">
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm"
                >
                  Forgot password?
                </a>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-full text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.email || !formData.password}
                  className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-full transition-colors disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Signing in...
                    </div>
                  ) : (
                    "Sign in"
                  )}
                </button>
              </div>
            </form>

            {/* Sign Up Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                New to LinkedIn?{" "}
                <a
                  href="#"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                >
                  Join now
                </a>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="flex flex-wrap justify-center items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              <span>LinkedIn © 2023</span>
              <a
                href="#"
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                User Agreement
              </a>
              <a
                href="#"
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                Community Guidelines
              </a>
              <a
                href="#"
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                Cookie Policy
              </a>
              <a
                href="#"
                className="hover:text-gray-700 dark:hover:text-gray-300"
              >
                Copyright Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
