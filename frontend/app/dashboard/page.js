"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Icon } from '../../components/ui/Icon';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: 'home', path: '/dashboard' },
    { id: 'analytics', label: 'Analytics', icon: 'bar-chart-3', path: '/analytics' },
    { id: 'insights', label: 'Insights', icon: 'brain', path: '/insights' },
    { id: 'create', label: 'Create Content', icon: 'plus-circle', path: '/create-ai' },
    { id: 'schedule', label: 'Schedule', icon: 'calendar', path: '/schedule' },
    { id: 'research', label: 'Research', icon: 'search', path: '/research' },
    { id: 'settings', label: 'Settings', icon: 'settings', path: '/settings' }
  ];

  const stats = [
    { label: 'Posts Created', value: '24', icon: 'file-text', color: 'from-blue-500 to-blue-600', change: '+12%' },
    { label: 'Engagement Rate', value: '8.5%', icon: 'trending-up', color: 'from-green-500 to-green-600', change: '+2.3%' },
    { label: 'Followers Growth', value: '+156', icon: 'users', color: 'from-purple-500 to-purple-600', change: '+18%' },
    { label: 'Content Score', value: '92', icon: 'star', color: 'from-orange-500 to-orange-600', change: '+5%' }
  ];

  const recentActivity = [
    { action: 'Created LinkedIn post about AI trends', time: '2 hours ago', icon: 'plus-circle', type: 'create' },
    { action: 'Scheduled content for tomorrow', time: '4 hours ago', icon: 'calendar', type: 'schedule' },
    { action: 'Analyzed competitor content', time: '1 day ago', icon: 'eye', type: 'research' },
    { action: 'Updated content preferences', time: '2 days ago', icon: 'settings', type: 'settings' }
  ];

  const handleNavigation = (item) => {
    if (item.path) {
      router.push(item.path);
    } else {
      setActiveSection(item.id);
    }
  };

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <motion.aside
        initial={{ width: sidebarExpanded ? 280 : 80 }}
        animate={{ width: sidebarExpanded ? 280 : 80 }}
        transition={{ duration: 0.3 }}
        className="bg-slate-900/50 backdrop-blur-xl border-r border-blue-500/30 flex flex-col"
      >
        {/* Sidebar Header */}
        <div className="p-6 border-b border-blue-500/20">
          <div className="flex items-center justify-between">
            <AnimatePresence>
              {sidebarExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center space-x-3"
                >
                  <img 
                    src="/socialrva-logo-full.png" 
                    alt="SocialRva" 
                    className="h-8 object-contain"
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Icon name={sidebarExpanded ? "chevron-left" : "chevron-right"} size={18} />
            </motion.button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item, index) => (
              <motion.button
                key={item.id}
                onClick={() => handleNavigation(item)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                  activeSection === item.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                    : 'text-gray-400 hover:text-white hover:bg-slate-800/50'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon 
                  name={item.icon} 
                  size={20} 
                  className={activeSection === item.id ? "text-white" : "text-current group-hover:text-blue-400"}
                />
                <AnimatePresence>
                  {sidebarExpanded && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-blue-500/20">
          <div className={`flex items-center ${sidebarExpanded ? 'space-x-3' : 'justify-center'}`}>
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={user.fullName}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <Icon name="user" size={18} className="text-white" />
              </div>
            )}
            
            <AnimatePresence>
              {sidebarExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex-1 min-w-0"
                >
                  <div className="text-white font-medium truncate">{user?.fullName}</div>
                  <div className="text-gray-400 text-sm truncate">{user?.email}</div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-slate-800/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Logout"
            >
              <Icon name="log-out" size={16} />
            </motion.button>
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/30 backdrop-blur-xl border-b border-blue-500/20 p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
              <p className="text-gray-400 mt-1">Welcome back, {user?.firstName}! Here's your social media performance.</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <motion.button
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg flex items-center space-x-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/create-ai')}
              >
                <Icon name="plus" size={16} />
                <span>Create Content</span>
              </motion.button>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 bg-slate-900/50 rounded-xl border border-blue-500/30 backdrop-blur-sm hover:border-blue-500/50 transition-all group"
                whileHover={{ y: -2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon name={stat.icon} size={20} className="text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <div className="text-green-400 text-sm font-medium">{stat.change}</div>
                  </div>
                </div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2 p-6 bg-slate-900/50 rounded-xl border border-blue-500/30 backdrop-blur-sm"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white flex items-center">
                  <Icon name="activity" size={20} className="mr-2 text-blue-400" />
                  Recent Activity
                </h3>
                <button className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors">
                  View All
                </button>
              </div>
              
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-slate-800/50 transition-colors group cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center group-hover:bg-blue-600/30 transition-colors">
                      <Icon name={activity.icon} size={16} className="text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="text-white text-sm font-medium">{activity.action}</div>
                      <div className="text-gray-400 text-xs">{activity.time}</div>
                    </div>
                    <Icon name="chevron-right" size={16} className="text-gray-500 group-hover:text-gray-400 transition-colors" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 bg-slate-900/50 rounded-xl border border-blue-500/30 backdrop-blur-sm"
            >
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
                <Icon name="zap" size={20} className="mr-2 text-blue-400" />
                Quick Actions
              </h3>
              
              <div className="space-y-3">
                {[
                  { label: 'Create Post', icon: 'plus', color: 'from-blue-600 to-blue-700', path: '/create-ai' },
                  { label: 'View Analytics', icon: 'bar-chart-3', color: 'from-green-600 to-green-700', path: '/analytics' },
                  { label: 'Schedule Content', icon: 'calendar', color: 'from-purple-600 to-purple-700', path: '/schedule' },
                  { label: 'Research Topics', icon: 'search', color: 'from-orange-600 to-orange-700', path: '/research' }
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    onClick={() => router.push(action.path)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className={`w-full p-4 bg-gradient-to-r ${action.color} rounded-xl text-white font-semibold hover:scale-105 transition-transform shadow-lg flex items-center space-x-3`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon name={action.icon} size={18} />
                    <span>{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Performance Chart Placeholder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 p-6 bg-slate-900/50 rounded-xl border border-blue-500/30 backdrop-blur-sm"
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
              <Icon name="trending-up" size={20} className="mr-2 text-blue-400" />
              Performance Overview
            </h3>
            
            <div className="h-64 bg-slate-800/50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Icon name="bar-chart-3" size={48} className="text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">Performance chart will be displayed here</p>
                <p className="text-gray-500 text-sm mt-2">Connect your social accounts to see analytics</p>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}