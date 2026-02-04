"use client";

export default function Header({ user }) {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 px-6 py-4 fixed top-0 right-0 left-64 z-20 backdrop-blur-md shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent flex items-center">
            Good afternoon, {user.firstName}!
            <span className="ml-2 text-white">👋</span>
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium text-sm shadow-lg">
            {user.firstName?.charAt(0)}
            {user.lastName?.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}