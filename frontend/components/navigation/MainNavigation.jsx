"use client";

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function MainNavigation({ user }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Smart Dashboard',
      icon: '🏠',
      path: '/dashboard',
      description: 'AI-powered insights and analytics',
      badge: 'New'
    },
    {
      id: 'create',
      label: 'Create with AI',
      icon: '✨',
      path: '/create-ai',
      description: 'Generate content with AI'
    },
    {
      id: 'research',
      label: 'Research Hub',
      icon: '🔍',
      path: '/research',
      description: 'Trending topics and insights',
      badge: 'Beta'
    },
    {
      id: 'posts',
      label: 'My Posts',
      icon: '📝',
      path: '/posts',
      description: 'Manage your content'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📊',
      path: '/analytics',
      description: 'Performance metrics'
    },
    {
      id: 'carousel',
      label: 'Carousels',
      icon: '🎠',
      path: '/carousel',
      description: 'Create engaging carousels'
    },
    {
      id: 'engage',
      label: 'Engage',
      icon: '⚡',
      path: '/engage',
      description: 'Community management',
      badge: 'Coming Soon'
    },
    {
      id: 'topvoice',
      label: 'Top Voice',
      icon: '🎤',
      path: '/top-voice',
      description: 'Build thought leadership',
      badge: 'Coming Soon'
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <>
      {/* Mobile Navigation Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-slate-800 text-white rounded-lg shadow-lg"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
        </svg>
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-80 bg-slate-800 border-r border-slate-700 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">SocialRva</h1>
              <p className="text-sm text-gray-400">Guided Social Growth</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                {user?.firstName?.[0] || 'U'}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">
                {user?.firstName || 'User'} {user?.lastName || 'Name'}
              </p>
              <p className="text-sm text-gray-400 truncate">
                {user?.isDemoMode ? 'Demo Mode' : 'Premium User'}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              {!user?.isDemoMode && (
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              )}
              {user?.isDemoMode && (
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => {
            const isActive = pathname === item.path;
            const isDisabled = item.badge === 'Coming Soon';
            
            return (
              <Link
                key={item.id}
                href={isDisabled ? '#' : item.path}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault();
                    return;
                  }
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : isDisabled
                    ? 'text-gray-500 cursor-not-allowed'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium truncate">{item.label}</span>
                    {item.badge && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.badge === 'New' 
                          ? 'bg-green-600 text-white'
                          : item.badge === 'Beta'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-600 text-gray-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 truncate">{item.description}</p>
                </div>
                {!isDisabled && (
                  <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" 
                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-700 space-y-3">
          {/* Usage Stats */}
          <div className="p-3 bg-slate-700 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-300">AI Credits</span>
              <span className="text-sm font-medium text-white">
                {user?.isDemoMode ? '5/5' : '47/100'}
              </span>
            </div>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: user?.isDemoMode ? '100%' : '47%' }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              {user?.isDemoMode ? 'Demo credits' : 'Resets monthly'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Upgrade to Pro</span>
            </button>
            
            <div className="flex space-x-2">
              <button className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm transition-colors">
                Settings
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-lg text-sm transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}