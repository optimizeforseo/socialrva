"use client";

import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-6 right-6 z-50 p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        // Moon icon for dark mode
        <svg
          className="w-5 h-5 text-gray-800"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
        </svg>
      ) : (
        // Sun icon for light mode
        <svg
          className="w-5 h-5 text-yellow-500"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12,2.25a.75.75,0,0,0,.75-.75V.75a.75.75,0,0,0-1.5,0V1.5A.75.75,0,0,0,12,2.25ZM19.07,4.93a.75.75,0,0,0,1.06-1.06L19.07,2.81a.75.75,0,0,0-1.06,1.06ZM21.75,12a.75.75,0,0,0,.75-.75h.75a.75.75,0,0,0,0-1.5H22.5A.75.75,0,0,0,21.75,12ZM19.07,19.07a.75.75,0,0,0,1.06,1.06l1.06-1.06a.75.75,0,0,0-1.06-1.06ZM12,21.75a.75.75,0,0,0-.75.75v.75a.75.75,0,0,0,1.5,0V22.5A.75.75,0,0,0,12,21.75ZM4.93,19.07a.75.75,0,0,0-1.06,1.06L4.93,21.19a.75.75,0,0,0,1.06-1.06ZM2.25,12a.75.75,0,0,0-.75.75H.75a.75.75,0,0,0,0,1.5H1.5A.75.75,0,0,0,2.25,12ZM4.93,4.93A.75.75,0,0,0,4.93,3.87L3.87,4.93A.75.75,0,0,0,4.93,4.93ZM12,6.75A5.25,5.25,0,1,0,17.25,12,5.26,5.26,0,0,0,12,6.75Zm0,9A3.75,3.75,0,1,1,15.75,12,3.75,3.75,0,0,1,12,15.75Z" />
        </svg>
      )}
    </button>
  );
}
